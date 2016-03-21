/* global describe, it */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var parsePages = require('../../dist/parse/pages');

describe('parse/pages', () => {
  it ('should correctly build data object from pages', () => {
    var opts = config.parseOptions(config.fixtureOpts);
    return parsePages(opts).then(pageData => {
      expect(pageData).to.be.an('object');
      expect(pageData).not.to.contain.keys('items');
      expect(pageData).to.contain.keys(
        'subfolder', '04-sandbox', 'components', 'doThis', 'index');
      expect(pageData.components).to.contain.keys(
        'title', 'resourceType', 'outputPath', 'path', 'contents'
      );
      expect(pageData.subfolder).not.to.contain.keys('resourceType');
      expect(pageData.subfolder).to.contain.keys('subpage');
      expect(pageData.subfolder.subpage).to.contain.keys(
        'resourceType', 'outputPath', 'path'
      );
      expect(pageData.subfolder.subpage.outputPath).to.equal(
        'subfolder/subpage.html');
    });
  });
});
