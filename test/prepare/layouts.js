/* global describe, it, before */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var options = require('../../dist/options');
var prepareLayouts = require('../../dist/prepare/layouts');

describe ('prepare/layouts', () => {
  const opts = options(config.fixtureOpts);
  before (() => {
    return prepareLayouts(opts);
  });
  it ('should register layouts as partials', () => {
    expect(opts.handlebars.partials).to.contain.keys('default');
  });
  it ('should register handlebars-layouts helpers', () => {
    expect(opts.handlebars.helpers).to.contain.keys(
      'embed', 'block', 'content');
  });
});
