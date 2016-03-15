/* global describe, it */
/* Integration testing for parse module */
var chai = require('chai');
var config = require('./config');

var expect = chai.expect;
var parse = require('../dist/parse');
var options = require('../dist/options');

describe ('all data parsing', () => {
  describe('building data context object', () => {
    it('builds a basic context object', () => {
      var opts = config.fixtureOpts;
      opts.parsers = config.parsers;
      opts = options(opts);
      return parse.parseAll(opts).then(dataObj => {
        expect(dataObj).to.be.an('object').and.to.contain.keys('data',
          'docs', 'pages', 'patterns', 'layouts');
      });
    });
  });
});
