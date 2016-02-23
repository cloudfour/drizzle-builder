var parseOptions = require('./options');
var prepareTemplates = require('./template').prepareTemplates;

/**
 * Build the drizzle output
 *
 * @return {Promise}; resolves to options {object} (for now)
 */
function drizzle (options) {
  const opts = parseOptions(options);
  return prepareTemplates(opts).then(handlebars => opts);
}

export default drizzle;
