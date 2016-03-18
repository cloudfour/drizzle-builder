import parseOptions from './options';
import prepare from './prepare';

/**
 * Build the drizzle!
 *
 * @return {Promise}; ...
 */
function drizzle (options) {
  const opts = parseOptions(options);
  return prepare(opts);
}

export default drizzle;
