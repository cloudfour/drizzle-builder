/* global describe, it */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var parsePatterns = require('../../dist/parse/patterns');

describe.only('parse/patterns', () => {
  it ('should correctly build data object from patterns', () => {
    var opts = config.parseOptions(config.fixtureOpts);
    return parsePatterns(opts).then(patternData => {
      expect(patternData).to.be.an('object');
      expect(patternData).to.have.keys('items', '01-fingers', 'components');
      expect(patternData.items).to.have.keys('pink');
    });
  });
  it ('should have more tests');
});
