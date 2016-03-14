import merge from 'deepmerge';
import Handlebars from 'handlebars';
import yaml from 'js-yaml';
import marked from 'marked';
import frontMatter from 'front-matter';

var parsers = {
  content: {
    pattern: /\.(html|hbs|handlebars)$/,
    parseFn: (contents, path) => {
      var matter = frontMatter(contents);
      return {
        contents: matter.body,
        data: matter.attributes
      };
    }
  },
  markdown: {
    pattern: /\.(md|markdown)$/,
    parseFn: (contents, path) => {
      var matter = frontMatter(contents);
      return {
        contents: marked(matter.body),
        data: matter.attributes
      };
    }
  },
  yaml: {
    pattern: /\.(yaml|yml)$/,
    parseFn: (contents, path) => yaml.safeLoad(contents)
  },
  json: {
    pattern: /\.json$/,
    parseFn: (contents, path) => JSON.parse(contents)
  },
  default: {
    parseFn: (contents, path) => contents
  }
};

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
  parsers   : parsers,
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
