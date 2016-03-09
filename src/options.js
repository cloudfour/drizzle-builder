import Handlebars from 'handlebars';
import yaml from 'js-yaml';
import marked from 'marked';

const defaults = {
  data: ['src/data/**/*.yaml'],
  dataFn: (contents, path) => yaml.safeLoad(contents),
  docs: ['src/docs/**/*.md'],
  docsFn: (contents, path) => marked(contents),
  handlebars: Handlebars,
  helpers   : {},
  keys      : {
    patterns: 'patterns'
  },
  layouts   : ['src/layouts/*'],
  pages     : ['src/pages/**/*'],
  partials  : ['src/partials/**/*'],
  patterns  : ['src/patterns/**/*']
};

/**
 * Merge defaults into options.
 * @return {object} merged options
 */
function mergeDefaults (defaultOpts, options = {}) {
  // Please don't hate me
  Object.keys(options).map(key => {
    if (typeof options[key] === 'undefined') { delete options[key]; }
    if (typeof options[key] === 'object') {
      options[key] = mergeDefaults(defaultOpts[key], options[key]);
    }
  });
  return Object.assign({}, defaultOpts, options);
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
    docs,
    docsFn,
    handlebars,
    helpers,
    layouts,
    materials: patterns,
    views: pages,
    layoutIncludes: partials
  } = options;

  const {
    materials: patternKey
  } = options.keys || {};

  const result = {
    data,
    dataFn,
    docs,
    docsFn,
    handlebars,
    helpers,
    layouts,
    pages,
    patterns,
    partials
  };

  result.keys = {
    patterns: patternKey
  };
  return result;
}

const parseOptions = options => mergeDefaults(defaults,
  translateOptions(options));

/**
 * Sigh...
 * > Single exports and multiple exports are mutually exclusive. You have to use
 * > either one the two styles. Some modules combine both styles as follows:
 * http://www.2ality.com/2015/12/babel-commonjs.html
 */
parseOptions.translator = translateOptions;

export default parseOptions;
