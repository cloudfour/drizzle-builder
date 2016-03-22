import preparePartials from './partials';
import prepareHelpers from './helpers';
import prepareLayouts from './layouts';

/**
 * Register partials and helpers per opts
 *
 * @param {Object} opts Drizzle options
 * @return {Promise} resolves to {Object} Handlebars instance
 */
function prepareTemplates (opts) {
  return Promise.all([
    prepareHelpers(opts.handlebars, opts.helpers),
    prepareLayouts(opts.handlebars, opts.src.layouts),
    preparePartials(opts.handlebars, opts.src.partials)
  ]).then(handlebarsInfo => {
    return opts;
  });
}

export default prepareTemplates;
