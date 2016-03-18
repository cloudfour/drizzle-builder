/* global describe, it */
/* Integration testing for parse module */
var chai = require('chai');
var config = require('./config');

var expect = chai.expect;
var pages = require('../dist/pages');

describe ('building pages', () => {
  it ('should build pages', () => {
    return config.prepare(config.fixtureOpts).then(pages)
    .then(pageStructure => {
      expect(pageStructure).to.be.an('object');
    });
  });
});
