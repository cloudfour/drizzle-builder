/* global describe, it */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var options = require('../../dist/options');
var preparePartials = require('../../dist/prepare/partials');

describe ('prepare/partials', () => {
  const opts = options(config.fixtureOpts);
  it ('should register layout partials', () => {
    return preparePartials(opts). then(() => {
      expect(opts.handlebars.partials).to.contain.keys(
        'collection', 'default', 'page');
    });
  });
  it ('should register partial partials', () => {
    return preparePartials(opts). then(() => {
      expect(opts.handlebars.partials).to.contain.keys(
        'header', 'menu', 'nested.thing');
    });
  });
  it ('should register patterns files as partials', () => {
    return preparePartials(opts). then(() => {
      expect(opts.handlebars.partials).to.contain.keys(
        'patterns.components.orange', 'patterns.components.button.aardvark');
      expect(opts.handlebars.partials).to.contain.keys(
        'patterns.pink',
        'patterns.components.button.base',
        'patterns.components.button.color-variation'
      );
    });
  });
});
