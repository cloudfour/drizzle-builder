var path = require('path');
var yaml = require('js-yaml');
var frontMatter = require('front-matter');
var marked = require('marked');

var prepareDrizzle = require('../dist/prepare');
var parseDrizzleOptions = require('../dist/options');

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

function parseOptions (options) {
  return parseDrizzleOptions(options);
}
function prepare (options) {
  return prepareDrizzle(options);
}
function prepareAll (options) {
  var opts = parseOptions(options);
  return prepare(opts).then(drizzleData => {
    return {
      context: drizzleData.context,
      handlebars: drizzleData.handlebars,
      options: opts
    };
  });
}

var config = {
  parsers,
  fixturePath,
  fixtures,
  parseOptions,
  prepare,
  prepareAll,
  fixtureOpts: {
    src: {
      data    : fixturePath('data/**/*'),
      layouts : fixturePath('layouts/**/*'),
      pages   : fixturePath('pages/**/*'),
      partials: fixturePath('partials/**/*.hbs'),
      patterns: fixturePath('patterns/**/*')
    },
    dest: './test/dist',
    helpers: fixturePath('helpers/**/*.js'),
    layouts: fixturePath('layouts/**/*.html'),
    markdownFields: ['notes'],
    pages: fixturePath('pages/**/*'),
    parsers: parsers,
    partials: fixturePath('partials/**/*.hbs'),
    patterns: fixturePath('patterns/**/*')
  },
  logObj: obj => {
    console.log(JSON.stringify(obj, null, '  '));
  }
};

module.exports = config;
