/* global describe, it, before */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var prepare = require('../../dist/prepare/');
var parse = require('../../dist/parse/');
var renderPatterns = require('../../dist/render/patterns');

describe ('render/patterns', () => {
  var opts, allData;
  before (() => {
    opts = config.parseOptions(config.fixtureOpts);
    allData =  prepare(opts).then(parse).then(renderPatterns);
    return allData;
  });
  it ('should return patterns data', () => {
    return allData.then(patternData => {
      expect(patternData).to.be.an('object');
      expect(patternData).to.contain.keys(
        'items', 'collection', 'components');
    });
  });
  it ('should provide metadata for pattern collections', () => {
    return allData.then(patternData => {
      expect(patternData).to.contain.keys('collection');
      expect(patternData['01-fingers']).to.contain.keys('collection');
      expect(patternData.components.collection).to.contain.keys('contents');
      // `typography` doesn't have any immediate-child pattern files
      expect(patternData.typography).not.to.contain.key('collection');
    });
  });
  it ('should add a name property for collections', () => {
    return allData.then(patternData => {
      expect(patternData).not.to.contain.keys('contents');
      expect(patternData.collection.name).to.equal('Patterns');
      expect(patternData['01-fingers'].collection).to.contain.keys(
        'name', 'contents');
      expect(patternData['01-fingers'].collection.name).to.equal('Fingers');
    });
  });
  it ('should render pattern collections with proper context', () => {
    return allData.then(patternData => {
      expect(patternData.typography).to.be.an('object');
      expect(patternData.typography.headings).to.be.an('object');
      expect(patternData.typography.headings)
        .to.contain.keys('collection');
      // expect(drizzleData.patterns.typography.headings.contents)
      //   .to.contain('<h1>Headings</h1>');
    });
  });

});
