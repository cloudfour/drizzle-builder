/* global describe, it, before */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var prepare = require('../../dist/prepare/');
var parse = require('../../dist/parse/');
var renderPatterns = require('../../dist/render/collections');

describe ('render/collections', () => {
  var opts, allData;
  before (() => {
    opts = config.parseOptions(config.fixtureOpts);
    allData =  prepare(opts).then(parse).then(renderPatterns);
    return allData;
  });
  it ('should return patterns data', () => {
    return allData.then(patternData => {
      expect(patternData).to.be.an('object');
      expect(patternData).to.contain.keys('collection', 'components');
    });
  });
  it ('should provide metadata for pattern collections', () => {
    return allData.then(patternData => {
      expect(patternData).to.contain.keys('collection');
      expect(patternData['fingers']).to.contain.keys('collection');
      expect(patternData.components.collection).to.contain.keys('contents');
      // `typography` doesn't have any immediate-child pattern files
      expect(patternData.typography).not.to.contain.key('collection');
    });
  });
  it ('should add a name property for collections', () => {
    return allData.then(patternData => {
      expect(patternData).not.to.contain.keys('contents');
      expect(patternData.collection.name).to.equal('Patterns');
      expect(patternData['fingers'].collection).to.contain.keys(
        'name', 'contents');
      expect(patternData['fingers'].collection.name).to.equal('Fingers');
      expect(patternData.components.button.collection.name)
        .to.equal('Not a Button');
    });
  });
  it ('should render pattern collections with proper context', () => {
    return allData.then(patternData => {
      expect(patternData.typography).to.be.an('object');
      expect(patternData.typography.headings).to.be.an('object');
      expect(patternData.typography.headings)
        .to.contain.keys('collection');
      expect(patternData.collection.contents).to.contain('<h2>Patterns</h2>');
      expect(patternData.components.button.collection.contents).to.contain(
        'class="f-Item-control"'
      );
    });
  });

});
