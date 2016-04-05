import prepareHelpers from './helpers';
import preparePartials from './partials';

import DrizzleError from '../utils/error';

/**
 * Set up templating (Handlebars).
 * Register helpers and partials (partials, layouts and patterns as partials).
 *
 * @param {Object} opts Drizzle options
 * @return {Promise} resolves to {Object} options
 */
function prepare (options) {
  return Promise.all([
    prepareHelpers(options),
    preparePartials(options)
  ]).then(
    () => options,
    error => new DrizzleError(error).handle(options.debug)
  );
}

export default prepare;
