/* global describe, it, before */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var prepare = require('../../dist/prepare/');
var parse = require('../../dist/parse/');
var renderAll = require('../../dist/render/');

describe ('render/index (renderAll)', () => {
  var opts, allData;
  before (() => {
    opts = config.parseOptions(config.fixtureOpts);
    allData = prepare(opts).then(parse).then(renderAll);
  });
  it ('should correctly build composite data object', () => {
    return allData.then(drizzleData => {
      expect(drizzleData).to.be.an('object').and.to.have
        .keys('data', 'pages', 'patterns', 'options', 'layouts');
      expect(drizzleData.pages).to.contain.keys('components', 'doThis');
      expect(drizzleData.patterns).to.contain.keys('01-fingers', 'components');
      expect(drizzleData.data).to.contain.keys('data-as-json');
      expect(drizzleData.layouts).to.contain.keys('default', 'page');
    });
  });
});
