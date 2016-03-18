/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var config = require('../config');
var pages = require('../../dist/write/pages');
var prepare = require('../../dist/prepare/');
var parse = require('../../dist/parse/');
var options = require('../../dist/options');

describe('write/pages', () => {
  it ('should write page files', () => {
    var opts = options(config.fixtureOpts);
    return prepare(opts).then(parse).then(pages).then(pageData => {
      expect(pageData).to.be.true;
    });
  });
  it ('should have more tests');
});
