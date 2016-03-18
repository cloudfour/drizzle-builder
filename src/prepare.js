import parseAll from './parse/';
import { prepareTemplates } from './template';

/**
 * Parse resource files and prepare templates and handlebars.
 * @TODO Possibly move into a different module.
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
      handlebars: allData[1]
    };
  });
}

export default prepare;
