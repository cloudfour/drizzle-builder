/* global describe, it */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var options = require('../../dist/options');
var preparePartials = require('../../dist/prepare/partials');

describe ('prepare/partials', () => {
  const opts = options(config.fixtureOpts);
  it ('should register partials from opts', () => {
    return preparePartials(opts). then(() => {
      expect(opts.handlebars.partials).to.contain.keys('header', 'menu');
      expect(opts.handlebars.partials).to.contain.keys('nested.thing');
    });
  });
});
