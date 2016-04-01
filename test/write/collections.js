/* global describe, it, before */
var chai = require('chai');
var expect = chai.expect;
var config = require('../config');
var prepare = require('../../dist/prepare/');
var parse = require('../../dist/parse/');
var render = require('../../dist/render/');
var writePatterns = require('../../dist/write/collections');
var options = require('../../dist/options');
var testUtils = require('../test-utils');

describe ('write/collections', () => {
  var opts = options(config.fixtureOpts);
  var allData;
  before (() => {
    allData = prepare(opts).then(parse).then(render).then(writePatterns);
    return allData;
  });
  describe ('determining output paths', () => {
    it ('should write out the correct files', () => {
      return allData.then(drizzleData => {
        const outPaths = [
          drizzleData.patterns.collection.outputPath,
          drizzleData.patterns.components.collection.outputPath,
          drizzleData.patterns.components.button.collection.outputPath
        ];
        return testUtils.areFiles(outPaths).then(result => {
          expect(result).to.be.true;
        });
      });
    });
    it ('should name the output collection files correctly', () => {
      return allData.then(drizzleData => {
        var patterns = drizzleData.patterns;
        expect(patterns.components.collection.outputPath)
          .to.contain('components.html');
        expect(patterns.components.button.collection.outputPath).to.contain(
          'button.html'
        );
      });
    });
    it ('should prefix with patterns prefix', () => {

    });
  });
});
