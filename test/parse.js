/* global describe, it */
var chai = require('chai');
var config = require('./config');

var expect = chai.expect;
var parse = require('../dist/parse');
var yaml  = require('js-yaml');
var marked = require('marked');

describe ('data', () => {
  const defaultParsers = config.parsers;
  describe('parsing layouts', () => {
    it ('should correctly parse layout files', () => {
      return parse.parseLayouts(config.fixturePath('layouts/**/*.html'),
        { parsers: defaultParsers }
      )
        .then(layoutData => {
          expect(layoutData).to.be.an('Object')
            .and.to.contain.keys('default');
          expect(layoutData.default).to.be.an('object');
          expect(layoutData.default.contents).to.be.a('string');
          expect(layoutData.default).to.contain.keys('path');
        });
    });
  });
  describe('parsing data', () => {
    it ('should correctly parse YAML data from files', () => {
      return parse.parseData(
        config.fixturePath('data/**/*.yaml'),
        { parsers: defaultParsers }
      ).then(dataData => {
        expect(dataData).to.be.an('Object')
          .and.to.contain.keys('another-data', 'sample-data');
        expect(dataData['another-data']).to.be.an('Object')
          .and.to.contain.keys('contents', 'path');
        expect(dataData['another-data'].contents).to.be.an('object');
      });
    });
    it ('should correctly parse JSON data from files', () => {
      return parse.parseData(config.fixturePath('data/**/*.json'),
        { parsers: defaultParsers }
      ).then(dataData => {
        expect(dataData).to.be.an('Object')
          .and.to.contain.keys('data-as-json');
        expect(dataData['data-as-json']).to.be.an('Object')
          .and.to.contain.keys('path', 'contents');
        expect(dataData['data-as-json'].contents).to.be.an('Object')
          .and.to.contain.keys('foo', 'fortunately');
      });
    });
  });
  describe('parsing docs', () => {
    it ('should build an object with docs files', () => {
      return parse.parseDocs({
        docs: config.fixturePath('docs/**/*.md'),
        parseFn: (contents, path) => marked(contents)
      })
        .then(docData => {
          expect(docData).to.contain.keys('doThis');
          expect(docData.doThis).to.be.an('object');
          expect(docData.doThis).to.contain.keys('name', 'contents');
          expect(docData.doThis.name).to.equal('Dothis');
          expect(docData.doThis.contents).to.be.a('string');
          expect(docData.doThis.contents).to.contain('<ul>');
        });
    });
  });
  describe('parsing pages', () => {
    it ('should correctly build data object from pages', () => {
      return parse.parsePages({ pages: config.fixtures + 'pages/**/*.html' })
        .then(pageData => {
          expect(pageData).to.be.an('object');
          expect(pageData).to.contain.keys('pages');
          expect(pageData.pages).to.contain.keys('items', 'name');
        });
    });
    it ('should correctly parse front matter from pages', () => {
      return parse.parsePages({ pages: config.fixtures + 'pages/**/*.html' })
        .then(pageData => {
          expect(pageData.pages.items.components)
            .to.contain.keys('name', 'data');
          expect(pageData.pages.items.components.data).to.be.an('Object');
          expect(pageData.pages.items.components.data)
            .to.contain.keys('fabricator', 'title');
        });
    });
    it ('should leave numbers intact in keys', () => {
      return parse.parsePages({ pages: config.fixtures + 'pages/**/*.html' })
        .then(pageData => {
          expect(pageData.pages.items).to.contain.keys('04-sandbox');
        });
    });
  });

  describe ('parsing patterns', () => {
    it ('builds an object organized by directories', () => {
      return parse.parsePatterns({
        patterns: config.fixturePath('patterns/**/*.html'),
        patternKey: 'patterns'
      })
        .then(patternData => {
          expect(patternData).to.contain.keys('patterns');
          expect(patternData.patterns.items).to.contain.keys(
            '01-fingers', 'components', 'pink');
          expect(patternData.patterns.items.components.items).to.contain.keys(
            'button', 'orange');
        });
    });
    it ('structures each level of object correctly', () => {
      return parse.parsePatterns({
        patterns: config.fixturePath('patterns/**/*.html'),
        patternKey: 'patterns'
      })
        .then(patternData => {
          var aPatternObj = patternData.patterns.items['01-fingers'];
          expect(aPatternObj).to.contain.keys(
            'name', 'items'
          );
          expect(aPatternObj.name).to.equal('Fingers');
          expect(aPatternObj.items).to.be.an('object');
          expect(aPatternObj.items.pamp).to.be.an('object');
          expect(aPatternObj.items.pamp).to.contain.keys(
            'name', 'id', 'data', 'contents'
          );
        });
    });
    it ('parses and creates correct value types', () => {
      return parse.parsePatterns({
        patterns: config.fixturePath('patterns/**/*.html'),
        patternKey: 'patterns'
      })
        .then(patternData => {
          var aPatternObj = patternData.patterns.items['01-fingers'].items.pamp;
          expect(aPatternObj.name).to.be.a('string').and.to.equal('Pamp');
          expect(aPatternObj.id).to.be.a('string').and.to.equal(
            'patterns.01-fingers.pamp');
          expect(aPatternObj.data).to.be.an('object');
          expect(aPatternObj.contents).to.be.a('string');
        });
    });
  });
});
