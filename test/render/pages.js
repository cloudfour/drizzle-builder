/* global describe, it, before */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var prepare = require('../../dist/prepare/');
var parse = require('../../dist/parse/');
var renderPages = require('../../dist/render/pages');

describe ('render/pages', () => {
  var opts, pageData;
  before (() => {
    opts = config.init(config.fixtureOpts);
    return opts.then(prepare).then(parse).then(renderPages).then(pData => {
      pageData = pData;
    });
  });
  it ('should compile templates', () => {
    expect(pageData['04-sandbox'].contents)
      .to.have.string('<h1>Sandbox</h1>');
  });
  it ('should be able to deal with empty pages', () => {
    // Technically we know it can because we got this far and there is an
    // empty page file in the fixtures
    expect(pageData.emptyPage).to.be.an('object')
      .and.to.contain.keys('contents');
    // Page contents were empty but are now wrapped with the page template
    expect(pageData.emptyPage.contents).not.to.equal('');
  });
  describe ('custom page layouts', () => {
    it ('should override layouts', () => {
      const customPage = pageData.doThis;
      expect(customPage.contents).to.contain('This is the Page Layout');
      expect(customPage.contents).to.contain('<h2>foobar</h2>');
    });
    it ('should be able to find nested layouts', () => {
      expect(pageData.nerkle.contents).to.contain('Frankly Page');
    });
  });

});
