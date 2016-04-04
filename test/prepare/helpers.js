/* global describe, it, before */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var options = require('../../dist/options');
var prepareHelpers = require('../../dist/prepare/helpers');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe ('prepare/helpers', () => {
  const opts = options(config.fixtureOpts);
  it ('should register pattern helpers', () => {
    return prepareHelpers(opts).then(() => {
      expect(opts.handlebars.helpers).to.contain.keys(
        'pattern', 'patternSource');
    });
  });
  it ('should register passed helper', () => {
    opts.helpers = {
      foo: function () { return 'foo'; }
    };
    return prepareHelpers(opts).then(() => {
      expect(opts.handlebars.helpers).to.contain.keys('foo');
    });
  });
  it ('should register helper files', () => {
    opts.helpers = config.fixturePath('helpers/**/*.js');
    return prepareHelpers(opts).then(() => {
      expect(opts.handlebars.helpers).to.contain.keys('toFraction',
        'toJSON',
        'toSlug',
        'random',
        'toFixed',
        'toTitle');
    });
  });
  describe ('namespace conflicts', () => {
    var opts, logStub;
    before (() => {
      opts = options(config.fixtureOpts);
      logStub = sinon.stub(console, 'log');
    });
    it ('should report namespace conflicts', () => {
      opts.handlebars.registerPartial('pattern', 'empty');
      return prepareHelpers(opts).then(() => {
        console.log.restore();
        expect(logStub).to.have.been.calledOnce;
      });
    });
    it ('should have this test expanded when error-handling done');

  });

});
