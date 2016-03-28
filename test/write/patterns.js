/* global describe, it, before */
var chai = require('chai');
var expect = chai.expect;
var config = require('../config');
var prepare = require('../../dist/prepare/');
var parse = require('../../dist/parse/');
var render = require('../../dist/render/');
var writePatterns = require('../../dist/write/patterns');
var options = require('../../dist/options');

describe ('write/patterns', () => {
  var opts = options(config.fixtureOpts);
  var allData;
  before (() => {
    allData = prepare(opts).then(parse).then(render);
    return allData;
  });
  describe ('determining output paths', () => {
    it ('should add outputPath property to pattern collections', () => {
      return allData.then(writePatterns);
    });
  });
});
