var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var init = require('../../dist/init');
var prepareHelpers = require('../../dist/prepare/helpers');

describe ('prepare/helpers', () => {
  var opts;
  before(() => {
    opts = init(config.fixtureOpts);
    return opts;
  });
  it ('should register handlebars-layouts helpers', () => {
    return opts.then(prepareHelpers).then(options => {
      expect(options.handlebars.helpers).to.contain.keys(
        'embed', 'block', 'content');
    });
  });
  it ('should register pattern helpers', () => {
    return opts.then(prepareHelpers).then(options => {
      expect(options.handlebars.helpers).to.contain.keys(
        'pattern', 'patternSource');
    });
  });
  it ('should register passed helper', () => {
    opts.helpers = {
      foo: function () { return 'foo'; }
    };
    return init(opts).then(prepareHelpers).then(options => {
      expect(options.handlebars.helpers).to.contain.keys('foo');
    });
  });
  it ('should register helper files', () => {
    opts.helpers = config.fixturePath('helpers/**/*.js');
    return init(opts).then(prepareHelpers).then(options => {
      expect(options.handlebars.helpers).to.contain.keys('toFraction',
        'toJSON',
        'toSlug',
        'random',
        'toFixed',
        'toTitle');
    });
  });
  describe ('namespace conflicts', () => {
    it ('should have this test expanded when error-handling done');
  });

});
