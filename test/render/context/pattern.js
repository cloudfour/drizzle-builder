/* global describe, it, before */
var chai = require('chai');
var config = require('../../config');
var expect = chai.expect;
var parse = require('../../../dist/parse/');
var patternContext = require('../../../dist/render/context/pattern');

describe ('render/context/patterns', () => {
  var parsed, opts;
  before (() => {
    opts = config.parseOptions(config.fixtureOpts);
    parsed = parse(opts);
    return parsed;
  });
  it ('should add collection data to the context', () => {
    return parsed.then(allData => {
      var context = patternContext(
        allData.patterns.components.collection.items.orange, allData);
      expect(context).to.contain.key('collection');
      expect(context.collection).to.be.an('object').and.to.contain.keys(
        'items', 'name');
    });
  });
  it ('should put data properties at top level', () => {
    return parsed.then(allData => {
      var context = patternContext(
        allData.patterns.fingers.collection.items.pamp, allData);
      expect(context).not.to.contain.key('data');
      expect(context).to.contain.keys('notes', 'links');
    });
  });
  it ('should add all drizzle data', () => {
    return parsed.then(allData => {
      var context = patternContext(
        allData.patterns.fingers.collection.items.pamp, allData);
      expect(context).to.contain.keys('drizzle');
      expect(context.drizzle).to.contain.keys('pages', 'patterns', 'data');
    });
  });

});
