import path from 'path';
import Promise from 'bluebird';
import {writeFile as writeFileCB} from 'fs';
import {mkdirp as mkdirpCB} from 'mkdirp';
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
 * Write a single resource (e.g. page or pattern-collection) to
 * the filesystem. Update the resourceObj with the outputPath.
 *
 * @param {Array} entryKeys   path elements leading to resource
 * @param {Object} resourceObj
 * @param {String} destPath   path prefix for dest output.
 *                            @see defaults.dest
 * @return {Promise}
 */
function writeResource (entryKeys, resourceObj, destPath) {
  const filename = entryKeys.pop();
  const outputPath = path.join(
    entryKeys.join(path.sep),
    `${filename}.html`
  );
  const fullPath = path.normalize(path.join(
    destPath,
    outputPath
  ));
  resourceObj.outputPath = fullPath;
  return write(fullPath, resourceObj.contents);
}

export { write, writeResource };
