/* global describe, it */
var chai = require('chai');
var config = require('./config');
var expect = chai.expect;
var parseOptions = require('../dist/options');
var translateOptions = parseOptions.translator;

describe ('options', () => {
  var keys = [
    'data',
    'dataFn',
    'docs',
    'docsFn',
    'handlebars',
    'helpers',
    'keys',
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
      it ('should derive naming keys', () => {
        var opts = parseOptions();
        expect(opts.keys).to.be.an('object');
        expect(opts.keys).to.contain.keys('patterns');
      });
    });
    describe.only('respecting passed options', () => {
      it('should respect passed paths/globs', () => {
        var options = {
          data: config.fixturePath('data/**/*.yaml'),
          docs: config.fixturePath('docs/**/*.md'),
          layouts: config.fixturePath('layouts/**/*.hbs'),
          pages: config.fixturePath('pages/**/*'),
          partials: config.fixturePath('partials/**/*.hbs'),
          patterns: config.fixturePath('patterns/**/*.hbs')
        };
        var opts = parseOptions(options);
        Object.keys(options).forEach(key => {
          expect(opts[key]).to.exist.and.to.equal(options[key]);
        });

      });
    });
    describe ('translateOptions', () => {
      it ('should translate old properties', () => {
        var translated = translateOptions({
          data: 'foo/bar/baz.yml',
          docs: 'foo/bar/baz.md',
          materials: 'src/materials/**',
          views: 'myViews',
          layoutIncludes: 'a path',
          keys: {
            materials: 'materials'
          }
        });
        expect(translated).to.contain.keys(keys);
        expect(translated).not.to.contain.keys('views',
          'materials', 'layoutIncludes');
        expect(translated).to.contain.keys(
          'docs', 'pages', 'patterns', 'layouts');
        expect(translated.keys).to.contain.keys('patterns');
        expect(translated.keys.patterns).to.equal('materials');
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
