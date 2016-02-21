var Promise = require('bluebird');

const defaults = {
  materials: ['src/materials/**/*']
};

const buildDrizzle = (options) => {
  const opts = Object.assign(options, defaults);
  return Promise.resolve(opts);
};

export default buildDrizzle;
