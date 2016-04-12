var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var preparePartials = require('../../dist/prepare/partials');

var DrizzleError = require('../../dist/utils/error');

describe ('prepare/partials', () => {
  var options;
  describe ('registering partials', () => {
    beforeEach(() => {
      return config.init(config.fixtureOpts)
      .then(preparePartials).then(pOpts => {
        options = pOpts;
      });
    });
    it ('should register layout partials', () => {
      expect(options.handlebars.partials).to.contain.keys(
        'collection', 'default', 'page');
    });
    it ('should register partials', () => {
      expect(options.handlebars.partials).to.contain.keys(
        'partials.header', 'partials.menu', 'partials.nested.thing');
    });
    it ('should register patterns files as partials', () => {
      expect(options.handlebars.partials).to.contain.keys(
        'patterns.components.orange', 'patterns.components.button.aardvark');
      expect(options.handlebars.partials).to.contain.keys(
        'patterns.pink',
        'patterns.components.button.base',
        'patterns.components.button.color-variation'
      );
    });
  });
  describe ('reporting errors', () => {
    var options;
    before (() => {
      return config.init(config.fixtureOpts).then(preparePartials)
        .then(pOpts => {
          options = pOpts;
        });
    });
    it ('should log error if duplicate partial encountered', () => {
      return preparePartials(options).catch(error => {
        expect(error).to.contain.key('message');
        expect(error).to.be.an.instanceOf(DrizzleError);
      });
    });
  });
});
