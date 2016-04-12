import renderPages from './pages';
import renderCollections from './collections';

import DrizzleError from '../utils/error';

/**
 * Render pages and pattern-collection pages.
 *
 * @param {Object} drizzleData  All data built so far
 * @return {Promise} resolving to drizzleData
 */
function render (drizzleData) {
  return Promise.all([
    renderPages(drizzleData),
    renderCollections(drizzleData)
  ]).then(allData => {
    return {
      data    : drizzleData.data,
      pages   : allData[0],
      patterns: allData[1],
      templates : drizzleData.templates,
      options : drizzleData.options
    };
  }, error => DrizzleError.error(error, drizzleData.options));
}

export default render;
