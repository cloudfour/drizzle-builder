/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var data = require('../dist/parse');
var path  = require('path');
var yaml  = require('js-yaml');

describe ('data', () => {
  describe('parsing layouts', () => {
    it ('should correctly parse layout files', () => {
      return data.parseLayouts({ layouts: path
        .join(__dirname, 'fixtures/layouts/**/*.html') })
        .then(layoutData => {
          expect(layoutData).to.be.an('Object')
            .and.to.contain.keys('default');
          expect(layoutData.default).to.be.a('string');
        });
    });
  });
  describe('parsing data', () => {
    it ('should correctly parse YAML data from files', () => {
      return data.parseData({
        data: path.join(__dirname, 'fixtures/data/**/*.yaml'),
        parseFn: (contents, path) => yaml.safeLoad(contents)
      }).then(dataData => {
        expect(dataData).to.be.an('Object')
          .and.to.contain.keys('another-data', 'sample-data');
        expect(dataData['another-data']).to.be.an('Object')
          .and.to.contain.keys('ding', 'forestry');
      });
    });
    it ('should correctly parse JSON data from files', () => {
      return data.parseData({
        data: path.join(__dirname, 'fixtures/data/**/*.json'),
        parseFn: (contents, path) => JSON.parse(contents)
      }).then(dataData => {
        expect(dataData).to.be.an('Object')
          .and.to.contain.keys('data-as-json');
        expect(dataData['data-as-json']).to.be.an('Object')
          .and.to.contain.keys('foo', 'fortunately');
      });
    });
  });
  describe('parsing pages', () => {
    it ('should correctly build data object from pages', () => {
      return data.parsePages({ pages: path
        .join(__dirname, 'fixtures/pages/**/*.html') })
        .then(pageData => {
          expect(pageData).to.be.an('object');
          expect(pageData).to.contain.keys('pages');
          expect(pageData.pages).to.contain.keys('items', 'name');
        });
    });
    it ('should correctly parse front matter from pages', () => {
      return data.parsePages({ pages: path
        .join(__dirname, 'fixtures/pages/**/*.html') })
        .then(pageData => {
          expect(pageData.pages.items.components)
            .to.contain.keys('name', 'data');
          expect(pageData.pages.items.components.data).to.be.an('Object');
          expect(pageData.pages.items.components.data)
            .to.contain.keys('fabricator', 'title');
        });
    });
    it ('should leave numbers intact in keys', () => {
      return data.parsePages({ pages: path
        .join(__dirname, 'fixtures/pages/**/*.html') })
        .then(pageData => {
          expect(pageData.pages.items).to.contain.keys('04-sandbox');
        });
    });
  });
});
