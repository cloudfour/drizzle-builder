/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var builder = require('../dist/');

const options = {
  template: {
    partials: `${__dirname}/fixtures/partials/*`,
    helpers: `${__dirname}/fixtures/helpers/*.js`
  }
};

describe ('drizzle builder integration', () => {
  it ('should return opts used for building', () => {
    builder(options).then(opts => {
      expect(opts).to.be.an.object;
      expect(opts.templates).to.be.an.object;
      expect(opts.templates.handlebars).to.be.an.object;
    });
  });
});
