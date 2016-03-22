/* global describe, it */
var chai = require('chai');
var config = require('./config');
var expect = chai.expect;
var parseOptions = require('../dist/options');

describe ('options', () => {
  var keys = [
    'dest',
    'destPaths',
    'handlebars',
    'helpers',
    'markdownFields',
    'parsers'
  ];
  var parserKeys = [
    'content',
    'markdown',
    'json',
    'yaml',
    'default'
  ];
  describe ('parseOptions', () => {
    describe('generating default options', () => {
      it ('should generate default options when none passed', () => {
        var opts = parseOptions();
        expect(opts).to.be.an('object').and.to.contain.keys(keys);
      });
      it ('should generate default parsers when none passed', () => {
        var opts = parseOptions();
        expect(opts.parsers).to.be.an('object').and.to.contain.keys(parserKeys);
      });
    });
    describe('generating src globs', () => {
      var opts = parseOptions();
      it ('should contain default src globs', () => {
        expect(opts).to.include.key('src');
        expect(opts.src).to.include.keys(
          'data', 'pages', 'layouts', 'partials', 'patterns');
      });
    });
    describe('generating dist paths', () => {
      var opts = parseOptions();
      it('should provide default distPaths', () => {
        expect(opts.destPaths).to.have.keys('pages', 'patterns');
        expect(opts.destPaths.patterns).to.equal('patterns/');
      });
      it('should allow override of distPaths', () => {
        var opts = parseOptions({ destPaths: {
          pages: 'foo/',
          patterns: 'bar/',
          something: 'baz/'
        }});
        expect(opts.destPaths).to.contain.keys(
          'pages', 'patterns', 'something');
        expect(opts.destPaths.pages).to.equal('foo/');
        expect(opts.destPaths.patterns).to.equal('bar/');
      });
    });
    describe('parsing markdownFields', () => {
      const mdOpts = {
        markdownFields: ['notes', 'foo']
      };
      var opts = parseOptions(mdOpts);
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
        var opts = parseOptions({parsers: differentParsers});
        expect(opts.parsers).to.be.an('object').and.to.contain.keys('json');
        expect(opts.parsers.json.randomProperty).to.be.a('string');
      });
      it('should accept additional parsers', () => {
        var opts = parseOptions({ parsers: {
          foo: {
            pattern: /foo/
          }
        }});
        expect(opts.parsers).to.contain.keys('foo');
        expect(opts.parsers.foo).to.contain.keys('pattern');
      });
    });
  });
});
