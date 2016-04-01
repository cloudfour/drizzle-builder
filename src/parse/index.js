import parseData from './data';
import parseLayouts from './layouts';
import parsePages from './pages';
import parsePatterns from './patterns';

/**
 * Parse files with data from src and build a drizzleData object
 * @param {Object} options
 * @return {Promise} resolving to data object
 */
function parseAll (options = {}) {
  return Promise.all([
    parseData(options),
    parsePages(options),
    parsePatterns(options),
    parseLayouts(options)
  ]).then(allData => {
    return {
      data    : allData[0],
      pages   : allData[1],
      patterns: allData[2],
      layouts : allData[3],
      options : options
    };
  });
}

export default parseAll;
