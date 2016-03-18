/* global describe, it */
var chai = require('chai');
var config = require('./config');
var expect = chai.expect;
var drizzle = require('../dist/');

describe.skip ('drizzle builder integration', () => {
  const options = config.fixtureOpts;
  it ('should return data and context',  () => {
    return drizzle(options).then(drizzleData => {
      expect(drizzleData.context).to.be.an('object');
      expect(drizzleData.options).to.be.an('object');
      expect(drizzleData.handlebars).to.be.an('object');
      expect(drizzleData.context).to.contain.keys(
        'pages', 'patterns', 'data', 'layouts'
      );
      // TODO deeper tests as we go
    });
  });
});
