import frontMatter from 'front-matter';
import * as utils from './utils';

/**
 * Read files in options.layouts and key them
 * @return {Promise} resolving to keyed file contents
 */
function prepareLayouts ({layouts} = {}) {
  return utils.readFilesKeyed(layouts);
}

/**
 * Read and parse data Files
 * @return {Promise} resolving to keyed parsed file contents
 */
function prepareDataData ({data, parseFn} = {}) {
  return utils.readFilesKeyed(data, { contentFn: parseFn });
}

function preparePages ({pages} = {}) {
  return utils.readFilesKeyed(pages, {
    contentFn: (contents, path) => {
      return {
        data: frontMatter(contents).attributes,
        parent: utils.parentDirname(path)
      };
    },
    stripNumbers: false
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
function prepareData (options) {

  // Build data object
  return Promise.all([
    prepareDataData(options),
    prepareLayouts(options)
  ]).then(allData => {
    return { data: allData[0],
             layouts: allData[1]
           };
  });
}

export { prepareData,
         prepareDataData,
         prepareLayouts,
         preparePages
       };
