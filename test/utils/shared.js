/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var utils = require('../../dist/utils/shared');
var path = require('path');

chai.use(require('chai-fs'));

describe('utils/shared', () => {
  describe('idKeys', () => {
    it('should split strings on a common character', () => {
      expect(utils.idKeys('one.two.three.four'))
        .to.be.an('Array')
        .and.to.contain('one', 'two', 'three', 'four');
    });
  });
  describe('keyname', () => {
    it('should not strip leading numbers by default', () => {
      var result = utils.keyname('foo/01-bar.baz');
      expect(result).to.contain('01-'); // This is a change from previous
    });
    it('should strip parent directories and extensions', () => {
      var result = utils.keyname('foo/01-bar.baz');
      expect(result).not.to.contain('foo');
      expect(result).not.to.contain('baz');
    });
  });
  describe('relativePathArray', () => {
    it('should return an array starting at the common root', () => {
      var relative = utils.relativePathArray(
        'foo/bar/baz/ding/dong.txt',
        'foo/bar'
      );
      expect(relative)
        .to.be.an('array')
        .and.to.contain('baz', 'ding');
    });
    it('should return an empty array if it cannot find common root', () => {
      var relative = utils.relativePathArray(
        'foo/bar/baz/ding/dong.txt',
        'something/else'
      );
      expect(relative).to.be.an('array').and.to.be.empty;
    });
    it('should work with an absolute path', () => {
      var relative = utils.relativePathArray(
        '/foo/bar/baz/ding/dong.txt',
        '/foo/bar'
      );
      expect(relative)
        .to.be.an('array')
        .and.to.contain('baz', 'ding');
    });
  });
  describe('resourcePath', () => {
    it('should build a resource path from an ID', () => {
      const pathBuilt = utils.resourcePath('foo.bar.baz.ding.dong');
      expect(pathBuilt).to.contain(path.normalize('bar/baz/ding'));
      expect(pathBuilt).to.have.basename('dong.html');
    });
    it('should prefix a dest path', () => {
      const pathBuilt = utils.resourcePath('foo.bar.baz.ding.dong', 'ding/wow');
      expect(pathBuilt).to.contain(path.normalize('ding/wow/bar/baz/ding'));
    });
    it('should be able to tolerate IDs that do not have separators', () => {
      const pathBuilt = utils.resourcePath('foo');
      expect(pathBuilt).to.be.ok.and.to.have.basename('foo.html');
    });
  });
  describe('titleCase', () => {
    it('should correctly title-case a string', () => {
      // @TODO move these into fixtures?
      var stringsIn = [
        'a-doctor and a horse',
        '4 horsemen of the apocalypse!',
        '52-and a half   with extra spaces',
        'YOU do not kNow w8t you r talking ab0oooot'
      ];
      var stringsExpected = [
        'A Doctor And A Horse',
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
});
