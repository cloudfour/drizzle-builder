var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var prepare = require('../../dist/prepare/');
var parse = require('../../dist/parse/');
var renderAll = require('../../dist/render/');
var writeAll = require('../../dist/write/');

describe ('write/index (writeAll)', () => {
  var drizzleData;
  before (() => {
    return config.init(config.fixtureOpts).then(prepare).then(parse)
      .then(renderAll).then(writeAll).then(dData => {
        drizzleData = dData;
      });
  });
  it ('should return data object with write information', () => {
    var collection = drizzleData.patterns.components.button.collection;
    expect(collection).to.contain.keys('outputPath', 'contents');
  });
});
