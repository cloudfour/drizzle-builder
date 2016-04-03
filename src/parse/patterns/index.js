import parsePatterns from './patterns';
import parseCollections from './collections';

/**
 * Parse patterns and subsequently extend the data with collections metadata
 *
 * @param {Object} options
 * @return {Promise} resolving to {Object} all pattern (and collection) data
 */
function parsePatternsAndCollections (options) {
  return parsePatterns(options)
    .then(patternData => parseCollections(patternData, options));
}

export default parsePatternsAndCollections;
