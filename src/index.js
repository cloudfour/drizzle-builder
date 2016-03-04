var parseOptions = require('./options');
var prepareTemplates = require('./template').prepareTemplates;
var utils = require('./utils');

/**
 * Build a data/context object for use by the builder
 * @TODO This may move into its own module if it seems appropriate
 *
 * @param {Object} options
 * @return {Promise} resolving to {Object} of keyed file data
 */
function prepareData (options) {
  // Data data
  return utils.readFilesKeyed(options.data, {
    contentFn: options.dataFn
  });
}
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
