import Handlebars from 'handlebars';

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
 * Perform a deep merge of two objects.
 * @param {Object} target
 * @param {Object} source
 * @return {Object}
 * @example merge(defaults, options);
 */
function merge (target, source) {
  Object.keys(source).forEach(key => {
    if (Object.isExtensible(source[key])) {
      merge(target[key], source[key]);
    } else {
      Object.assign(target, { [key]: source[key] });
    }
  });
  return target;
}

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
  let { result = defaults } = options;
  let {
    templates: {
      handlebars = options.handlebars,
      helpers    = options.helpers,
      layouts    = options.layouts,
      pages      = options.views,
      partials   = options.layoutIncludes
    } = {}
  } = options;
  result = {
    templates: { handlebars, helpers, layouts, pages, partials }
  };
  return result;
  /* eslint-enable prefer-const */
}

const parseOptions = options => mergeDefaults(translateOptions(options));

export default parseOptions;
