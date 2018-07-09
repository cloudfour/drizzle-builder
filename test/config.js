var path = require('path');
var yaml = require('js-yaml');
var frontMatter = require('front-matter');
var marked = require('marked');

var drizzleInit = require('../dist/init');

var Handlebars = require('handlebars');

const fixtures = path.join(__dirname, 'fixtures/');
const parsers = {
  content: {
    pattern: '\\.(html|hbs|handlebars)$',
    parseFn: (contents, path) => {
      var matter = frontMatter(contents);
      return {
        contents: matter.body,
        data: matter.attributes
      };
    }
  },
  markdown: {
    pattern: '\\.(md|markdown)$',
    parseFn: (contents, path) => {
      var matter = frontMatter(contents);
      return {
        contents: marked(matter.body),
        data: matter.attributes
      };
    }
  },
  yaml: {
    pattern: '\\.(yaml|yml)$',
    parseFn: (contents, path) => ({ contents: yaml.safeLoad(contents) })
  },
  json: {
    pattern: '\\.json$',
    parseFn: (contents, path) => ({ contents: JSON.parse(contents) })
  },
  default: {
    parseFn: (contents, path) => ({ contents: contents })
  }
};

function fixturePath(glob) {
  return path.normalize(path.join(fixtures, glob));
}

function init(options) {
  options = options || config.fixtureOpts;
  return drizzleInit(options).then(opts => {
    opts.handlebars = Handlebars.create();
    return opts;
  });
}

var config = {
  parsers,
  fixturePath,
  fixtures,
  init: init,
  fixtureOpts: {
    debug: {
      logFn: msg => msg
    },
    src: {
      data: {
        glob: fixturePath('data/**/*'),
        basedir: fixturePath('data')
      },
      pages: {
        glob: fixturePath('pages/**/*'),
        basedir: fixturePath('pages')
      },
      patterns: {
        glob: './test/fixtures/patterns/**/*.{html,hbs}',
        basedir: './test/fixtures/patterns'
      },
      templates: {
        glob: fixturePath('templates/**/*'),
        basedir: fixturePath('templates')
      }
    },
    dest: {
      root: './test/dist',
      collections: './test/dist/patterns',
      pages: './test/dist',
      patterns: './test/dist/patterns'
    },
    helpers: fixturePath('helpers/**/*.js'),
    parsers: parsers
  },
  logObj: obj => {
    console.log(JSON.stringify(obj, null, '  '));
  }
};

module.exports = config;
