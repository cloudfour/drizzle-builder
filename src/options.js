import Handlebars from 'handlebars';
import yaml from 'js-yaml';

const defaults = {
  data: ['src/data/**/*.yaml'],
  dataFn: (contents, path) => yaml.safeLoad(contents),
  handlebars: Handlebars,
  helpers   : {},
  layouts   : ['src/layouts/*'],
  pages     : ['src/pages/**/*'],
  partials  : ['src/partials/**/*']
};

/**
 * Merge defaults into options.
 * @return {object} merged options
 */
function mergeDefaults (options = {}) {
  // Please don't hate me
  Object.keys(options).map(key => {
    if (typeof options[key] === 'undefined') { delete options[key]; }
  });
  return Object.assign({}, defaults, options);
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
  const {
    data,
    dataFn,
    handlebars,
    helpers,
    layouts,
    views: pages,
    layoutIncludes: partials
  } = options;

  const result = {
    data,
    dataFn,
    handlebars,
    helpers,
    layouts,
    pages,
    partials
  };
  return result;
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
