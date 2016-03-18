var path = require('path');
var yaml = require('js-yaml');
var frontMatter = require('front-matter');
var marked = require('marked');

const fixtures = path.join(__dirname, 'fixtures/');
const parsers = {
  content: {
    pattern: '\.(html|hbs|handlebars)$',
    parseFn: (contents, path) => {
      var matter = frontMatter(contents);
      return {
        contents: matter.body,
        data: matter.attributes
      };
    }
  },
  markdown: {
    pattern: '\.(md|markdown)$',
    parseFn: (contents, path) => {
      var matter = frontMatter(contents);
      return {
        contents: marked(matter.body),
        data: matter.attributes
      };
    }
  },
  yaml: {
    pattern: '\.(yaml|yml)$',
    parseFn: (contents, path) => ({ contents: yaml.safeLoad(contents) })
  },
  json: {
    pattern: '\.json$',
    parseFn: (contents, path) => ({ contents: JSON.parse(contents) })
  },
  default: {
    parseFn: (contents, path) => ({ contents: contents })
  }
};

function fixturePath (glob) {
  return path.normalize(path.join(fixtures, glob));
}

var config = {
  fixturePath: fixturePath,
  fixtures: fixtures,
  fixtureOpts: {
    data: fixturePath('data/**/*'),
    layouts: fixturePath('layouts/**/*.html'),
    markdownFields: ['notes'],
    pages: fixturePath('pages/**/*'),
    parsers: parsers,
    partials: fixturePath('partials/**/*.hbs'),
    patterns: fixturePath('patterns/**/*')
  },
  logObj: obj => {
    console.log(JSON.stringify(obj, null, '  '));
  },
  parsers: parsers
};

module.exports = config;
