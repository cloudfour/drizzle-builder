import renderPages from './pages';
import renderCollections from './collections';

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
      layouts : drizzleData.layouts,
      options : drizzleData.options
    };
  });
}

export default render;
