/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var config = require('../config');
var path = require('path');
var utils = require('../../dist/utils/parse');

describe ('utils/parse', () => {
  describe('getFiles', () => {
    it ('should retrieve a file list from a glob', () => {
      var glob = config.fixturePath('helpers/**/*');
      return utils.getFiles(glob).then(fileList => {
        expect(Array.isArray(fileList)).to.be.true;
        fileList.map(filePath => {
          // Ham-fisted test that everything is a file, not a directory
          expect(filePath).to.contain('.');
        });
      });
    });
    it ('should should respect glob options', () => {
      var glob = config.fixturePath('helpers/**/*');
      return utils.getFiles(glob, { nodir: false }).then(fileList => {
        // This fileList should contain at least one directory
        expect(Array.isArray(fileList)).to.be.true;
        expect(fileList.filter(listEntry => {
          return path.extname(listEntry).length === 0;
        })).to.have.length.of.at.least(1);

      });
    });
  });
  describe('isGlob', () => {
    it ('should correctly identify valid glob patterns', () => {
      var goodGlobs = [
        config.fixturePath('helpers/**/*'),
        ['foo', 'bar', 'baz'],
        [config.fixturePath('helpers/**/*'), 'foo'],
        'just a string'
      ];
      var badGlobs = [
        5,
        { foo: 'bar', baz: 'boof'},
        ['foo', 'bar', 5],
        '',
        []
      ];
      expect(goodGlobs.every(glob => utils.isGlob(glob))).to.be.true;
      expect(badGlobs.every(glob => utils.isGlob(glob))).to.be.false;
    });
  });
  describe('matchParser', () => {
    it ('should return a default parser function', () => {
      var parser = utils.matchParser('/foo/bar/baz.txt');
      expect(parser).to.be.a('function');
    });
    it ('should accept a default parser function', () => {
      var defaultParsers = {
        default: {
          pattern: /.*/,
          parseFn: (contents, filepath) => 'foo'
        }
      };
      var parser = utils.matchParser('/foo/bar/baz.txt', defaultParsers);
      expect(parser).to.be.a('function');
      expect(parser('ding')).to.equal('foo');
    });
  });
  describe('parseField', () => {
    var opts = config.parseOptions({ fieldParsers: {
      'notes': 'markdown'
    }});
    it ('should run fields through fieldParsers from options', () => {
      // `notes` defaults to markdown parsing (see default opts)
      var parsedField = utils.parseField(
        'notes', 'these are some notes', opts);
      expect(parsedField).to.be.an('object');
      expect(parsedField).to.contain.keys('contents', 'data');
      expect(parsedField.contents).to.be.a('string').and.to.contain('<p>');
    });
    it ('should heed `parser` property in passed object', () => {
      var fieldData = {
        parser: 'markdown',
        contents: 'A nobler thing tis'
      };
      var parsedField = utils.parseField(
        'ding', fieldData, opts);
      expect(parsedField).to.be.an('object');
      expect(parsedField).to.contain.keys('contents', 'data');
      expect(parsedField.contents).to.be.a('string').and.to.contain('<p>');
    });
  });
  describe('readFiles', () => {
    var parsers = {
      default: {
        parseFn: (contents, filepath) => 'foo'
      }
    };
    it ('should read files from a glob', () => {
      var glob = config.fixturePath('helpers/*.js');
      return utils.readFiles(glob).then(allFileData => {
        expect(allFileData).to.have.length.of(3);
        expect(allFileData[0]).to.have.keys('path', 'contents');
      });
    });
    it ('should run passed function over content', () => {
      var glob = config.fixturePath('helpers/*.js');
      return utils.readFiles(glob, { parsers })
        .then(allFileData => {
          expect(allFileData).to.have.length.of(3);
          expect(allFileData[0].contents).to.equal('foo');
        });
    });
    it ('should respect passed glob options', () => {
      var glob = config.fixturePath('files/*');
      // Include dotfiles
      return utils.readFiles(glob, {
        parsers: parsers,
        globOpts: { dot: true }
      })
        .then(allFileData => {
          expect(allFileData).to.have.length(2);
        });
    });
  });
  describe ('readFileTree', () => {
    var parsers = {
      default: {
        parseFn: (contents, filepath) => 'foo'
      }
    };
    it ('should be able to build a tree object of arbitrary files', () => {
      var src = {
        glob: config.fixturePath('helpers/**/*.js'),
        basedir: config.fixturePath('helpers')
      };
      return utils.readFileTree(src, {
        parsers: parsers
      }).then(fileTree => {
        expect(fileTree).to.be.an('object').and.to.contain.keys('moar-helpers',
          'toFraction', 'toJSON');
        expect(fileTree['moar-helpers']).to.be.an('object').and.to.contain.keys(
          'random', 'toFixed'
        );
        expect(fileTree.toFraction).to.be.an('object').and.to.contain.keys(
          'contents', 'path');
        expect(fileTree.toFraction.contents).to.equal('foo');
      });
    });
  });
});
