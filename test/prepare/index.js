var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var prepare = require('../../dist/prepare/');

describe ('prepare/index', () => {
  var opts;
  beforeEach(() => {
    return config.init(config.fixtureOpts).then(options => {
      opts = options;
      return opts;
    });
  });
  it ('should resolve to an options object', () => {
    return prepare(opts).then(preparedOpts => {
      expect(preparedOpts).to.be.an('object');
      expect(preparedOpts).to.contain.keys('handlebars');
    });
  });
  it ('should prepare helpers', () => {
    return prepare(opts).then(preparedOpts => {
      expect(preparedOpts.handlebars.helpers).to.contain.keys(
        'toFraction', 'toJSON', 'toSlug'
      );
      expect(preparedOpts.handlebars.helpers).to.contain.keys(
        'block', 'embed', 'content'
      );
    });
  });
  it ('should register layouts as partials', () => {
    return prepare(opts).then(preparedOpts => {
      expect(preparedOpts.handlebars.partials).to.contain.keys(
        'default', 'page', 'collection'
      );
    });
  });
  it ('should prepare partials', () => {
    return prepare(opts).then(preparedOpts => {
      expect(preparedOpts.handlebars.partials).to.contain.keys(
        'partials.header', 'partials.menu'
      );
      expect(preparedOpts.handlebars.partials).to.contain.keys(
        'partials.nested.thing');
      expect(preparedOpts.handlebars.partials).to.contain.keys('default');
    });
  });
  it ('should prepare pattern partials', () => {
    return prepare(opts).then(preparedOpts => {
      expect(preparedOpts.handlebars.partials).to.contain.keys(
        'patterns.pink',
        'patterns.components.button.base',
        'patterns.components.button.color-variation'
      );
    });
  });
  it ('should register the `pattern` helper', () => {
    return prepare(opts).then(preparedOpts => {
      expect(preparedOpts.handlebars.helpers).to.contain.key('pattern');
    });
  });
});
