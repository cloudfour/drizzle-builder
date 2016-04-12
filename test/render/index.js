var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var prepare = require('../../dist/prepare/');
var parse = require('../../dist/parse/');
var renderAll = require('../../dist/render/');

describe ('render/index (renderAll)', () => {
  var opts, drizzleData;
  before (() => {
    opts = config.init(config.fixtureOpts);
    return opts.then(prepare).then(parse).then(renderAll).then(dData => {
      drizzleData = dData;
    });
  });
  it ('should correctly build composite data object', () => {
    expect(drizzleData).to.be.an('object').and.to.have
      .keys('data', 'pages', 'patterns', 'options', 'templates');
    expect(drizzleData.pages).to.contain.keys('components', 'doThis');
    expect(drizzleData.patterns).to.contain.keys('fingers', 'components');
    expect(drizzleData.data).to.contain.keys('data-as-json');
    expect(drizzleData.templates).to.contain.keys('default', 'page');
  });
});
