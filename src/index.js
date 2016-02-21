var Promise = require('bluebird');

var parseOptions = require('./options');

const drizzle = options => {
  const opts = parseOptions(options);
  return Promise.resolve(opts);
};

export default drizzle;
