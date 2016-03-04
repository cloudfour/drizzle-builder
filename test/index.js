/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var builder = require('../dist/');
var path = require('path');


describe ('drizzle builder integration', () => {
  const options = {
    data: {
      src: path.join(__dirname, 'fixtures/data/*.yaml')
    },
    templates: {
      helpers: path.join(__dirname, 'fixtures/helpers/**/*.js'),
      partials: path.join(__dirname, 'fixtures/partials/*.hbs')
    }
  };
  it ('should return data and context',  done => {
    builder(options).then(drizzleData => {
      expect(drizzleData[0]).to.contain.keys('another-data', 'sample-data');
      expect(drizzleData[0]['another-data']).to.be.an('object');
      done();
    });
  });
});
