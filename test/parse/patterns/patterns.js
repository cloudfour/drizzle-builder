/* global describe, it */
var chai = require('chai');
var config = require('../../config');
var expect = chai.expect;
var parsePatterns = require('../../../dist/parse/patterns/patterns');
var utils = require('../../../dist/utils');

describe.skip ('parse/patterns', () => {
  var opts = config.parseOptions(config.fixtureOpts);

  it ('should correctly build data object from patterns', () => {
    return parsePatterns(opts).then(patternData => {
      expect(patternData).to.be.an('object');
      expect(patternData).to.have.keys(
        'collection', 'fingers', 'components', 'typography');
      expect(patternData.collection.items).to.have.keys('pink');
    });
  });
  describe('it should add basic collection data to patterns', () => {
    return parsePatterns(opts).then(patternData => {
      expect(patternData.collection).to.contain.keys('name', 'path', 'items');
    });
  });
  describe('it should allow override of `name` prop', () => {
    return parsePatterns(opts).then(patternData => {
      expect(patternData.components.button.collection.items.aardvark)
        .to.contain.key('name');
      expect(patternData.components.button.collection.items.aardvark.name)
        .to.equal('Something Else');
    });
  });
  describe ('data field parsing', () => {
    it ('should run data fields through parsers', () => {
      return parsePatterns(opts).then(patternData => {
        var ideal = patternData.fingers.collection.items.ideal;
        expect(ideal).to.contain.keys('data');
        expect(ideal.data).to.contain.keys('ancillary');
        expect(ideal.data.ancillary).to.be.a('string');
        expect(ideal.data.ancillary).to.contain('<ul>');
      });
    });
  });
  describe ('pattern object structure', () => {
    it ('should define the appropriate properties for each pattern', () => {
      return parsePatterns(opts).then(patternData => {
        var aPattern = patternData.components.button.collection.items.base;
        expect(aPattern).to.have.keys('id', 'name', 'data', 'path', 'contents');
        expect(aPattern).not.to.have.keys('notes', 'links');
        expect(aPattern.data).to.contain.keys('notes', 'links');
      });
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
  describe ('parse/collections', () => {
    it ('should create basic stub objects for collections', () => {
      return parsePatterns(opts).then(patternData => {
        var collection = patternData.components.button.collection;
        expect(collection.name).not.to.be;
        expect(collection).to.contain.keys('items', 'path');
      });
    });
  });
});
