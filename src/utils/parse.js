import globby from 'globby';
import Promise from 'bluebird';
import {readFile as readFileCB} from 'fs';
var readFile = Promise.promisify(readFileCB);
import { keyname } from './object'; // TODO FIX

/**
 * @param {glob} glob
 * @return {Promise} resolving to {Array} of filepaths matching glob
 */
function getFiles (glob, globOpts = {}) {
  const opts = Object.assign({
    nodir: true
  }, globOpts);
  return globby(glob, opts);
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
 * Retrieve the correct parsing function for a file based on its
 * path. Each parser with a `pattern` property will compile that pattern
 * to a RegExp and test it against the filepath. If no match is found
 * against any of the parsers by path pattern, a default parser will be
 * returned: either a parser keyed by `default` in the `parsers` object
 * or, lacking that, a default function that leaves the contents of the
 * file untouched.
 *
 * @param {String} filepath
 * @param {Object} parsers
 * @see options module
 * @return {Function} applicable parsing function for file contents
 */
function matchParser (filepath, parsers = {}) {
  for (var parserKey in parsers) {
    if (parsers[parserKey].pattern) {
      if (new RegExp(parsers[parserKey].pattern).test(filepath)) {
        return parsers[parserKey].parseFn;
      }
    }
  }
  return (parsers.default && parsers.default.parseFn) ||
    ((contents, filepath) => ({ contents: contents }));
}

/**
 * Take a glob; read the files, optionally running a `contentFn` over
 * the contents of the file.
 *
 * @param {glob} glob of files to read
 * @param {Object} Options:
 *  - {Object} available parsers
 *  - {String} encoding
 *  - {Object} globOpts gets passed to getFiles
 * @return {Promise} resolving to Array of Objects:
 *  - {String} path
 *  - {String || Mixed} contents: contents of file after contentFn
 */
function readFiles (glob, {
  parsers = {},
  encoding = 'utf-8',
  globOpts = {}
} = {}) {
  return getFiles(glob, globOpts).then(paths => {
    return Promise.all(paths.map(filepath => {
      return readFile(filepath, encoding)
        .then(fileData => {
          const parser = matchParser(filepath, parsers);
          fileData = parser(fileData, filepath);
          if (typeof fileData === 'string') {
            fileData = { contents: fileData };
          }
          return Object.assign(fileData, { path: filepath });
        });
    }));
  });
}

/**
 * Read the files from a glob, but then instead of resolving the
 * Promise with an Array of objects (@see readFiles), resolve with a
 * single object; each file's contents is keyed by its filename run
 * through optional `keyFn(filePath, options)`` (default: keyname).
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
    keyFn = (path, options) => keyname(path, options)
  } = options;
  return readFiles(glob, options).then(allFileData => {
    const keyedFileData = new Object();
    for (var aFile of allFileData) {
      keyedFileData[keyFn(aFile.path, options)] = aFile;
    }
    return keyedFileData;
  });
}

export { getFiles, // glob
         isGlob, // glob
         matchParser, // parse
         readFiles, // parse
         readFilesKeyed // parse
       };
