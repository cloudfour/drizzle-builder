var chai = require('chai');
var expect = chai.expect;
var config = require('../config');
var prepare = require('../../dist/prepare/');
var parse = require('../../dist/parse/');
var render = require('../../dist/render/');
var writePages = require('../../dist/write/pages');
var testUtils = require('../test-utils');
var objectUtils = require('../../dist/utils/object');

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
        drizzleData.pages['follow-me'].down.ortwo.outputPath,
        drizzleData.pages['follow-me'].down.orthree.outputPath,
        drizzleData.pages['follow-me'].down.deeper.still.outputPath,
        drizzleData.pages.subfolder.subpage.outputPath
      ];
      return testUtils.areFiles(paths).then(allAreFiles => {
        expect(allAreFiles).to.be.true;
      });
    });
    it ('should write files to correctly-nested paths', () => {
      var followMe = drizzleData.pages['follow-me'];
      expect(followMe.down.apage.outputPath).to.contain('follow-me/down/apage');
      expect(followMe.down.deeper.still.outputPath).to.contain(
        'follow-me/down/deeper/still');
      expect(followMe.down.orthree.outputPath).to.contain(
        'follow-me/down/orthree');
    });
    it ('should write page files with compiled contents', () => {
      return testUtils.fileContents(drizzleData.pages.doThis.outputPath)
      .then(contents => {
        expect(contents).to.contain('<h2>foobar</h2>');
        expect(contents).to.contain('<h1>This is the Page Layout</h1>');
        expect(contents).not.to.contain('Body content should replace this.');
      });
    });
    it ('should write page files with functioning {{data}} helpers', () => {
      return testUtils.fileContents(drizzleData.pages.usingHelpers.outputPath)
      .then(contents => {
        expect(contents).to.contain('<output>cat is in the well</output>');
        expect(contents).to.contain('<output>elfin: small things</output>');
        expect(contents).to.contain('<output>Winston: 43</output>');
        expect(contents).to.contain('<output>5</output>');
      });
    });
    it ('should write page files with functioning {{pages}} helpers', () => {
      return testUtils.fileContents(drizzleData.pages.usingPageHelpers.outputPath)
      .then(contents => {
        expect(contents).to.contain('<output>default: 04-sandbox.html</output>');
        expect(contents).to.contain('<output>order: 1</output>');
        expect(contents).to.contain('<output>alias: apple</output>');
        expect(contents).to.contain('<output>page: pages.nerkle</output>');
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
  describe ('deeply nested pages', () => {
    var alteredData;
    before (() => {
      var opts = config.fixtureOpts;
      opts.dest.pages = './test/dist/pagesnested';
      opts.src.pages = {
        glob: config.fixturePath('morePages/**/*'),
        basedir: config.fixturePath('morePages')
      };
      return config.init(opts).then(prepare).then(parse)
        .then(render).then(writePages).then(aData => {
          alteredData = aData;
        });
    });
    it ('should ouput pages to the correct output paths', () => {
      var pagesById = objectUtils.flattenById(alteredData.pages);
      for (var pageKey in pagesById) {
        const outputPath = pagesById[pageKey].outputPath;
        const expectedPath = pagesById[pageKey].data &&
          pagesById[pageKey].data.expectedOutputPath;
        expect(outputPath).to.contain(expectedPath);
      }
    });
  });
});
