import parseOptions from './options';
import { parseAll } from './parse';
import { prepareTemplates } from './template';

/**
 * Build the drizzle output
 *
 * @return {Promise}; resolves to [dataObj, Handlebars] for now
 */
function drizzle (options) {
  const opts = parseOptions(options);
  return Promise.all([parseAll(opts), prepareTemplates(opts)]).then(allData => {
    return {
      context: allData[0],
      options: opts,
      templates: allData[1]
    };
  });
}

export default drizzle;
