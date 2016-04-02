import preparePartials from './partials';
import prepareHelpers from './helpers';
import prepareLayouts from './layouts';
import preparePatterns from './patterns';

/**
 * Register partials and helpers per opts
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
  ]).then(optsArray => options);
}

export default prepare;
