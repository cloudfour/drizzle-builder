/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var builder = require('../dist/');
var path = require('path');


describe ('drizzle builder integration', () => {
  const options = {
    data: path.join(__dirname, 'fixtures/data/*.yaml'),
    helpers: path.join(__dirname, 'fixtures/helpers/**/*.js'),
    partials: path.join(__dirname, 'fixtures/partials/*.hbs')
  };
  it ('should return data and context',  done => {
    builder(options).then(drizzleData => {
      done();
    });
  });
});
