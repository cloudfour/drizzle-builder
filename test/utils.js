/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var utils = require('../dist/utils');
var path  = require('path');

describe ('utils', () => {
  describe('title casing', () => {
    it ('should correctly title-case a string', () => {
      // @TODO move these into fixtures?
      var stringsIn = ['a-doctor and a horse',
        '4 horsemen of the apocalypse!',
        '52-and a half   with extra spaces',
        'YOU do not kNow w8t you r talking ab0oooot'
      ];
      var stringsExpected = ['A Doctor And A Horse',
        '4 Horsemen Of The Apocalypse!',
        '52 And A Half   With Extra Spaces',
        'You Do Not Know W8t You R Talking Ab0oooot'
      ];
      var stringsOut = stringsIn.map(outStr => utils.titleCase(outStr));
      for (var i = 0; i < stringsOut.length; i++) {
        expect(stringsOut[i]).to.equal(stringsExpected[i]);
      }
    });
  });
  describe('getFiles', () => {
    it ('should retrieve a file list from a glob', done => {
      var glob = path.join(__dirname, 'fixtures/helpers/**/*');
      utils.getFiles(glob).then(fileList => {
        expect(Array.isArray(fileList)).to.be.true;
        fileList.map(filePath => {
          // Ham-fisted test that everything is a file, not a directory
          expect(filePath).to.contain('.');
        });
        done();
      });
    });
  });
  describe('isGlob', () => {
    it ('should correctly identify valid glob patterns', () => {
      var goodGlobs = [
        path.join(__dirname, 'fixtures/helpers/**/*'),
        ['foo', 'bar', 'baz'],
        [path.join(__dirname, 'fixtures/helpers/**/*'), 'foo'],
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
  describe('keyname', () => {
    it ('should strip leading numbers by default', () => {
      var result = utils.keyname('foo/01-bar.baz');
      expect(result).not.to.contain('01-');
    });
    it ('should strip parent directories and extensions', () => {
      var result = utils.keyname('foo/01-bar.baz');
      expect(result).not.to.contain('foo');
      expect(result).not.to.contain('baz');
    });
    it ('should accept option to retain leading numbers', () => {
      var result = utils.keyname('foo/01-bar.baz', { stripNumbers: false });
      expect(result).to.contain('01-');
    });
  });
  describe('readFiles', () => {
    it ('should read files from a glob', done => {
      var glob = path.join(__dirname, 'fixtures/helpers/*.js');
      utils.readFiles(glob).then(allFileData => {
        expect(allFileData).to.have.length.of(3);
        expect(allFileData[0]).to.have.keys('path', 'contents');
        done();
      });
    });
    it ('should run passed function over content', done => {
      var glob = path.join(__dirname, 'fixtures/helpers/*.js');
      utils.readFiles(glob, { contentFn: (content, path) => 'foo' })
        .then(allFileData => {
          expect(allFileData).to.have.length.of(3);
          expect(allFileData[0].contents).to.equal('foo');
          done();
        });
    });
  });
  describe('readFilesKeyed', () => {
    it ('should be able to key files by keyname', done => {
      var glob = path.join(__dirname, 'fixtures/helpers/*.js');
      utils.readFilesKeyed(glob).then(allFileData => {
        expect(allFileData).to.be.an('object');
        expect(allFileData).to.contain.keys('toFraction', 'toJSON', 'toSlug');
        done();
      });
    });
    it ('should accept an option to preserve leading numbers', done => {
      var glob = path.join(__dirname, 'fixtures/data/*.yaml');
      utils.readFilesKeyed(glob, { stripNumbers: false }).then(allFileData => {
        expect(allFileData).to.be.an('object');
        done();
      });
    });
    it ('should accept a function to derive keys', done => {
      var glob = path.join(__dirname, 'fixtures/data/*.yaml');
      utils.readFilesKeyed(glob, { keyFn: (path, options) => 'foo' + path })
        .then(allFileData => {
          expect(Object.keys(allFileData)[0]).to.contain('foo');
          done();
        });
    });
    it ('should pass contentFn through to readFiles', done => {
      var glob = path.join(__dirname, 'fixtures/data/*.yaml');
      utils.readFilesKeyed(glob, {
        keyFn: (path, options) => 'foo' + path,
        contentFn: (content, path) => 'foo'
      }).then(allFileData => {
        for (var fileKey in allFileData) {
          expect(fileKey).to.contain('foo');
          expect(allFileData[fileKey]).to.equal('foo');
        }
        done();
      });
    });
  });
  describe('parent directory (parentDirname)', () => {
    it ('should derive correct parent dirname of files', () => {
      var file = path.join(__dirname, 'fixtures/helpers/toFraction.js');
      var parent = utils.parentDirname(file);
      expect(parent).to.equal('helpers');
    });
  });
});
