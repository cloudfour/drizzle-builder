/* global describe, it */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var parsePatterns = require('../../dist/parse/patterns');

describe ('parse/patterns', () => {
  var opts = config.parseOptions(config.fixtureOpts);
  it ('should correctly build data object from patterns', () => {
    return parsePatterns(opts).then(patternData => {
      expect(patternData).to.be.an('object');
      expect(patternData).to.have.keys(
        'items', 'fingers', 'components', 'typography');
      expect(patternData.items).to.have.keys('pink');
    });
  });
  it ('should derive correct IDs for patterns', () => {
    return parsePatterns(opts).then(patternData => {
      expect(patternData.items.pink).to.include.key('id');
      expect(patternData.items.pink.id).to.equal('patterns.pink');
      expect(patternData.components.items.orange).to.include.key('id');
      expect(patternData.components.items.orange.id).to.equal(
        'patterns.components.orange'
      );
    });
  });
  it ('should add relevant properties to individual pattern objects', () => {
    return parsePatterns(opts).then(patternData => {
      expect(patternData.items.pink).to.be.an('object');
      expect(patternData.items.pink).to.contain.keys(
        'name', 'id', 'contents', 'path', 'data');
    });
  });
});
