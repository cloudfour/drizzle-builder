var chai = require('chai');
var expect = chai.expect;
var config = require('../config');
var prepare = require('../../dist/prepare/');
var parse = require('../../dist/parse/');
var render = require('../../dist/render/');
var writePages = require('../../dist/write/pages');
var testUtils = require('../test-utils');

describe ('write/pages', () => {
  var drizzleData;
  describe ('write out page files', () => {
    before (() => {
      return config.init(config.fixtureOpts).then(prepare).then(parse)
        .then(render).then(writePages).then(dData => {
          drizzleData = dData;
        });
    });
    it ('should write page files', () => {
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
    it ('should write page files with compiled contents', () => {
      return testUtils.fileContents(drizzleData.pages.doThis.outputPath)
      .then(contents => {
        expect(contents).to.contain('<h2>foobar</h2>');
        expect(contents).to.contain('<h1>This is the Page Layout</h1>');
        expect(contents).not.to.contain('Body content should replace this.');
      });
    });
  });
  describe ('write to page destination', () => {
    var alteredData;
    before (() => {
      var opts = config.fixtureOpts;
      opts.dest.pages = './test/dist/pageprefixed';
      return config.init(opts).then(prepare).then(parse)
        .then(render).then(writePages).then(aData => {
          alteredData = aData;
        });
    });
    it ('should use dest.pages from options', () => {
      expect(alteredData.pages.subfolder.subpage.outputPath).to.contain(
        'pageprefixed'
      );
    });
  });
});
