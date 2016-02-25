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
 * Merge defaults into options.
 * @return {object} merged options
 */
function mergeDefaults (options = {}) {
  /* eslint-disable prefer-const */
  let {
    templates: {
      handlebars = defaults.templates.handlebars,
      helpers    = defaults.templates.helpers,
      layouts    = defaults.templates.layouts,
      pages      = defaults.templates.pages,
      partials   = defaults.templates.partials
    } = {}
  } = options;
  options = {
    templates: { handlebars, helpers, layouts, pages, partials }
  };
  /* eslint-enable prefer-const */
  return options;
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
  options = options || {};
  let {
    templates: {
      handlebars = options.handlebars,
      helpers    = options.helpers,
      layouts    = options.layouts,
      pages      = options.views,
      partials   = options.layoutIncludes
    } = {}
  } = options;
  options = {
    templates: { handlebars, helpers, layouts, pages, partials }
  };
  return options;
  /* eslint-enable prefer-const */
}

const parseOptions = options => mergeDefaults(translateOptions(options));

export default parseOptions;
