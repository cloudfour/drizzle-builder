import renderPages from './pages';
import renderPatterns from './patterns';

function render (drizzleData) {
  return Promise.all([
    renderPages(drizzleData),
    renderPatterns(drizzleData)
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
