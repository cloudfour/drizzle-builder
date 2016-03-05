import frontMatter from 'front-matter';
import * as utils from './utils';

/**
 * Build a data/context object for use by the builder
 * @TODO This may move into its own module if it seems appropriate
 * @TODO Make this testable
 *
 * @param {Object} options
 * @return {Promise} resolving to {Object} of keyed file data
 */
function prepareData (options) {
  var parseFiles = utils.readFilesKeyed;
  // Data data
  const dataData = parseFiles(options.data, {
    contentFn: options.dataFn
  });
  // Layouts data
  const layoutData = parseFiles(options.layouts);
  //
  // const pageData = parseFiles(options.pages, {
  //   contentFn: (contents, path) => {
  //     const data = frontMatter(contents);
  //     const parent = parentDirname(path);
  //
  //   }
  // });
  // Page data
  // parseFiles (options.pages) with a content fn of
  // front matter

  // Build data object
  return Promise.all([dataData, layoutData])
    .then(allData => {
      return { data: allData[0],
               layouts: allData[1]
             };
    });
}

export default prepareData;
