import path from 'path';
import Promise from 'bluebird';
import { writeFile as writeFileCB } from 'fs';
import { mkdirp as mkdirpCB } from 'mkdirp';
import { resourcePath } from './shared';
var writeFile = Promise.promisify(writeFileCB);
var mkdirp = Promise.promisify(mkdirpCB);

/**
 * Write `contents` to path at `filepath`
 * @param {String} filepath
 * @param {String} contents
 * @return {Promise}
 */
function write(filepath, contents) {
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
 * @return {Promise}
 */
function writePage(resourceId, resourceObj, pathPrefix) {
  const outputPath = resourcePath(resourceId, pathPrefix);
  resourceObj.outputPath = outputPath;
  return write(outputPath, resourceObj.contents);
}

export { write, writePage };
