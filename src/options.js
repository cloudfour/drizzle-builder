import merge from 'deepmerge';
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
 * Merge defaults into passed options
 */
function parseOptions (options = {}) {
  return merge(defaults, options);
}

export default parseOptions;
