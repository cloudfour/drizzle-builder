import prepareHelpers from './helpers';
import prepareLayouts from './layouts';
import preparePartials from './partials';
import preparePatterns from './patterns';

/**
 * Set up templating (Handlebars).
 * Register helpers, layouts, partials, patterns.
 * Layouts are registered as partials.
 *
 * @param {Object} opts Drizzle options
 * @return {Promise} resolves to {Object} options
 */
function prepare (options) {
  return Promise.all([
    prepareHelpers(options),
    prepareLayouts(options),
    preparePartials(options),
    preparePatterns(options)
  ]).then(() => options);
}

export default prepare;
