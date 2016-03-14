import frontMatter from 'front-matter';
import * as utils from './utils';
import Promise from 'bluebird';

/**
 * Read files in options.layouts and key them
 * Layouts are HTML documents that get wrapped around pages
 *
 * @param {Object} options with
 *  - {glob} layouts   glob of layout files to parse
 * @return {Promise} resolving to keyed file contents
 */
function parseLayouts (layouts, options) {
  return utils.readFilesKeyed(layouts, options);
}

/**
 * Read and parse files in options.data and parse them
 * with options.parseFn
 *
 * @param {Object} options with
 *   - {glob} data        glob of data files to parse
 *   - {Function} parseFn parsing function for data
 * @return {Promise} resolving to keyed parsed file contents
 */
function parseData (data, options) {
  return utils.readFilesKeyed(data, options);
}

/**
 * Read and parse files in options.docs and parse them
 * with options.parseFn
 *
 * @param {Object} options with
 *   - {glob} docs        glob of docs files to parse
 *   - {Function} parseFn parsing function for docs
 * @return {Promise} resolving to keyed parsed file contents
 */
function parseDocs (docs, options) {
  return utils.readFilesKeyed(docs, options);
}

function deepRef (pathKeys, obj) {
  return pathKeys.reduce((prev, curr) => {
    prev[curr] = prev[curr] || {
      name: utils.titleCase(utils.keyname(curr)),
      items: {}
    };
    return prev[curr].items;
  }, obj);
}

function parseRecursive (glob, relativeKey, options) {
  const objectData = {};
  return utils.readFiles(glob, options).then(fileData => {
    fileData.forEach(objectFile => {
      const keys = utils.relativePathArray(objectFile.path,
        relativeKey);
      const entryKey = utils.keyname(objectFile.path, { stripNumbers: false });
      const pathKey = utils.keyname(objectFile.path);
      deepRef(keys, objectData)[entryKey] = Object.assign({
        name: utils.titleCase(pathKey),
        id: keys.concat(pathKey).join('.')
      }, objectFile);
    });
    return objectData;
  });
}

/**
 * Parse data from pages and build data to be used as part of
 * template compilation context.
 * @TODO documentation
 * @TODO add option for keys.pages
 */
function parsePages (pages, options) {
  return parseRecursive(pages, 'pages', options);
}

/**
 * Parse patterns files and build data object.
 * @TODO document
 */
function parsePatterns (patterns, options) {
  return parseRecursive(patterns, options.keys.patterns, options);

  // @TODO Figure out how to emulate "local namespacing" of HBS vars
  // so that one can reference data from front matter in patterns
  // @TODO Run some fields through markdown
  // @TODO Do we need to trim whitespace from pattern content?
  // @TODO Do we need to store pattern data on another object as well?
  // @TODO Do we need any further sorting?
  // @TODO Need to register Handlebars partial
}

function parseAll (options = {}) {
  return Promise.all([
    parseData({
      data: options.data,
      parseFn: options.dataFn
    }),
    parseDocs({
      docs: options.docs,
      parseFn: options.docsFn
    }),
    parseLayouts(options.layouts, options),
    parsePages({ pages: options.pages }),
    parsePatterns({
      patterns: options.patterns,
      patternKey: options.keys.patterns
    })
  ]).then(allData => {
    return {
      data    : allData[0],
      docs    : allData[1],
      layouts : allData[2],
      pages   : allData[3],
      patterns: allData[4]
    };
  });
}

export { parseAll,
         parseData,
         parseDocs,
         parseLayouts,
         parsePages,
         parsePatterns,
         parseRecursive
       };
