import prepareTemplates from './templates';

/**
 * Parse resource files and prepare templates and handlebars.
 *
 * @param {Object} options
 * @return {Promise}
 */
function prepare (options) {
  return prepareTemplates(options);
}

export default prepare;
