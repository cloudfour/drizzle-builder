/* global describe, it, before */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var parsePages = require('../../dist/parse/pages');

describe.only ('parse/pages', () => {
  var pageData, opts;
  before (() => {
    opts = config.parseOptions(config.fixtureOpts);
    return parsePages(opts).then(pData => {
      pageData = pData;
    });
  });
  it ('should correctly build data object from pages', () => {
    expect(pageData).to.be.an('object');
    expect(pageData).not.to.contain.keys('items');
    expect(pageData).to.contain.keys(
      'subfolder', '04-sandbox', 'components', 'doThis', 'index');
    expect(pageData.components).to.contain.keys(
      'title', 'path', 'contents'
    );
    expect(pageData.subfolder).not.to.contain.keys('contents');
    expect(pageData.subfolder).to.contain.keys('subpage');
    expect(pageData.subfolder.subpage).to.contain.keys(
      'path'
    );
    expect(pageData['04-sandbox']).to.contain.keys('data');
    expect(pageData['04-sandbox'].data).to.contain.keys(
      'title', 'fabricator');
  });
  it ('should extend page objects in correct precedence', () => {
    expect(pageData['04-sandbox']).to.contain.keys('path');
    expect(pageData['04-sandbox']).not.to.equal('bad');
    expect(pageData['04-sandbox'].data).to.be.an('object')
      .and.to.contain.keys('title', 'path');
    expect(pageData['04-sandbox'].data.path).to.equal('bad');
    expect(pageData['04-sandbox'].contents).not.to.equal('Not so much');
    expect(pageData['04-sandbox'].data.contents).to.equal('Not so much');
  });
});
