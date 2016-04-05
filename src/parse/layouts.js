import { readFileTree } from '../utils/parse';

/**
 * Parse layout files.
 * @param {Object} options
 * @return {Promise} resolving to layout data
 */
function parseLayouts (options) {
  return readFileTree(options.src.layouts, options);
}

export default parseLayouts;
