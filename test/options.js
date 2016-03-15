/* global describe, it */
var chai = require('chai');
var config = require('./config');
var expect = chai.expect;
var parseOptions = require('../dist/options');

describe ('options', () => {
  var keys = [
    'data',
    'handlebars',
    'helpers',
    'keys',
    'layouts',
    'pages',
    'parsers',
    'partials',
    'patterns'
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
