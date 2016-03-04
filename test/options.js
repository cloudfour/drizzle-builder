/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var parseOptions = require('../dist/options');
var translateOptions = parseOptions.translator;

describe ('drizzle-builder', () => {
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
        var actual = translateOptions({ views: 'myViews' });
        var expected = {
          templates: { pages: 'myViews' }
        };
        expect(actual, expected).to.be.equal;
      });
      it ('should translate template options', () => {
        var opts = parseOptions({
          layoutIncludes: 'a path',
          views: 'a path to views'
        });
        expect(opts).to.be.an('object');
        expect(opts.views).not.to.be;
        expect(opts.layoutIncludes).not.to.be;
        expect(opts.templates).to.be.an('object');
        expect(opts.templates.pages).to.be.a('string');
        expect(opts.templates.partials).to.be.a('string');
        expect(opts.templates.helpers).to.be.an('object').and.to.be.empty;
        expect(opts.templates).to.contain.keys('layouts', 'handlebars');
      });
    });

    describe('default options', () => {

      it ('should provide default templating options', () => {
        var opts = parseOptions();
        expect(opts).to.contain.keys('templates');
        expect(opts.templates).to.be.an('object');
        expect(opts.templates).to.have.keys('handlebars', 'helpers',
          'layouts', 'pages', 'partials');
        expect(opts.templates.handlebars).to.be.an('object');
      });
    });
  });
});
