/* global describe, it */
var chai = require('chai');
var config = require('./config');
var expect = chai.expect;
var parse = require('../dist/parse');
var parseOptions = require('../dist/options');

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
          'contents', 'path');
      });
    });
  });
  describe('parsing layouts', () => {
    it ('should correctly parse layout files', () => {
      return parse.parseFlat(config.fixturePath('layouts/**/*.html'),
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
      return parse.parseFlat(
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
      return parse.parseFlat(config.fixturePath('data/**/*.json'),
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
      var opts = parseOptions(config.fixtureOpts);
      return parse.parsePages(opts).then(pageData => {
        expect(pageData).to.be.an('object');
        expect(pageData).not.to.contain.keys('items');
        expect(pageData).to.contain.keys(
          'subfolder', '04-sandbox', 'components', 'doThis', 'index');
        expect(pageData.components).to.contain.keys(
          'title', 'resourceType', 'outputPath', 'path', 'contents'
        );
        expect(pageData.subfolder).not.to.contain.keys('resourceType');
        expect(pageData.subfolder).to.contain.keys('subpage');
        expect(pageData.subfolder.subpage).to.contain.keys(
          'resourceType', 'outputPath', 'path'
        );
        expect(pageData.subfolder.subpage.outputPath).to.equal(
          'subfolder/subpage.html');
      });
    });
  });

  describe ('parsing patterns', () => {
    it ('builds an object organized by directories', () => {
      return parse.parseRecursive(config.fixturePath('patterns/**/*.html'),
        'patterns',
        { keys: { patterns: 'patterns'},
          markdownFields: ['notes'],
          parsers: defaultParsers
        }
      )
        .then(patternData => {
          expect(patternData).to.contain.keys(
            'name', 'items', '01-fingers', 'components');
          expect(patternData.items).to.contain.keys('pink');
          expect(patternData.components.items).to.contain.keys('orange');
        });
    });
    it ('structures each level of object correctly', () => {
      return parse.parseRecursive(config.fixturePath('patterns/**/*.html'),
        'patterns',
        { keys: { patterns: 'patterns'},
          markdownFields: ['notes'],
          parsers: defaultParsers
        }
      )
        .then(patternData => {
          var aPatternObj = patternData['01-fingers'];
          expect(aPatternObj).to.contain.keys(
            'name', 'items'
          );
          expect(aPatternObj.name).to.equal('Fingers');
          expect(aPatternObj.items).to.be.an('object');
          expect(aPatternObj.items.pamp).to.be.an('object');
          expect(aPatternObj.items.pamp).to.contain.keys(
            'name', 'id', 'contents', 'notes', 'links'
          );
        });
    });
    it ('parses and creates correct value types', () => {
      return parse.parseRecursive(config.fixturePath('patterns/**/*.html'),
        'patterns',
        { keys: { patterns: 'patterns'},
          markdownFields: ['notes'],
          parsers: defaultParsers
        }
      )
        .then(patternData => {
          var aPatternObj = patternData['01-fingers'].items.pamp;
          expect(aPatternObj.name).to.be.a('string').and.to.equal('Pamp');
          expect(aPatternObj.id).to.be.a('string').and.to.equal(
            'patterns.fingers.pamp');
          expect(aPatternObj.data).not.to.be.ok;
          expect(aPatternObj.contents).to.be.a('string');
        });
    });
  });
});
