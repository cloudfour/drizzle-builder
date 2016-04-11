var chai = require('chai');
var config = require('./config');
var expect = chai.expect;
var init = require('../dist/init');

var Handlebars = require('handlebars');

describe ('init', () => {
  var keys = [
    'beautifier',
    'debug',
    'dest',
    'fieldParsers',
    'helpers',
    'layouts',
    'parsers',
    'src'
  ];
  var parserKeys = [
    'content',
    'markdown',
    'json',
    'yaml',
    'default'
  ];
  describe ('default options', () => {
    var opts;
    beforeEach(() => {
      opts = init();
      return opts;
    });
    it ('should generate default options when none passed', () => {
      return opts.then(options => {
        expect(options).to.be.an('object').and.to.contain.keys(keys);
      });
    });
    it ('should generate default parsers when none passed', () => {
      return opts.then(options => {
        expect(options.parsers).to.be.an('object')
          .and.to.contain.keys(parserKeys);
      });
    });
    it ('should define a default debug logging function', () => {
      return opts.then(options => {
        expect(options.debug).to.be.an('object').and.to.contain.keys('logFn');
        expect(options.debug.logFn).to.equal(console.log);
      });
    });
    it ('should define default src-es', () => {
      var srces = ['data', 'layouts', 'pages', 'partials', 'patterns'];
      return opts.then(options => {
        expect(options).to.include.key('src');
        expect(options.src).to.include.keys(srces);
        srces.map(srcKey => {
          expect(options.src[srcKey]).to.contain.keys('basedir', 'glob');
        });
      });
    });
    it('should provide default destination entries', () => {
      return opts.then(options => {
        expect(options.dest).to.have.keys('pages', 'patterns');
        expect(options.dest.patterns).to.equal('./dist/patterns');
      });
    });
    it ('should set up default layouts for page and collection output', () => {
      return opts.then(options => {
        expect(options.layouts).to.contain.keys('page', 'collection');
        expect(options.layouts.collection).to.equal('collection');
      });
    });
  });
  describe('merging passed options', () => {
    it ('should take a handlebars instance', () => {
      var opts = config.fixtureOpts;
      var hbs = Handlebars.create();
      var hbs2 = Handlebars.create();
      hbs.registerPartial('fourthBanana', 'dingus');
      hbs2.registerPartial('nopeNotMe', 'fooooo');
      return init(opts, hbs).then(options => {
        expect(options.handlebars.partials).to.contain.key('fourthBanana');
        expect(options.handlebars.partials).not.to.contain.key('nopeNotMe');
      });
    });

    it('should allow override of dest paths', () => {
      var opts = init({ dest: {
        patterns: 'bar/',
        something: 'baz/'
      }});
      return opts.then(options => {
        expect(options.dest).to.contain.keys(
          'pages', 'patterns', 'something');
        expect(options.dest.something).to.equal('baz/');
        expect(options.dest.patterns).to.equal('bar/');
      });
    });

    it ('should allow the overriding of default layouts', () => {
      var opts = init({
        layouts: {
          page: 'page',
          entity: 'random'
        }
      });
      return opts.then(options => {
        expect(options.layouts).to.contain.keys('page', 'collection', 'entity');
        expect(options.layouts.page).to.equal('page');
      });
    });
  });
  describe('parsing parsers', () => {
    var differentParsers = {
      json: {
        pattern: /\.json$/,
        parseFn: (contents, path) => ({ contents: 'foo' }),
        randomProperty: 'yep'
      }
    };
    it('should refactor parser option tests');
    it('should accept parser overrides', () => {
      var opts = init({parsers: differentParsers});
      return opts.then(options => {
        expect(options.parsers).to.be.an('object').and.to.contain.keys('json');
        expect(options.parsers.json.randomProperty).to.be.a('string');
      });
    });
    it('should accept additional parsers', () => {
      var opts = init({ parsers: {
        foo: {
          pattern: /foo/
        }
      }});
      return opts.then(options => {
        expect(options.parsers).to.contain.keys('foo');
        expect(options.parsers.foo).to.contain.keys('pattern');
      });
    });
  });
});
