var path = require('path');
var yaml = require('js-yaml');
var frontMatter = require('front-matter');
var marked = require('marked');

function fixturePath (glob) {
  return path.normalize(path.join(fixtures, glob));
}
const fixtures = path.join(__dirname, 'fixtures/');

var config = {
  fixturePath: fixturePath,
  fixtures: fixtures,
  fixtureOpts: {
    data: fixturePath('data/**/*.yaml'),
    docs: fixturePath('docs/**/*.md'),
    layouts: fixturePath('layouts/**/*.html'),
    pages: fixturePath('pages/**/*'),
    partials: fixturePath('partials/**/*.hbs'),
    patterns: fixturePath('patterns/**/*.html')
  },
  parsers: {
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
      parseFn: (contents, path) => ({ contents: yaml.safeLoad(contents) })
    },
    json: {
      pattern: /\.json$/,
      parseFn: (contents, path) => ({ contents: JSON.parse(contents) })
    },
    default: {
      parseFn: (contents, path) => ({ contents: contents })
    }
  }
};

module.exports = config;
