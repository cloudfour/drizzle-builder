import globby from 'globby';
import Promise from 'bluebird';
import path from 'path';
import {readFile as readFileCB} from 'fs';
var readFile = Promise.promisify(readFileCB);

/* Helper functions */
const basename = filepath => path.basename(filepath, path.extname(filepath));
const dirname  = filepath => path.normalize(path.dirname(filepath));
const parentDirname = filepath => dirname(filepath).split(path.sep).pop();
const removeNumbers = str  => str.replace(/^[0-9|\.\-]+/, '');

/**
 * Take a glob; read the files. Return a Promise that ultimately resolves
 * to an Array of objects:
 * [{ path: original filepath,
 *   contents: utf-8 file contents}...]
 */
function readFiles (glob) {
  return globby(glob, { nodir: true }).then(paths => {
    var fileReadPromises = paths.map(path => {
      return readFile(path, 'utf-8')
        .then(contents => ({ path, contents }));
    });
    return Promise.all(fileReadPromises);
  });
}

/**
 * Read the files from a glob, but then instead of resolving the
 * Promise with an Array of objects (@see readFiles), resolve with a
 * single object; each file's contents is keyed by its filename run
 * through keyname().
 *
 */
function readFilesKeyed (glob, preserveNumbers = false) {
  return readFiles(glob).then(allFileData => {
    const keyedFileData = new Object();
    for (var aFile of allFileData) {
      keyedFileData[keyname(aFile.path, preserveNumbers)] = aFile.contents;
    }
    return keyedFileData;
  });
}

/**
 * Utility function to provide a consistent "key" for elements, materials,
 * partials, etc, based on a filepath:
 * - replace whitespace characters with `-`
 * - use only the basename, no extension
 * - unless preserveNumbers, remove numbers from the string as well
 *
 * @param {String} str    Typically a filepath
 * @param {Boolean} preserveNumbers
 * @return {String}
 */
function keyname (str, preserveNumbers = false) {
  const name = basename(str).replace(/\s/g, '-');
  return (preserveNumbers) ? name : removeNumbers(name);
}

/**
 * Convert str to title case (every word will be capitalized)
 * @param {String} str
 * @return {String}
 */
function toTitleCase (str) {
  return str
    .toLowerCase()
    .replace(/(\-|_)/g, ' ')
    .replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.substr(1));
}

export { dirname,
         keyname,
         parentDirname,
         readFiles,
         readFilesKeyed,
         toTitleCase
       };
