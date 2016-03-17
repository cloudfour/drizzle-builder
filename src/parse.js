import * as utils from './utils';
import Promise from 'bluebird';
import marked from 'marked';

/**
 * Given an object representing a page or pattern or other file:
 * If that object has a `data` property, use that to
 * create the right kind of context for the object. Process relevant fields
 * with markdown.
 */
function parseLocalData (fileObj, options) {
  const mdFields = options.markdownFields || [];
  if (fileObj.data && typeof fileObj.data === 'object') {
    // First, clean up data object by running markdown over relevant fields
    mdFields.forEach(mdField => {
      if (fileObj.data[mdField]) {
        fileObj.data[mdField] = marked(fileObj.data[mdField]);
      }
    });
    for (var dataKey in fileObj.data) {
      fileObj[dataKey] = fileObj.data[dataKey];
    }
    delete fileObj.data;
  }
  return fileObj;
}

/**
 * Build a single-page object for the page data object
 */
function pageEntry (pageFile, keys, options) {
  const idKeys = keys.map(utils.keyname);
  const pathKey = utils.keyname(pageFile.path);
  const id = idKeys.concat(pathKey).join('.');
  return Object.assign(parseLocalData(pageFile, options), pageFile, {
    id,
    name: utils.titleCase(pathKey)
  });
}

/**
 * Parse pages files and build context object
 */
function parsePages (options) {
  return parseRecursive(options.pages, options.keys.pages, pageEntry, options);
}

/**
 * Build a single-pattern object for the pattern object
 */
function patternEntry (patternFile, keys, options) {
  const idKeys = keys.map(key => utils.keyname(key));
  const pathKey = utils.keyname(patternFile.path);
  const id = idKeys.concat(pathKey).join('.');
  return Object.assign(parseLocalData(patternFile, options),  patternFile,
    {
      id,
      name: utils.titleCase(pathKey)
    });
}

/**
 * Parse patterns files and build context object
 */
function parsePatterns (options) {
  return parseRecursive(options.patterns,
    options.keys.patterns, patternEntry, options);
}
/**
 * Parse a file structure of files matching `glob` into a nested object
 * structure:
 * { name: 'Directory Name in Title Case',
 *   items: {
 *     name: 'Sub Directory',
 *     items: { ... },
 *     'item-in-topdirectory': {
 *       name: 'Item In Top Directory',
 *       items: {   }
 *     }
 *   }
 * }
 *
 * Each object in `items` will be an object structured per the return value
 * of the parser associated with that file path pattern.
 */
function parseRecursive (glob, relativeKey, entryFn, options) {
  if (typeof entryFn !== 'function') {
    options = entryFn;
    entryFn = patternEntry;
  }
  const objectData = {};
  return utils.readFiles(glob, options).then(fileData => {
    fileData.forEach(objectFile => {
      const entryKey = utils.keyname(objectFile.path, { stripNumbers: false });
      const keys     = utils.relativePathArray(objectFile.path, relativeKey);
      utils.deepRef(keys, objectData)
        .items[entryKey] = entryFn(objectFile, keys, options);
    });
    return objectData[relativeKey];
  });
}

/**
 * Parse a glob of files into flat-keyed object (no nested objects). Objects
 * will take form of return value from associated parser for the given file
 * path.
 * @TODO namespace conflicts, then what?
 * @param {glob} glob
 * @param {Object} options
 * @return {Promise} resolving to {Object}
 */
function parseFlat (glob, options) {
  return utils.readFilesKeyed(glob, options);
}


// @TODO Figure out how to emulate "local namespacing" of HBS vars
// so that one can reference data from front matter in patterns
// @TODO Do we need to trim whitespace from pattern content?
// @TODO Do we need to store pattern data on another object as well?
// @TODO Do we need any further sorting?
// @TODO Need to register Handlebars partial

/**
 * Parse all the items needed for a drizzle build.
 */
function parseAll (options = {}) {
  return Promise.all([
    parseFlat(options.data, options),
    parseFlat(options.layouts, options),
    parsePages(options),
    parsePatterns(options)
  ]).then(allData => {
    return {
      data    : allData[0],
      layouts : allData[1],
      pages   : allData[2],
      patterns: allData[3]
    };
  });
}

export { parseAll,
         parseFlat,
         parseRecursive
       };
