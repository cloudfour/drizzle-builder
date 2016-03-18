/* global describe, it, before */
var chai = require('chai');
var config = require('./config');
var expect = chai.expect;
var parseOptions = require('../dist/options');
var prepare = require('../dist/prepare');

describe('prepare', () => {
  describe ('prepare context for build', () => {
    var options,
      preparePromise;
    before (() => {
      options = parseOptions(config.fixtureOpts);
      preparePromise = prepare(options);
    });
    it ('should construct a context object', () => {
      return preparePromise.then(drizzleData => {
        expect(drizzleData).to.contain.keys('context', 'handlebars');
        expect(drizzleData.context).to.contain.keys(
          'data', 'pages', 'patterns', 'layouts'
        );
      });
    });
  });
});
