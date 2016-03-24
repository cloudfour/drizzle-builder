/* global describe, it, before */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var prepare = require('../../dist/prepare/');
var parse = require('../../dist/parse/');
var renderPatterns = require('../../dist/render/patterns');

describe ('render/patterns', () => {
  var opts, allData;
  before (() => {
    opts = config.parseOptions(config.fixtureOpts);
    allData =  prepare(opts).then(parse).then(renderPatterns);
    return allData;
  });
  it ('should have data', () => {
    allData.then(drizzleData => {
      config.logObj(drizzleData.patterns);
    });
  });
});
