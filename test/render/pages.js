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
    opts = config.parseOptions(config.fixtureOpts);
    return opts.then(prepare).then(parse).then(renderPages).then(pData => {
      pageData = pData;
    });
  });
  it ('should compile templates', () => {
    expect(pageData['04-sandbox'].contents)
      .to.have.string('<h1>Sandbox</h1>');
  });
  it ('should override layouts when told to', () => {
    const customPage = pageData.doThis;
    expect(customPage.contents).to.contain('This is the Page Layout');
    expect(customPage.contents).to.contain('<h2>foobar</h2>');
  });
});
