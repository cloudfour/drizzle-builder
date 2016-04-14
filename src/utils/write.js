import path from 'path';
import Promise from 'bluebird';
import {writeFile as writeFileCB} from 'fs';
import {mkdirp as mkdirpCB} from 'mkdirp';
import { idKeys } from './shared';
var writeFile = Promise.promisify(writeFileCB);
var mkdirp    = Promise.promisify(mkdirpCB);

/**
 * Write `contents` to path at `filepath`
 * @param {String} filepath
 * @param {String} contents
 * @return {Promise}
 */
function write (filepath, contents) {
  return mkdirp(path.dirname(filepath)).then(() => {
    return writeFile(filepath, contents);
  });
}

/**
 * Take an object's contents and write them to an HTML file on the filesystem.
 * @param {String} resourceId   e.g. pages.follow-me.down `.`-separated ID
 *                              representing the hierarchical position of the
 *                              resource in its object structure. Will be used
 *                              to derive output path.
 * @param {Object} resourceObj  The object to output. Must have `contents` prop
 * @param {String} pathPrefix   The output path prefix (as defined in
 *                              options.dest—@see defaults).
 * @param {String} idPrefix     Expected resource-type prefix on ID string. This
 *                              string will be removed from the front of the
 *                              path. E.g. a resourceId of `pages.one.two`
 *                              and `idPrefix` of `pages` will remove the
 *                              'pages' entry from the path.
 * @return {Promise}
 */
function writePage (resourceId, resourceObj, pathPrefix, idPrefix = '') {
  const subPath = idKeys(resourceId);
  if (subPath.length && idPrefix && subPath[0] === idPrefix) {
    subPath.shift();
  }
  const filename = subPath.pop() + '.html';
  const outputPath = path.normalize(path.join(
    pathPrefix,
    subPath.join(path.sep),
    filename
  ));
  resourceObj.outputPath = outputPath;
  return write(outputPath, resourceObj.contents);
}

export { write, writePage };
