var chai = require('chai');
var expect = chai.expect;
var config = require('../config');
var prepare = require('../../dist/prepare/');
var parse = require('../../dist/parse/');
var render = require('../../dist/render/');
var writePatterns = require('../../dist/write/collections');
var init = require('../../dist/init');
var testUtils = require('../test-utils');

describe ('write/collections', () => {
  var drizzleData;
  before (() => {
    return init(config.fixtureOpts).then(prepare).then(parse).then(render)
      .then(writePatterns).then(aData => {
        drizzleData = aData;
        return drizzleData;
      });
  });
  describe ('determining output paths', () => {
    it ('should write out the correct files', () => {
      const outPaths = [
        drizzleData.patterns.collection.outputPath,
        drizzleData.patterns.components.collection.outputPath,
        drizzleData.patterns.components.button.collection.outputPath
      ];
      return testUtils.areFiles(outPaths).then(result => {
        expect(result).to.be.true;
      });
    });
    it ('should name the output collection files correctly', () => {
      var patterns = drizzleData.patterns;
      expect(patterns.components.collection.outputPath)
        .to.contain('components.html');
      expect(patterns.components.button.collection.outputPath).to.contain(
        'button.html'
      );
      expect(patterns.collection.outputPath).to.contain('patterns.html');
    });
    it ('should prefix with patterns prefix');
  });
});
