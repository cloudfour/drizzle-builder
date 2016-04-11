var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var init = require('../../dist/init');
var prepare = require('../../dist/prepare/');

describe ('prepare/index', () => {
  var opts;
  beforeEach(() => {
    opts = init(config.fixtureOpts);
  });
  it ('should resolve to an options object', () => {
    return opts.then(prepare).then(preparedOpts => {
      expect(preparedOpts).to.be.an('object');
      expect(preparedOpts).to.contain.keys('handlebars');
    });
  });
  it ('should prepare helpers', () => {
    return opts.then(prepare).then(preparedOpts => {
      expect(preparedOpts.handlebars.helpers).to.contain.keys(
        'toFraction', 'toJSON', 'toSlug'
      );
      expect(preparedOpts.handlebars.helpers).to.contain.keys(
        'block', 'embed', 'content'
      );
    });
  });
  it ('should register layouts as partials', () => {
    return opts.then(prepare).then(preparedOpts => {
      expect(preparedOpts.handlebars.partials).to.contain.keys(
        'default', 'page', 'collection'
      );
    });
  });
  it ('should prepare partials', () => {
    return opts.then(prepare).then(preparedOpts => {
      expect(preparedOpts.handlebars.partials).to.contain.keys(
        'partials.header', 'partials.menu'
      );
      expect(preparedOpts.handlebars.partials).to.contain.keys(
        'partials.nested.thing');
      expect(preparedOpts.handlebars.partials).to.contain.keys('default');
    });
  });
  it ('should prepare pattern partials', () => {
    return opts.then(prepare).then(preparedOpts => {
      expect(preparedOpts.handlebars.partials).to.contain.keys(
        'patterns.pink',
        'patterns.components.button.base',
        'patterns.components.button.color-variation'
      );
    });
  });
  it ('should register the `pattern` helper', () => {
    return opts.then(prepare).then(preparedOpts => {
      expect(preparedOpts.handlebars.helpers).to.contain.key('pattern');
    });
  });
});
