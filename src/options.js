import merge from 'deepmerge';
import defaults from './defaults';

/**
 * Merge defaults into passed options
 */
function parseOptions (options = {}) {
  return merge(defaults, options);
}

export default parseOptions;
