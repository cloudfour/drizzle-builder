import parseOptions from './options';
import prepare from './prepare';

/**
 * Build the drizzle!
 *
 * @return {Promise}; ...
 */
function drizzle (options) {
  const opts = parseOptions(options);
  return prepare(opts).then(drizzleData => {
    return {
      context: drizzleData.context,
      handlebars: drizzleData.handlebars,
      options: opts
    };
  });
}

export default drizzle;
