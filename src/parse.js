import frontMatter from 'front-matter';
import * as utils from './utils';
import * as path from 'path';

/**
 * Read files in options.layouts and key them
 * Layouts are HTML documents that get wrapped around pages
 *
 * @param {Object} options with
 *  - {glob} layouts   glob of layout files to parse
 * @return {Promise} resolving to keyed file contents
 */
function parseLayouts ({layouts} = {}) {
  return utils.readFilesKeyed(layouts);
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
function parseData ({data, parseFn} = {}) {
  return utils.readFilesKeyed(data, { contentFn: parseFn });
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

function relativePathArray (filePath, fromPath) {
  const pathChunks = path.dirname(filePath).split(path.sep).map(chunk => {
    return utils.keyname(chunk, { stripNumbers: false });
  });
  return pathChunks.slice(pathChunks.indexOf(fromPath));
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
 * Add a pattern to the patterns object. Will mutate the patterns obj.
 *
 * @param {Object newPattern}  Returned file object with {contents, path}
 * @param {Object}  Patterns object so far; to be extended
 * @param {Object}  Options with {patternKey}
 *
 * @return {Object} The new pattern entry.
 */
function addPattern (newPattern, patterns, {patternKey = 'patterns'} = {}) {
  const keys = relativePathArray(newPattern.path, patternKey);

  const patternEntry = getPatternEntry(keys, patterns);

  patternEntry[utils.keyname(newPattern.path)] = {
    name: utils.titleCase(utils.keyname(newPattern.path)),
    id: keys.join('.') + '.' + utils.keyname(newPattern.path),
    data: 'foo'
  };
  return patternEntry;
}

/**
 * Parse patterns files and build data object.
 *
 * @param {Object} options with {patterns} (glob)
 * @return {Object} Fully-built patterns data object
 */
function parsePatterns ({patterns} = {}) {
  const patternKey = 'patterns';  // @TODO Complete; make option
  const patternData = {};
  return utils.readFiles(patterns).then(fileData => {
    fileData.forEach(fileEntry => {
      addPattern(fileEntry, patternData, { patternKey });
    });
    return patternData;
  });
}

export { parseData,
         parseLayouts,
         parsePages,
         parsePatterns
       };
