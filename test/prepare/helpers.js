/* global describe, it, before */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var options = require('../../dist/options');
var prepareHelpers = require('../../dist/prepare/helpers');

describe ('prepare/helpers', () => {
  const opts = options(config.fixtureOpts);
  it ('should register pattern helpers', () => {
    return prepareHelpers(opts.handlebars). then(() => {
      expect(opts.handlebars.helpers).to.contain.keys(
        'pattern', 'patternSource');
    });
  });
  it ('should register passed helper', () => {
    return prepareHelpers(opts.handlebars, {
      foo: function () { return 'foo'; }
    }).then(() => {
      expect(opts.handlebars.helpers).to.contain.keys('foo');
    });
  });
  it ('should register helper files', () => {
    var helperPath = config.fixturePath('helpers/**/*.js');
    return prepareHelpers(opts.handlebars, [helperPath]
    ).then(() => {
      expect(opts.handlebars.helpers).to.contain.keys('toFraction',
        'toJSON',
        'toSlug',
        'random',
        'toFixed',
        'toTitle');
    });
  });

});
