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
 *
 * @param {Object} options with
 *   - {glob} pages: glob representing where pages live
 * @return {Promise} resolving to {Object} contextual page data
 */
function parsePages ({pages} = {}) {
  // First, read pages files' content...
  return utils.readFilesKeyed(pages, {
    contentFn: (contents, path) => {
      // Generate an object from content
      return {
        data: frontMatter(contents).attributes,
        parent: utils.localDirname(path)
      };
    },
    stripNumbers: false // Leave leading numerals intact
  }).then(pageFileData => {
    // Shape page data into the objects we need
    const pageData = {};
    Object.keys(pageFileData).forEach(pageKey => {
      const page = pageFileData[pageKey];
      pageData[page.parent] = pageData[page.parent] || {
        name: utils.titleCase(page.parent),
        items: {}
      };
      pageData[page.parent].items[pageKey] = {
        name: utils.titleCase(pageKey),
        data: page.data
      };
    });
    return pageData;
  });
}

/**
 * Retrieve the reference in the nested patterns
 * object that is at the right spot to insert data about
 * a pattern in the path indicated by pathKeys.
 *
 * If any object references don't exist as the path is traversed,
 * the correct shape for one will be created on the patterns object.
 *
 * @example getPatternEntry(['patterns', 'foo', 'bar']);
 *  // --> patterns.patterns.foo.bar.items
 * @param {Array} pathKeys path elements relative to patterns dir
 * @param {Object} patterns data object so far
 */
function getPatternEntry (pathKeys, patterns) {
  return pathKeys.reduce((prev, curr) => {
    prev[curr] = prev[curr] || {
      name: utils.titleCase(utils.keyname(curr)),
      items: {}
    };
    return prev[curr].items;
  }, patterns);
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
      getPatternEntry(keys, patternData)[entryKey] = {
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
