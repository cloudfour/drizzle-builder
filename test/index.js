/* global describe, it, before */
var chai = require('chai');
var config = require('./config');
var expect = chai.expect;
var drizzle = require('../dist/');
var Promise = require('bluebird');
var rimraf = Promise.promisify(require('rimraf'));

before (() => {
  // Delete all output files
  return rimraf('./test/dist');
});
describe('drizzle', () => {
  const options = config.fixtureOpts;
  it ('should return data used to build the drizzle',  () => {
    return drizzle(options).then(drizzleData => {
      expect(drizzleData.pages).to.be.an('object');
      expect(drizzleData.patterns).to.be.an('object');
      expect(drizzleData.options).to.be.an('object');
      expect(drizzleData.layouts).to.be.an('object');
      expect(drizzleData.data).to.be.an('object');
    });
  });
});
