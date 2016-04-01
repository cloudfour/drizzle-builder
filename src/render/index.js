import renderPages from './pages';
import renderCollections from './collections';

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
