/* global describe, it */
var chai = require('chai');
var config = require('./config');
var expect = chai.expect;
var parse = require('../dist/parse');

describe ('parse', () => {
  const defaultParsers = config.parsers;
  describe ('parseRecursive', () => {
    it('should build a recursive, deep object', () => {
      parse.parseRecursive(config.fixturePath('patterns/**/*'),
        'patterns',
        { parsers: defaultParsers }
      ).then(deepObject => {
        expect(deepObject).to.be.an('object');
        expect(deepObject).to.contain.keys('patterns');
        expect(deepObject.patterns.items).to.be.an('object');
        expect(deepObject.patterns.items['01-fingers']).to.be.an('object');
        var aPattern = deepObject.patterns.items['01-fingers'];
        var deepPattern = aPattern.items.pamp;
        expect(aPattern).to.be.an('object');
        expect(deepPattern).to.be.an('object');
        expect(deepPattern).to.contain.keys('name', 'id',
          'contents', 'data', 'path');
      });
    });
  });
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
  describe ('parsing pages', () => {
    it ('should correctly build data object from pages', () => {
      return parse.parsePages(config.fixturePath('pages/**/*'),
        { parsers: defaultParsers }
      )
        .then(pageData => {
          expect(pageData).to.be.an('object');
          expect(pageData).to.contain.keys('name', 'items');
          expect(pageData.items).to.contain.keys(
            '04-sandbox', 'index', 'doThis');
          expect(pageData.items.doThis).to.be.an('object');
          expect(pageData.items.doThis.contents).to.be.a('string');
          expect(pageData.items.subfolder.items.subpage)
            .to.be.an('object');
        });
    });
  });

  describe ('parsing patterns', () => {
    it ('builds an object organized by directories', () => {
      return parse.parsePatterns(config.fixturePath('patterns/**/*.html'),
        { keys: { patterns: 'patterns'},
          parsers: defaultParsers
        }
      )
        .then(patternData => {
          expect(patternData).to.contain.keys('name', 'items');
          expect(patternData.items).to.contain.keys(
            '01-fingers', 'components', 'pink');
          expect(patternData.items.components.items).to.contain.keys(
            'button', 'orange');
        });
    });
    it ('structures each level of object correctly', () => {
      return parse.parsePatterns(config.fixturePath('patterns/**/*.html'),
        { keys: { patterns: 'patterns'},
          parsers: defaultParsers
        }
      )
        .then(patternData => {
          var aPatternObj = patternData.items['01-fingers'];
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
      return parse.parsePatterns(config.fixturePath('patterns/**/*.html'),
        { keys: { patterns: 'patterns'},
          parsers: defaultParsers
        }
      )
        .then(patternData => {
          var aPatternObj = patternData.items['01-fingers'].items.pamp;
          expect(aPatternObj.name).to.be.a('string').and.to.equal('Pamp');
          expect(aPatternObj.id).to.be.a('string').and.to.equal(
            'patterns.01-fingers.pamp');
          expect(aPatternObj.data).to.be.an('object');
          expect(aPatternObj.contents).to.be.a('string');
        });
    });
  });
});
