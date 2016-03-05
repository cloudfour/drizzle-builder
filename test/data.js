/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var data = require('../dist/data');
var path  = require('path');

describe ('data', () => {
  describe('parsing pages', () => {
    it ('should correctly parse front matter', done => {
      data.preparePages({ pages: path
        .join(__dirname, 'fixtures/pages/**/*.html') })
        .then(pageData => {
          for (var key in pageData) {
            expect(pageData[key]).to.contain.keys('data');
            expect(pageData[key].data).to.be.an('object');
          }
          done();
        });
    });
    it ('should leave numbers intact in keys', done => {
      data.preparePages({ pages: path
        .join(__dirname, 'fixtures/pages/**/*.html') })
        .then(pageData => {
          expect(pageData).to.contain.keys('04-sandbox');
          done();
        });
    });
  });
});
