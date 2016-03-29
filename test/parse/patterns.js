/* global describe, it */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var parsePatterns = require('../../dist/parse/patterns');
var utils = require('../../dist/utils');

describe ('parse/patterns', () => {
  var opts = config.parseOptions(config.fixtureOpts);
  it ('should correctly build data object from patterns', () => {
    return parsePatterns(opts).then(patternData => {
      expect(patternData).to.be.an('object');
      expect(patternData).to.have.keys(
        'collection', 'fingers', 'components', 'typography');
      expect(patternData.collection.items).to.have.keys('pink');
    });
  });
  describe('pattern IDs', () => {
    it ('should derive IDs for patterns', () => {
      return parsePatterns(opts).then(patternData => {
        expect(patternData.collection.items.pink).to.include.key('id');
        expect(patternData.collection.items.pink.id).to.equal('patterns.pink');
        expect(patternData.components.collection.items.orange)
          .to.include.key('id');
        expect(patternData.components.collection.items.orange.id).to.equal(
          'patterns.components.orange'
        );
      });
    });
    it ('should create IDs for patterns that give a retrieval path', () => {
      return parsePatterns(opts).then(patternData => {
        var longId = patternData.components.button.collection.items.base.id;
        expect(utils.deepPattern(longId, patternData)).to.be.an('object')
          .and.to.contain.keys('name', 'data', 'path', 'id', 'contents');
      });
    });
  });
  it ('should add relevant properties to individual pattern objects', () => {
    return parsePatterns(opts).then(patternData => {
      expect(patternData.collection.items.pink).to.be.an('object');
      expect(patternData.collection.items.pink).to.have.keys(
        'name', 'id', 'contents', 'path', 'data');
      //config.logObj(patternData.components.button.collection);
    });
  });
});
