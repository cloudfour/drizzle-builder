/* global describe, it, before */
var chai = require('chai');
var expect = chai.expect;
var config = require('../config');
var prepare = require('../../dist/prepare/');
var parse = require('../../dist/parse/');
var render = require('../../dist/render/');
var writePages = require('../../dist/write/pages');
var options = require('../../dist/options');

describe ('write/pages', () => {
  var opts = options(config.fixtureOpts);
  var allData;
  before (() => {
    allData = prepare(opts).then(parse).then(render);
    return allData;
  });
  it ('should write page files', () => {
    allData.then(writePages).then(drizzleData => {
      expect(drizzleData).to.be.ok;
    });
  });
  it ('should have more tests');
});
