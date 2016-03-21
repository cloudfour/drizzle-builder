import parseData from './data';
import parsePages from './pages';
import parsePatterns from './patterns';

function parseAll (options = {}) {
  return Promise.all([
    parseData(options),
    parsePages(options),
    parsePatterns(options)
  ]).then(allData => {
    return {
      data    : allData[0],
      pages   : allData[1],
      patterns: allData[2],
      options : options
    };
  });
}

export default parseAll;
