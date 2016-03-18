import preparePartials from './partials';
import prepareHelpers from './helpers';

/**
 * Register partials and helpers per opts
 *
 * @param {Object} opts Drizzle options
 * @return {Promise} resolves to {Object} Handlebars instance
 */
function prepareTemplates (opts) {
  return Promise.all([
    prepareHelpers(opts.handlebars, opts.helpers),
    preparePartials(opts.handlebars, opts.partials)
  ]).then(handlebarsInfo => {
    return opts;
  });
}

export default prepareTemplates;
