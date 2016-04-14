import globby from 'globby';
import Promise from 'bluebird';
import {readFile as readFileCB} from 'fs';
var readFile = Promise.promisify(readFileCB);
import { relativePathArray } from './shared';
import { deepObj, resourceKey, resourceId } from './object'; // TODO NO NO NO NO
import DrizzleError from './error';

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
 * @param {String} or {Array} candidate
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
 * Evaluate a single field of data and see if it should be run through a parser.
 * @param {String} fieldKey
 * @param {Object|String} fieldData
 * @param {Object} options
 * @return {Object} parsed data; contains `contents` property.
 * @see parse/parsers
 */
function parseField (fieldKey, fieldData, options) {
  let parseFn = contents => ({ contents: contents });
  let contents = fieldData;
  // Check to see if options.fieldParsers contains this key
  if (options.fieldParsers.hasOwnProperty(fieldKey)) {
    const parserKey = options.fieldParsers[fieldKey];
    parseFn = options.parsers[parserKey].parseFn;
    contents = (typeof fieldData === 'string') ? fieldData : fieldData.contents;
  }
  // Check to see if there is a manually-added parser in the data
  if (typeof fieldData === 'object' && fieldData.hasOwnProperty('parser')) {
    if (options.parsers.hasOwnProperty(fieldData.parser)) {
      parseFn = options.parsers[fieldData.parser].parseFn;
    }
    else {
      DrizzleError.error(new DrizzleError(
        `parser '${fieldData.parser}' set on field '${fieldKey}' not defined`,
        DrizzleError.LEVELS.WARN), options.debug);
    }
    contents = fieldData.contents;
    if (!fieldData.hasOwnProperty('contents')) {
      // TODO again
    }
  }
  return parseFn(contents);
}

/**
 * Given an object representing a page or pattern or other file:
 * If that object has a `data` property, use that to
 * create the right kind of context for the object. Parse field data with
 * any indicated parsers.
 * @TODO is `extendedData` used by any callers?
 */
function parseLocalData (fileObj, options, extendedData = {}) {
  fileObj.data = fileObj.data || {};
  for (const dataKey in fileObj.data) {
    const parsedField = parseField(dataKey, fileObj.data[dataKey], options);
    fileObj.data[dataKey] = parsedField.contents;
  }
  Object.assign(fileObj, extendedData);
  return fileObj;
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
 * single tree object. Keys are filenames without extensions.
 * @example readFileTree(glob, 'pages', {...}) where the following
 *          file structure matches:
 * pages
 *  ├── components.html
 *  ├── index.html
 *  └── subfolder
 *    └── subpage.md
 *
 * Would result in an object structured:
 * { components: { [file data]},
 *   index: { [file data]}
 *   subfolder: {
 *     subpage: { [file data]}
 * }
 *
 * @param {Object} src    Object with properties `glob` and `basedir`
 *                        @see defaults
 * @param {String} prefix Key to prefix items in this object with when creating
 *                        ids. e.g. 'patterns', 'pages'
 * @param {Object} options
 * @return {Promise} resolving to {Object} of keyed file contents
 */
function readFileTree (src, prefix, options) {
  const fileTree = {};
  return readFiles(src.glob, options).then(fileData => {
    fileData.forEach(itemFile => {
      const fileKeys = relativePathArray(itemFile.path, src.basedir);
      itemFile.id = resourceId(itemFile, src.basedir, prefix);
      deepObj(fileKeys, fileTree)[resourceKey(itemFile)] = parseLocalData(
        itemFile, options);
    });
    return fileTree;
  });
}

export { getFiles,
         isGlob,
         matchParser,
         parseField,
         parseLocalData,
         readFiles,
         readFileTree
       };
