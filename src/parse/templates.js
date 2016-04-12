import { readFileTree } from '../utils/parse';

/**
 * Parse layout files.
 * @param {Object} options
 * @return {Promise} resolving to object of parsed template contents
 */
function parseTemplates (options) {
  return readFileTree(options.src.templates, options);
}

export default parseTemplates;
