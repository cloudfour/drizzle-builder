import globby from 'globby';
import Promise from 'bluebird';
import path from 'path';
import {readFile as readFileCB} from 'fs';
var readFile = Promise.promisify(readFileCB);

/* Helper functions */

function basename (filepath) {
  return path.basename(filepath, path.extname(filepath));
}
function dirname (filepath) {
  return path.normalize(path.dirname(filepath));
}
function parentDirname (filepath) {
  return dirname(filepath).split(path.sep).pop();
}
function removeLeadingNumbers (str) {
  return str.replace(/^[0-9|\.\-]+/, '');
}
/**
 * @param {glob} glob
 * @return {Promise} resolving to {Array} of files matching glob
 */
function getFiles (glob) {
  return globby(glob, { nodir: true });
}

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
 * Take a glob; read the files, optionally running a `contentFn` over
 * the contents of the file.
 *
 * @param {glob} glob of files to read
 * @param {Object} Options:
 *  - {Function} contentFn(content, path): optional function to run over content
 * in files; defaults to a no-op
 *  - {String} encoding
 *
 * @return {Promise} resolving to Array of Objects:
 *  - {String} path
 *  - {String || Mixed} contents: contents of file after contentFn
 */
function readFiles (glob, {
  contentFn = (content, path) => content,
  encoding = 'utf-8'
} = {}) {
  return getFiles(glob).then(paths => {
    return Promise.all(paths.map(path => {
      return readFile(path, encoding)
        .then(contents => {
          contents = contentFn(contents, path);
          return { path, contents };
        });
    }));
  });
}

/**
 * Read the files from a glob, but then instead of resolving the
 * Promise with an Array of objects (@see readFiles), resolve with a
 * single object; each file's contents is keyed by its filename run
 * through optional keyFn(filePath, options) (default: keyname).
 * Will pass other options on to readFiles and keyFn
 *
 * @param {glob}
 * @param {Object} options (all optional):
 *  - keyFn
 *  - contentFn
 *  - stripNumbers
 * @return {Promise} resolving to {Object} of keyed file contents
 */
function readFilesKeyed (glob, options = {}) {
  const {
    keyFn = keyname
  } = options;
  return readFiles(glob, options).then(allFileData => {
    const keyedFileData = new Object();
    for (var aFile of allFileData) {
      keyedFileData[keyFn(aFile.path, options)] = aFile.contents;
    }
    return keyedFileData;
  });
}

/**
 * Utility function to provide a consistent "key" for elements, materials,
 * partials, etc, based on a filepath:
 * - replace whitespace characters with `-`
 * - use only the basename, no extension
 * - unless stripNumbers option false, remove numbers from the string as well
 *
 * @param {String} str    filepath
 * @param {Object} options
 * @return {String}
 */
function keyname (str, { stripNumbers = true } = {}) {
  const name = basename(str).replace(/\s/g, '-');
  return (stripNumbers) ? removeLeadingNumbers(name) : name;
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
