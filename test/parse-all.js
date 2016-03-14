/* global describe, it */
/* Integration testing for parse module */
var chai = require('chai');
var config = require('./config');

var expect = chai.expect;
var parse = require('../dist/parse');
var options = require('../dist/options');

describe.only ('all data parsing', () => {
  describe('building data context object', () => {
    it('builds a basic context object', () => {
      var opts = options({
        data: config.fixturePath('data/**/*.yaml'),
        docs: config.fixturePath('docs/**/*.md'),
        layouts: config.fixturePath('layouts/**/*.hbs'),
        pages: config.fixturePath('pages/**/*'),
        partials: config.fixturePath('partials/**/*.hbs'),
        patterns: config.fixturePath('patterns/**/*.hbs')
      });
      return parse.parseAll(opts).then(dataObj => {
        expect(dataObj).to.be.an('object').and.to.contain.keys(
          'data', 'docs', 'layouts', 'patterns', 'pages');
      });
    });
  });
});
