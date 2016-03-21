/* global describe, it */
var chai = require('chai');
var config = require('./config');
var expect = chai.expect;
var drizzle = require('../dist/');

describe ('drizzle', () => {
  const options = config.fixtureOpts;
  it ('should return data',  () => {
    return drizzle(options).then(drizzleData => {
      expect(drizzleData.pages).to.be.an('object');
      expect(drizzleData.patterns).to.be.an('object');
      expect(drizzleData.options).to.be.an('object');
      // TODO deeper tests as we go
    });
  });
});
