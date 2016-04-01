/* global describe, it, before */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var prepare = require('../../dist/prepare/');
var parse = require('../../dist/parse/');
var renderPages = require('../../dist/render/pages');

describe ('render/patterns', () => {
  var opts, allData;
  before (() => {
    opts = config.parseOptions(config.fixtureOpts);
    allData =  prepare(opts).then(parse).then(renderPages);
    return allData;
  });
  describe ('individual pattern rendering', () => {
    it ('should not escape content with the `pattern` helper', () => {
      return allData.then(pageData => {
        expect(pageData.components.contents).not.to.contain('&lt;');
      });
    });
    it ('should escape content with the `patternSource` helper', () => {
      return allData.then(pageData => {
        expect(pageData['04-sandbox'].contents).to.contain('&lt;');
      });
    });
  });
});
