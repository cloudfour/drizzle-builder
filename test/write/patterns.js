/* global describe, it, before */
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-fs'));
var config = require('../config');
var prepare = require('../../dist/prepare/');
var parse = require('../../dist/parse/');
var render = require('../../dist/render/');
var writePatterns = require('../../dist/write/patterns');
var options = require('../../dist/options');

describe.skip ('write/patterns', () => {
  var opts = options(config.fixtureOpts);
  var allData;
  before (() => {
    allData = prepare(opts).then(parse).then(render).then(writePatterns);
    return allData;
  });
  describe ('determining output paths', () => {
    it ('should add outputPath property to pattern collections', () => {
      allData.then(drizzleData => {
        config.logObj(drizzleData.patterns);
      });
    });
  });
});
