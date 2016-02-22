var Promise = require('bluebird');

var parseOptions = require('./options');

/**
 * Build the drizzle output
 *
 * @return {Promise}; resolves to options {object} (for now)
 */
const drizzle = options => {
  const opts = parseOptions(options);
  return Promise.resolve(opts);
};

export default drizzle;
