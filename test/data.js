/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var prepareData = require('../dist/data');

describe ('data', () => {
  describe ('data parsing', () => {
    it ('should parse YAML data from files', done => {
      prepareData(`${__dirname}/fixtures/data/*.yaml`).then(dataObj => {
        expect(dataObj).to.contain.keys('sample-data');
        expect(dataObj['sample-data'].foo).to.be.an('Array');
        done();
      });
    });
  });
});
