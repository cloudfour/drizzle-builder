/* global describe, it */
var chai = require('chai');
//var config = require('./config');
var expect = chai.expect;
var mergeOptions = require('../dist/options');

describe ('options', () => {
  var keys = [
    'beautifier',
    'dest',
    'fieldParsers',
    'handlebars',
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
  describe('generating default options', () => {
    it ('should generate default options when none passed', () => {
      var opts = mergeOptions();
      expect(opts).to.be.an('object').and.to.contain.keys(keys);
    });
    it ('should generate default parsers when none passed', () => {
      var opts = mergeOptions();
      expect(opts.parsers).to.be.an('object').and.to.contain.keys(parserKeys);
    });
  });
  describe('generating srces', () => {
    var opts = mergeOptions();
    var srces = ['data', 'layouts', 'pages', 'partials', 'patterns'];
    it ('should contain default src basedirs and globs', () => {
      expect(opts).to.include.key('src');
      expect(opts.src).to.include.keys(srces);
      srces.map(srcKey => {
        expect(opts.src[srcKey]).to.contain.keys('basedir', 'glob');
      });
    });
  });
  describe('generating destination paths', () => {
    var opts = mergeOptions();
    it('should provide default destination entries', () => {
      expect(opts.dest).to.have.keys('pages', 'patterns');
      expect(opts.dest.patterns).to.equal('./dist/patterns');
    });
    it('should allow override of distPaths', () => {
      var opts = mergeOptions({ dest: {
        patterns: 'bar/',
        something: 'baz/'
      }});
      expect(opts.dest).to.contain.keys(
        'pages', 'patterns', 'something');
      expect(opts.dest.something).to.equal('baz/');
      expect(opts.dest.patterns).to.equal('bar/');
    });
  });
  describe('defining default layouts', () => {
    it ('should set up default layouts for page and collection output', () => {
      var opts = mergeOptions();
      expect(opts.layouts).to.contain.keys('page', 'collection');
      expect(opts.layouts.collection).to.equal('collection');
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
  describe('parsing markdownFields', () => {
    const mdOpts = {
      markdownFields: ['notes', 'foo']
    };
    var opts = mergeOptions(mdOpts);
    expect(opts.markdownFields).to.be.an('Array').and.to
      .contain('notes', 'foo');
  });
  describe('parsing parsers', () => {
    var differentParsers = {
      json: {
        pattern: /\.json$/,
        parseFn: (contents, path) => ({ contents: 'foo' }),
        randomProperty: 'yep'
      }
    };
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
