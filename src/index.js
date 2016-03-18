import parseOptions from './options';
import prepare from './prepare';
import parse from './parse';

/**
 * Build the drizzle!
 *
 * @return {Promise}; ...
 */
function drizzle (options) {
  const opts = parseOptions(options);
  return prepare(opts).then(parse).then(drizzleData => {
    return drizzleData;
  });
}

export default drizzle;
