/* global describe, it */
var chai = require('chai');
var config = require('./config');
var expect = chai.expect;
var builder = require('../dist/');

describe ('drizzle builder integration', () => {
  const options = config.fixtureOpts;
  it ('should return data and context',  () => {
    return builder(options).then(allData => {
      expect(allData.context).to.be.an('object');
      expect(allData.templates).to.be.an('object');
      // TODO deeper tests as we go
    });
  });
});
