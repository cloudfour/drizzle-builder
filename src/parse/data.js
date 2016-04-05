/**
 * @module parse/data
 */
import { readFileTree } from '../utils/parse';

/**
 * Parse data from data files
 * @param {Object} options    Options object with `src.data` property
 * @return {Promise} resolving to parsed file data
 */
function parseData (options) {
  return readFileTree(options.src.data, options);
}

export default parseData;
