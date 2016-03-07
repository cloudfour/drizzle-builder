import frontMatter from 'front-matter';
import * as utils from './utils';

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

// function preparePatterns () {
//
// }

/**
 * Build a data/context object for use by the builder
 * @TODO This may move into its own module if it seems appropriate
 * @TODO Make this testable
 *
 * @param {Object} options
 * @return {Promise} resolving to {Object} of keyed file data
 */


export { parseData,
         parseLayouts,
         parsePages
       };
