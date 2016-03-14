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

/**
 * Parse data from pages and build data to be used as part of
 * template compilation context.
 * @TODO documentation
 */
function parsePages (pages, options) {
  const pageOpts = Object.assign({}, options, { stripNumbers: false });
  const pageData = {};
  return utils.readFiles(pages, pageOpts).then(allPageData => {
    allPageData.forEach(pageFile => {
      const keys = utils.relativePathArray(pageFile.path, 'pages');
      const entryKey = utils.keyname(pageFile.path, { stripNumbers: false });
      const pathKey = utils.keyname(pageFile.path);
      deepRef(keys, pageData)[entryKey] = {
        name: utils.titleCase(pathKey),
        id  : keys.concat(pathKey).join('.'),
        data: pageFile.contents.attributes,
        contents: pageFile.contents.body
      };
    });
    return pageData;
  });
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

/**
 * Parse patterns files and build data object.
 *
 * @param {Object} options with:
 *   {glob} patterns   Where to look for patterns files
 *   {patternKey}      String key for patterns directory, naming
 * @TODO I still don't like the coupling between patternKey and directories
 * @return {Object} Fully-built patterns data object
 */
function parsePatterns ({patterns, patternKey} = {}) {
  const patternData = {};
  return utils.readFiles(patterns, {
    contentFn: (contents, path) => frontMatter(contents)
  }).then(fileData => {
    fileData.forEach(patternFile => {
      const keys = utils.relativePathArray(patternFile.path, patternKey);
      const entryKey = utils.keyname(patternFile.path, { stripNumbers: false });
      const pathKey = utils.keyname(patternFile.path);
      deepRef(keys, patternData)[entryKey] = {
        name: utils.titleCase(pathKey),
        id  : keys.concat(pathKey).join('.'),
        data: patternFile.contents.attributes,
        contents: patternFile.contents.body
      };
    });
    // @TODO Figure out how to emulate "local namespacing" of HBS vars
    // so that one can reference data from front matter in patterns
    // @TODO Run some fields through markdown
    // @TODO Do we need to trim whitespace from pattern content?
    // @TODO Do we need to store pattern data on another object as well?
    // @TODO Do we need any further sorting?
    // @TODO Need to register Handlebars partial
    return patternData;
  });
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
         parsePatterns
       };
