/* global describe, it, before */
var chai = require('chai');
var expect = chai.expect;
var config = require('../config');
var prepare = require('../../dist/prepare/');
var parse = require('../../dist/parse/');
var render = require('../../dist/render/');
var writePages = require('../../dist/write/pages');
var options = require('../../dist/options');
var testUtils = require('../test-utils');

describe ('write/pages', () => {
  var opts = options(config.fixtureOpts);
  var allData;
  before (() => {
    allData = prepare(opts).then(parse).then(render).then(writePages);
    return allData;
  });
  it ('should write page files', () => {
    return allData.then(drizzleData => {
      const paths = [
        drizzleData.pages.doThis.outputPath,
        drizzleData.pages['04-sandbox'].outputPath
      ];
      return testUtils.areFiles(paths).then(allAreFiles => {
        expect(allAreFiles).to.be.true;
      });
    });
  });
  it ('should write page files with compiled contents', () => {
    allData.then(drizzleData => {
      return testUtils.fileContents(drizzleData.pages.doThis.outputPath)
      .then(contents => {
        expect(contents).to.contain('<h2>foobar</h2>');
        expect(contents).to.contain('<h1>This is the Page Layout</h1>');
        expect(contents).not.to.contain('Body content should replace this.');
      });

    });
  });
});
