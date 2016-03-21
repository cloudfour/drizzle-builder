/* global describe, it, before */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var prepare = require('../../dist/prepare/');
var parse = require('../../dist/parse/');
var renderPages = require('../../dist/render/pages');

describe.only ('render/pages', () => {
  var opts, allData;
  before (() => {
    opts = config.parseOptions(config.fixtureOpts);
    allData =  prepare(opts).then(parse).then(renderPages);
    return allData;
  });
  it ('should compile templates', () => {
    return allData.then(drizzleData => {
      expect(drizzleData.pages['04-sandbox'].contents)
        .to.have.string('<h1>Sandbox</h1>');
    });
  });
});
