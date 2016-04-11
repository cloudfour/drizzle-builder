var chai = require('chai');
//var config = require('./config');
var expect = chai.expect;
var mergeOptions = require('../dist/options');

describe ('options', () => {
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
      opts = mergeOptions();
    });
    it ('should generate default options when none passed', () => {
      expect(opts).to.be.an('object').and.to.contain.keys(keys);
    });
    it ('should generate default parsers when none passed', () => {
      expect(opts.parsers).to.be.an('object').and.to.contain.keys(parserKeys);
    });
    it ('should define a default debug logging function', () => {
      expect(opts.debug).to.be.an('object').and.to.contain.keys('logFn');
      expect(opts.debug.logFn).to.equal(console.log);
    });
    it ('should define default src-es', () => {
      var srces = ['data', 'layouts', 'pages', 'partials', 'patterns'];
      expect(opts).to.include.key('src');
      expect(opts.src).to.include.keys(srces);
      srces.map(srcKey => {
        expect(opts.src[srcKey]).to.contain.keys('basedir', 'glob');
      });
    });
    it('should provide default destination entries', () => {
      expect(opts.dest).to.have.keys('pages', 'patterns');
      expect(opts.dest.patterns).to.equal('./dist/patterns');
    });
    it ('should set up default layouts for page and collection output', () => {
      expect(opts.layouts).to.contain.keys('page', 'collection');
      expect(opts.layouts.collection).to.equal('collection');
    });
  });
  describe('merging passed options', () => {
    it ('should have a test about handlebars instance');

    it('should allow override of dest paths', () => {
      var opts = mergeOptions({ dest: {
        patterns: 'bar/',
        something: 'baz/'
      }});
      expect(opts.dest).to.contain.keys(
        'pages', 'patterns', 'something');
      expect(opts.dest.something).to.equal('baz/');
      expect(opts.dest.patterns).to.equal('bar/');
    });

    it ('should allow the overriding of default layouts', () => {
      var opts = mergeOptions({
        layouts: {
          page: 'page',
          entity: 'random'
        }
      });
      expect(opts.layouts).to.contain.keys('page', 'collection', 'entity');
      expect(opts.layouts.page).to.equal('page');
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
      var opts = mergeOptions({parsers: differentParsers});
      expect(opts.parsers).to.be.an('object').and.to.contain.keys('json');
      expect(opts.parsers.json.randomProperty).to.be.a('string');
    });
    it('should accept additional parsers', () => {
      var opts = mergeOptions({ parsers: {
        foo: {
          pattern: /foo/
        }
      }});
      expect(opts.parsers).to.contain.keys('foo');
      expect(opts.parsers.foo).to.contain.keys('pattern');
    });
  });
});
