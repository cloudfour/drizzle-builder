import merge from 'deepmerge';
import defaults from './defaults';

/**
 * Merge defaults into passed options.
 * @param {Object} options
 * @return {Object} merged options
 */
function mergeOptions (options = {}) {
  return merge(defaults, options);
}

export default mergeOptions;
