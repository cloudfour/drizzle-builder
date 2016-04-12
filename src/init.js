import deepExtend from 'deep-extend';
import defaults from './defaults';
import Promise from 'bluebird';

/**
 * Merge defaults into passed options.
 * @param {Object} options
 * @param {Object} handlebars   Handlebars instance—it can be passed explicitly,
 *                              primarily for testing purposes.
 * @return {Promise} resolving to merged options
 */
function init (options = {}, handlebars) {
  const opts = deepExtend({}, defaults, options);
  opts.handlebars = handlebars || require('handlebars');
  return Promise.resolve(opts);
}

export default init;
