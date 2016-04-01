/* global describe, it, before */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var prepare = require('../../dist/prepare/');
var parse = require('../../dist/parse/');
var renderAll = require('../../dist/render/');
var writeAll = require('../../dist/write/');

describe ('write/index (writeAll)', () => {
  var opts, allData;
  before (() => {
    opts = config.parseOptions(config.fixtureOpts);
    allData = prepare(opts).then(parse).then(renderAll).then(writeAll);
    return allData;
  });
  it ('should return data object with write information', () => {
    return allData.then(drizzleData => {
      var collection = drizzleData.patterns.components.button.collection;
      expect(collection).to.contain.keys('outputPath', 'contents');
    });
  });
});
