var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var prepareHelpers = require('../../dist/prepare/helpers');

var DrizzleError = require('../../dist/utils/error');

describe ('prepare/helpers', () => {
  describe ('default helpers', () => {
    var preparedOptions;
    before(() => {
      return config.init(config.fixtureOpts).then(prepareHelpers)
      .then(pOpts => {
        preparedOptions = pOpts;
        return preparedOptions;
      });
    });
    it ('should register handlebars-layouts helpers', () => {
      expect(preparedOptions.handlebars.helpers).to.contain.keys(
        'embed', 'block', 'content');
    });
    it ('should register pattern helpers', () => {
      expect(preparedOptions.handlebars.helpers).to.contain.keys(
        'pattern', 'patternSource');
    });
    it ('should register data helpers', () => {
      expect(preparedOptions.handlebars.helpers).to.contain.keys('data');
    });
  });
  describe ('passed helpers', () => {
    it ('should register passed helper', () => {
      var opts = config.fixtureOpts;
      opts.helpers = {
        foo: function () { return 'foo'; }
      };
      return config.init(opts).then(prepareHelpers).then(options => {
        expect(options.handlebars.helpers).to.contain.keys('foo');
      });
    });
    it ('should register helper files', () => {
      var opts = config.fixtureOpts;
      opts.helpers = config.fixturePath('helpers/**/*.js');
      return config.init(opts).then(prepareHelpers).then(options => {
        expect(options.handlebars.helpers).to.contain.keys('toFraction',
          'toJSON',
          'toSlug',
          'random',
          'toFixed',
          'toTitle');
      });
    });
  });

  describe ('namespace conflicts', () => {
    var opts;
    before (() => {
      return config.init(config.fixtureOpts).then(options => {
        opts = options;
        return prepareHelpers(opts);
      });
    });
    it ('should raise an error if duplicate helpers encountered', () => {
      return prepareHelpers(opts).catch(error => {
        expect(error).to.be.an.instanceof(DrizzleError);
        expect(error.message).to.contain('already registered');
        expect(error.level).to.equal(DrizzleError.LEVELS.WARN);
      });
    });
  });

});
