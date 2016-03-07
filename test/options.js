/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var parseOptions = require('../dist/options');
var translateOptions = parseOptions.translator;

describe ('options', () => {
  var keys = [
    'data',
    'dataFn',
    'handlebars',
    'helpers',
    'layouts',
    'pages',
    'partials',
    'patterns'
  ];
  describe ('options parsing', () => {
    describe('generating options', () => {
      it ('should not require options to be passed', () => {
        var opts = parseOptions();
        expect(opts).to.be.an('object');
      });
      it ('should provide default templating options', () => {
        var opts = parseOptions();
        expect(opts).to.contain.keys(keys);
        expect(opts.handlebars).to.be.an('object');
        expect(opts.dataFn).to.be.a('function');
      });
    });
    describe ('translateOptions', () => {
      it ('should translate old properties', () => {
        var translated = translateOptions({
          data: 'foo/bar/baz.yml',
          materials: 'src/materials/**',
          views: 'myViews',
          layoutIncludes: 'a path',
        });
        expect(translated).to.contain.keys(keys);
        expect(translated).not.to.contain.keys('views',
          'materials', 'layoutIncludes');
        expect(translated).to.contain.keys('pages', 'patterns', 'layouts');

      });

      it ('should translate and parse options correctly', () => {
        var opts = parseOptions({
          data: 'foo/bar/baz.yml',
          materials: 'src/materials/**',
          views: 'myViews',
          layoutIncludes: 'a path',
        });
        expect(opts).to.be.an('object');
        expect(opts.data).to.be.a('string');
        expect(opts.data).to.equal('foo/bar/baz.yml');
        expect(opts.views).not.to.be;
        expect(opts.layoutIncludes).not.to.be;
        expect(opts.pages).to.be.a('string');
        expect(opts.partials).to.be.a('string');
        expect(opts.helpers).to.be.an('object').and.to.be.empty;
        expect(opts).to.contain.keys('layouts', 'partials', 'patterns');
      });
    });

  });
});
