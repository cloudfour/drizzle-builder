/**
 * Prepare module.
 * @module prepare
 */
import prepareHelpers from './helpers';
import preparePartials from './partials';

import DrizzleError from '../utils/error';

/**
 * Set up templating (Handlebars).
 * Register helpers and partials (partials, layouts and patterns as partials).
 *
 * @param {Object} options
 * @return {Promise} resolves to mutated {Object} options
 */
function prepare (options) {
  return Promise.all([
    prepareHelpers(options),
    preparePartials(options)
  ]).then(
    () => options,
    error => DrizzleError.error(error, options.debug)
  );
}

export default prepare;
