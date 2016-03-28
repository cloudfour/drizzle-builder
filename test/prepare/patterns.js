/* global describe, it, before */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var options = require('../../dist/options');
var preparePatterns = require('../../dist/prepare/patterns');

describe ('prepare/patterns', () => {
  const opts = options(config.fixtureOpts);
  before (() => {
    return preparePatterns(opts.handlebars, opts.src.patterns);
  });
  it ('should register patterns as partials', () => {
    expect(opts.handlebars.partials).to.contain.keys(
      'patterns.pink',
      'patterns.components.button.base',
      'patterns.components.button.color-variation'
    );
  });

});
