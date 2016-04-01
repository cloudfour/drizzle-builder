import merge from 'deepmerge';
import defaults from './defaults';

/**
 * Merge defaults into passed options
 */
function mergeOptions (options = {}) {
  return merge(defaults, options);
}

export default mergeOptions;
