/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var data = require('../dist/data');
var path  = require('path');

describe ('data', () => {
  describe('parsing pages', () => {
    it ('should correctly build data object from pages', done => {
      data.preparePages({ pages: path
        .join(__dirname, 'fixtures/pages/**/*.html') })
        .then(pageData => {
          expect(pageData).to.be.an('object');
          expect(pageData).to.contain.keys('pages');
          expect(pageData.pages).to.contain.keys('items', 'name');
          done();
        });
    });
    it ('should correctly parse front matter from pages', done => {
      data.preparePages({ pages: path
        .join(__dirname, 'fixtures/pages/**/*.html') })
        .then(pageData => {
          expect(pageData.pages.items.components)
            .to.contain.keys('name', 'data');
          expect(pageData.pages.items.components.data).to.be.an('Object');
          expect(pageData.pages.items.components.data)
            .to.contain.keys('fabricator', 'title');
          done();
        });
    });
    it ('should leave numbers intact in keys', done => {
      data.preparePages({ pages: path
        .join(__dirname, 'fixtures/pages/**/*.html') })
        .then(pageData => {
          expect(pageData.pages.items).to.contain.keys('04-sandbox');
          done();
        });
    });
  });
});
