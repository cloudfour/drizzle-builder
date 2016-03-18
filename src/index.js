import parseOptions from './options';
import { parseAll } from './parse';
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

/**
 * Build the drizzle!
 *
 * @return {Promise}; ...
 */
function drizzle (options) {
  const opts = parseOptions(options);
  return prepare(opts).then(drizzleData => {
    return {
      context: drizzleData.context,
      handlebars: drizzleData.handlebars,
      options: opts
    };
  });
}

export default drizzle;
