import { readFilesKeyed } from '../utils/parse';

/**
 * Parse layout files.
 * @param {Object} options
 * @return {Promise} resolving to layout data
 */
function parseLayouts (options) {
  return readFilesKeyed(options.src.layouts.glob, options);
}

export default parseLayouts;
