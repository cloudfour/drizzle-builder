import Handlebars from 'handlebars';
import { merge } from './utils';

const defaults = {
  templates: {
    handlebars: Handlebars,
    helpers   : {},
    layouts   : ['src/layouts/*'],
    pages     : ['src/pages/**/*'],
    partials  : ['src/partials/**/*']
  }
};

/**
 * Merge defaults into options.
 * @return {object} merged options
 */
function mergeDefaults (options = {}) {
  return merge(defaults, options);
}

/**
 * Map old options object shape onto new shape
 * so that we can provide backwards-compatibility with fabricator
 * The returned options {object} is of the correct shape to have
 * defaults merged into it.
 *
 * @TODO Eventually, support for fabricator/deprecated things should be
 *       moved into their own module
 * @return {object} User options
 */
function translateOptions (options = {}) {
  /* eslint-disable prefer-const */
  const {
    handlebars,
    helpers,
    layouts,
    views: pages,
    layoutIncludes: partials
  } = options;

  const result = {
    templates: {
      handlebars,
      helpers,
      layouts,
      pages,
      partials
    }
  };
  return result;
  /* eslint-enable prefer-const */
}

const parseOptions = options => mergeDefaults(translateOptions(options));

/**
 * Sigh...
 * > Single exports and multiple exports are mutually exclusive. You have to use
 * > either one the two styles. Some modules combine both styles as follows:
 * http://www.2ality.com/2015/12/babel-commonjs.html
 */
parseOptions.translator = translateOptions;

export default parseOptions;
