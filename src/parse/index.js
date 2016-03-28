import parseData from './data';
import parseLayouts from './layouts';
import parsePages from './pages';
import parsePatterns from './patterns';

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
