var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var parsePatterns = require('../../dist/parse/patterns');
var utils = require('../../dist/utils/object');

describe.only ('parse/patterns', () => {
  var opts, patternData;
  before (() => {
    opts = config.init(config.fixtureOpts);
    return opts.then(parsePatterns).then(pData => {
      patternData = pData;
    });
  });
  it ('should correctly build data object from patterns', () => {
    expect(patternData).to.be.an('object');
    expect(patternData).to.have.keys(
      'collection', 'fingers', 'components', 'typography');
    expect(patternData.collection.items).to.have.keys('pink');
  });
  describe('basic collection data on patterns', () => {
    it ('should add basic collection data', () => {
      expect(patternData.collection).to.contain.keys(
        'name', 'items', 'patterns');
    });
  });
  describe('`name` prop override', () => {
    it ('should allow override of name property', () => {
      expect(patternData.components.button.collection.items.aardvark)
        .to.contain.key('name');
      expect(patternData.components.button.collection.items.aardvark.name)
        .to.equal('Something Else');
    });
  });
  describe ('data field parsing', () => {
    it ('should run data fields through parsers', () => {
      var ideal = patternData.fingers.collection.items.ideal;
      expect(ideal).to.contain.keys('data');
      expect(ideal.data).to.contain.keys('ancillary');
      expect(ideal.data.ancillary).to.be.a('string');
      expect(ideal.data.ancillary).to.contain('<ul>');
    });
  });
  describe ('pattern object structure', () => {
    it ('should define the appropriate properties for each pattern', () => {
      var aPattern = patternData.components.button.collection.items.base;
      expect(aPattern).to.have.keys('id', 'name', 'data', 'path', 'contents');
      expect(aPattern).not.to.have.keys('notes', 'links');
      expect(aPattern.data).to.contain.keys('notes', 'links');
    });
  });
  describe('pattern IDs', () => {
    it ('should derive IDs for patterns', () => {
      expect(patternData.collection.items.pink).to.include.key('id');
      expect(patternData.collection.items.pink.id).to.equal('patterns.pink');
      expect(patternData.components.collection.items.orange)
        .to.include.key('id');
      expect(patternData.components.collection.items.orange.id).to.equal(
        'patterns.components.orange'
      );
    });
    it ('should create IDs for patterns that give a retrieval path', () => {
      var longId = patternData.components.button.collection.items.base.id;
      expect(utils.deepPattern(longId, patternData)).to.be.an('object')
        .and.to.contain.keys('name', 'data', 'path', 'id', 'contents');
    });
  });
  it ('should add relevant properties to individual pattern objects', () => {
    expect(patternData.collection.items.pink).to.be.an('object');
    expect(patternData.collection.items.pink).to.have.keys(
      'name', 'id', 'contents', 'path', 'data');
  });
  describe ('parse/collections', () => {
    it ('should create basic stub objects for collections', () => {
      var collection = patternData.components.button.collection;
      expect(collection.name).not.to.be;
      expect(collection).to.contain.keys('items', 'patterns');
    });
    describe ('hidden patterns', () => {
      it ('should hide patterns that have front matter to that effect', () => {
        var collection = patternData.components.button.collection;
        expect(collection.patterns).not.to.contain(collection.items.hello);
        expect(collection.patterns).to.contain(collection.items.base);
      });
    });
    describe ('pattern ordering', () => {
      it ('should order patterns per front matter', () => {
        var collection = patternData.components.button.collection;
        expect(collection.patterns[0]).to.equal(collection.items.disabled);
        expect(collection.patterns[1]).to
          .equal(collection.items['color-variation']);
        expect(collection.patterns[2]).to.equal(collection.items.aardvark);
        expect(collection.patterns[3]).to.equal(collection.items.base);
      });
    });
  });

});
