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
  describe('generating src globs', () => {
    var opts = mergeOptions();
    it ('should contain default src globs', () => {
      expect(opts).to.include.key('src');
      expect(opts.src).to.include.keys(
        'data', 'pages', 'layouts', 'partials', 'patterns');
    });
  });
  describe('generating destination paths', () => {
    var opts = mergeOptions();
    it('should provide default destination entries', () => {
      expect(opts.dest).to.have.keys('base', 'pages', 'patterns');
      expect(opts.dest.patterns).to.equal('patterns/');
    });
    it('should allow override of distPaths', () => {
      var opts = mergeOptions({ dest: {
        base: 'foo/',
        patterns: 'bar/',
        something: 'baz/'
      }});
      expect(opts.dest).to.contain.keys(
        'base', 'pages', 'patterns', 'something');
      expect(opts.dest.base).to.equal('foo/');
      expect(opts.dest.patterns).to.equal('bar/');
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
