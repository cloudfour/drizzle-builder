/* global describe, it */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var parseLayouts = require('../../dist/parse/layouts');

describe('parse/layouts', () => {
  var opts = config.parseOptions(config.fixtureOpts);
  it ('should parse and organize layouts', () => {
    return parseLayouts(opts).then(layoutsData => {
      expect(layoutsData).to.contain.keys('collection', 'default', 'page');
    });
  });
});
