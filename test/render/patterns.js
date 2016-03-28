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
    return allData.then(drizzleData => {
      expect(drizzleData.patterns).to.be.an('object');
      expect(drizzleData.patterns).to.contain.keys(
        'items', 'contents', 'components');
    });
  });
  it ('should remove contents from individual patterns', () => {
    return allData.then(drizzleData => {
      expect(drizzleData.patterns.items).to.be.an('object');
      expect(drizzleData.patterns.items.pink).to.be.an('object');
      expect(drizzleData.patterns.items.pink).not.to.have.key('contents');
      expect(drizzleData.patterns.items.pink).to.contain.key('id');
    });
  });
  it ('should provide contents for pattern collections', () => {
    return allData.then(drizzleData => {
      expect(drizzleData.patterns).to.contain.keys('contents');
      expect(drizzleData.patterns['01-fingers']).to.contain.keys('contents');
      expect(drizzleData.patterns.components).to.contain.keys('contents');
      // `typography` doesn't have any immediate-child pattern files
      expect(drizzleData.patterns.typography).not.to.contain.key('contents');
    });
  });
  it ('should add a name property for collections', () => {
    return allData.then(drizzleData => {
      expect(drizzleData.patterns).to.contain.keys('contents');
      expect(drizzleData.patterns.name).to.equal('Patterns');
      expect(drizzleData.patterns['01-fingers']).to.contain.keys('name');
      expect(drizzleData.patterns['01-fingers'].name).to.equal('Fingers');
    });
  });
  it ('should render pattern collections with proper context', () => {
    return allData.then(drizzleData => {
      expect(drizzleData.patterns.typography).to.be.an('object');
      expect(drizzleData.patterns.typography.headings).to.be.an('object');
      expect(drizzleData.patterns.typography.headings)
        .to.contain.keys('contents');
      // expect(drizzleData.patterns.typography.headings.contents)
      //   .to.contain('<h1>Headings</h1>');
    });
  });

});
