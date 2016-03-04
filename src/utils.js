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
const getFiles = glob => globby(glob, {nodir: true });

/**
 * Utility function to test if a value COULD be a glob. A single string or
 * an Array of strings counts. Just because this returns true, however,
 * doesn't mean it is a glob that makes sense, just that it looks like one.
 *
 * @param {String || Array} candidate
 * @return Boolean
 */
function isGlob (candidate) {
  if (typeof candidate === 'string' && candidate.length > 0) { return true; }
  if (Array.isArray(candidate) && candidate.length > 0) {
    return candidate.every(candidateEl => typeof candidateEl === 'string');
  }
  return false;
}

/**
 * Take a glob; read the files. Return a Promise that ultimately resolves
 * to an Array of objects:
 * [{ path: original filepath,
 *   contents: utf-8 file contents}...]
 */
function readFiles (glob) {
  return getFiles(glob).then(paths => {
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
 * @param {String} str    filepath
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
function titleCase (str) {
  return str
    .toLowerCase()
    .replace(/(\-|_)/g, ' ')
    .replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.substr(1));
}

/**
 * Perform a deep merge of two objects.
 * @param {Object} target
 * @param {Object} source
 * @return {Object}
 * @example merge(defaults, options);
 */
function merge (target, source) {
  Object.keys(source).forEach(key => {
    if (Object.isExtensible(source[key])) {
      merge(target[key], source[key]);
    } else {
      if (typeof source[key] !== 'undefined') {
        target[key] = source[key];
      }
    }
  });
  return target;
}

export { dirname,
         getFiles,
         isGlob,
         keyname,
         merge,
         parentDirname,
         readFiles,
         readFilesKeyed,
         titleCase
       };
