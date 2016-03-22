/* global describe, it, before */
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-fs'));
var config = require('../config');
var prepare = require('../../dist/prepare/');
var parse = require('../../dist/parse/');
var render = require('../../dist/render/');
var writePages = require('../../dist/write/pages');
var options = require('../../dist/options');

describe ('write/pages', () => {
  var opts = options(config.fixtureOpts);
  var allData;
  before (() => {
    allData = prepare(opts).then(parse).then(render).then(writePages);
    return allData;
  });
  it ('should write page files', () => {
    allData.then(drizzleData => {
      //config.logObj(drizzleData.pages);
      expect(drizzleData.pages.doThis.outputPath).to.be.a.file;
      expect(drizzleData.pages['04-sandbox'].outputPath).to.be.a.file;
    });
  });
  it ('should write page files with compiled contents', () => {
    allData.then(drizzleData => {
      expect(drizzleData.pages.doThis).to.have.content(
        '<h1>This is the Page Layout</h1>');
      expect(drizzleData.pages.doThis).to.have.content(
        '<h2>foobar</h2>');
      expect(drizzleData.pages.components).to.have.content(
        '<div class="pattern">');
    });
  });
});
