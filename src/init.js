import merge from 'deepmerge';
import defaults from './defaults';
import Promise from 'bluebird';

/**
 * Merge defaults into passed options.
 * @param {Object} options
 * @return {Object} merged options
 */
function init (options = {}, handlebars) {
  options.handlebars = handlebars || require('handlebars');
  return Promise.resolve(merge(defaults, options));
}

export default init;
