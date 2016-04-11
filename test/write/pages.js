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
  describe ('write out page files', () => {
    before (() => {
      allData = prepare(opts).then(parse).then(render).then(writePages);
      return allData;
    });
    it ('should write page files', () => {
      return allData.then(drizzleData => {
        const paths = [
          drizzleData.pages.doThis.outputPath,
          drizzleData.pages['04-sandbox'].outputPath,
          drizzleData.pages['follow-me'].down.apage.outputPath,
          drizzleData.pages.subfolder.subpage.outputPath
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
  describe ('write to page destination', () => {
    var alteredData;
    before (() => {
      opts.dest.pages = './test/dist/pageprefixed';
      alteredData = prepare(opts).then(parse).then(render).then(writePages);
      return alteredData;
    });
    it ('should use dest.pages from options', () => {
      return alteredData.then(drizzleData => {
        expect(drizzleData.pages.subfolder.subpage.outputPath).to.contain(
          'pageprefixed'
        );
      });
    });
  });
});
