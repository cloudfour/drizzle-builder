var parseOptions = require('./options');
var prepareTemplates = require('./template').prepareTemplates;
var utils = require('./utils');

/**
 * Build a data/context object for use by the builder
 * @TODO This may move into its own module if it seems appropriate
 * @TODO Make this testable
 *
 * @param {Object} options
 * @return {Promise} resolving to {Object} of keyed file data
 */
function prepareData (options) {
  var parseFiles = utils.readFilesKeyed;
  // Data data
  const dataData = parseFiles(options.data, {
    contentFn: options.data.parseFn
  });
  // Layouts data
  const layoutData = parseFiles(options.layouts);

  // Build data object
  return Promise.all([dataData, layoutData])
    .then(allData => {
      return { data: allData[0],
               layouts: allData[1]
             };
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
