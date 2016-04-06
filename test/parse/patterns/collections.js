/* global describe, it, before */
var chai = require('chai');
var config = require('../../config');
var expect = chai.expect;
var parsePatterns = require('../../../dist/parse/patterns/patterns');
var parseCollections = require('../../../dist/parse/patterns/collections');
//var utils = require('../../../dist/utils');

describe.skip ('parse/collections', () => {
  var opts = config.parseOptions(config.fixtureOpts);
  var patternPromise;
  before (() => {
    patternPromise = parsePatterns(opts);
    return patternPromise;
  });
  it ('should correctly build data object from patterns', () => {
    return patternPromise.then(firstPatternData => {
      return parseCollections(firstPatternData, opts).then(patternData => {
        expect(patternData.collection).to.contain.keys('name');
      });
    });
  });

  describe ('collection.yml/json metadata', () => {
    it ('should handle metadata in YAML and JSON', () => {
      return patternPromise.then(firstPatternData => {
        return parseCollections(firstPatternData, opts).then(patternData => {
          var collection = patternData.fingers.collection; // JSON file
          expect(collection).to.contain.keys('order');
        });
      });
    });
    it ('should order patterns based on metadata', () => {
      return patternPromise.then(firstPatternData => {
        return parseCollections(firstPatternData, opts).then(patternData => {
          var collection = patternData.components.button.collection;
          expect(collection).to.contain.keys('order');
        });
      });
    });

    it ('should include all patterns in collection.patterns', () => {
      return patternPromise.then(firstPatternData => {
        return parseCollections(firstPatternData, opts).then(patternData => {
          var collection = patternData.fingers.collection;
          expect(collection.patterns).length.to.be.at.least(4);
          var lastItem = collection.patterns.pop();
          expect(lastItem.name).to.equal('Omitted');
        });
      });
    });
    it ('should omit hidden patterns from collection.patterns', () => {
      return patternPromise.then(firstPatternData => {
        return parseCollections(firstPatternData, opts).then(patternData => {
          var collection = patternData.fingers.collection;
          collection.patterns.forEach(pattern => {
            expect(pattern.name).not.to.equal('Missing');
          });
        });
      });
    });
  });
});
