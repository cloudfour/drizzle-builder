import { readFilesKeyed } from '../utils/parse';

/**
 * Parse data from data files
 * @param {Object} options    Options object with `src.data` property
 * @return {Promise} resolving to parsed file data
 */
function parseData (options) {
  return readFilesKeyed(options.src.data.glob, options);
}

export default parseData;
