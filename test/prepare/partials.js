var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var init = require('../../dist/init');
var preparePartials = require('../../dist/prepare/partials');

describe ('prepare/partials', () => {
  var opts;
  before(() => {
    opts = init(config.fixtureOpts);
    return opts;
  });
  it ('should register layout partials', () => {
    return opts.then(preparePartials).then(options => {
      expect(options.handlebars.partials).to.contain.keys(
        'collection', 'default', 'page');
    });
  });
  it ('should register partial partials', () => {
    return opts.then(preparePartials). then(options => {
      expect(options.handlebars.partials).to.contain.keys(
        'header', 'menu', 'nested.thing');
    });
  });
  it ('should register patterns files as partials', () => {
    return opts.then(preparePartials). then(options => {
      expect(options.handlebars.partials).to.contain.keys(
        'patterns.components.orange', 'patterns.components.button.aardvark');
      expect(options.handlebars.partials).to.contain.keys(
        'patterns.pink',
        'patterns.components.button.base',
        'patterns.components.button.color-variation'
      );
    });
  });
});
