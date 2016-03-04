/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var parseOptions = require('../dist/options');
var translateOptions = parseOptions.translator;

describe ('drizzle-builder', () => {
  var keys = [
    'data',
    'dataFn',
    'handlebars',
    'helpers',
    'layouts',
    'pages',
    'partials'
  ];
  describe ('options', () => {
    describe('generating options', () => {
      it ('should not require options to be passed', () => {
        var opts = parseOptions();
        expect(opts).to.be.an('object');
      });
    });
    describe ('translating options from fabricator', () => {
      // This PASSES. Where on Earth are the `undefined`s coming from?
      it ('should work', () => {
        var translated = translateOptions({
          views: 'myViews'
        });
        expect(translated).to.contain.keys(keys);
        expect(translated).not.to.contain.keys('views');
      });
      it ('should translate template options', () => {
        var opts = parseOptions({
          data: 'foo/bar/baz.yml',
          layoutIncludes: 'a path',
          views: 'a path to views'
        });
        expect(opts).to.be.an('object');
        expect(opts.data).to.be.a('string');
        expect(opts.data).to.equal('foo/bar/baz.yml');
        expect(opts.views).not.to.be;
        expect(opts.layoutIncludes).not.to.be;
        expect(opts.pages).to.be.a('string');
        expect(opts.partials).to.be.a('string');
        expect(opts.helpers).to.be.an('object').and.to.be.empty;
        expect(opts).to.contain.keys('layouts', 'partials');
      });
    });

    describe('default options', () => {

      it ('should provide default templating options', () => {
        var opts = parseOptions();
        expect(opts).to.contain.keys(keys);
        expect(opts.handlebars).to.be.an('object');
        expect(opts.dataFn).to.be.a('function');
      });
    });
  });
});
