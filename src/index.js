import parseOptions from './options';
import prepareData from './data';
import { prepareTemplates } from './template';

/**
 * Build the drizzle output
 *
 * @return {Promise}; resolves to [dataObj, Handlebars] for now
 */
function drizzle (options) {
  const opts = parseOptions(options);
  return Promise.all([prepareData(opts), prepareTemplates(opts)]);
}

export default drizzle;
