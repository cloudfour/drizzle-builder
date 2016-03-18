import parseAll from './parse/';
import { prepareTemplates } from './template';

/**
 * Parse resource files and prepare templates and handlebars.
 *
 * @param {Object} options
 * @return {Promise}
 */
function prepare (options) {
  return Promise.all([
    parseAll(options),
    prepareTemplates(options)
  ]).then(allData => {
    return {
      context: allData[0],
      handlebars: allData[1],
      options: options
    };
  });
}

export default prepare;
