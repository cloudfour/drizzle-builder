/* global describe, it */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var parsePatterns = require('../../dist/parse/patterns');
var utils = require('../../dist/utils');

describe ('parse/collections', () => {
  var opts = config.parseOptions(config.fixtureOpts);

  describe ('collection.yml/json metadata', () => {
    it ('should handle metadata in YAML and JSON', () => {
      return parsePatterns(opts).then(patternData => {
        var collection = patternData.fingers.collection; // JSON file
        expect(collection).to.contain.keys('order');
      });
    });
    it ('should order patterns based on metadata', () => {
      return parsePatterns(opts).then(patternData => {
        var collection = patternData.components.button.collection;
        expect(collection).to.contain.keys('order');
      });
    });
    it ('should include all patterns in collection.patterns', () => {
      return parsePatterns(opts).then(patternData => {
        var collection = patternData.fingers.collection;
        expect(collection.patterns).length.to.be.at.least(4);
        var lastItem = collection.patterns.pop();
        expect(lastItem.name).to.equal('Omitted');
      });
    });
    it ('should omit hidden patterns from collection.patterns', () => {
      return parsePatterns(opts).then(patternData => {
        var collection = patternData.fingers.collection;
        collection.patterns.forEach(pattern => {
          expect(pattern.name).not.to.equal('Missing');
        });
      });
    });
  });
});
