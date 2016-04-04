/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var utils = require('../../dist/utils/path');

describe ('utils/path', () => {
  describe('relativePathArray', () => {
    it ('should return an array starting at the common root', () => {
      var relative = utils.relativePathArray(
        'foo/bar/baz/ding/dong.txt',
        'foo/bar'
      );
      expect(relative).to.be.an('array').and.to.contain('baz', 'ding');
    });
    it ('should return an empty array if it cannot find common root', () => {
      var relative = utils.relativePathArray(
        'foo/bar/baz/ding/dong.txt',
        'something/else'
      );
      expect(relative).to.be.an('array').and.to.be.empty;
    });
    it ('should work with an absolute path', () => {
      var relative = utils.relativePathArray(
        '/foo/bar/baz/ding/dong.txt',
        '/foo/bar'
      );
      expect(relative).to.be.an('array').and.to.contain('baz', 'ding');
    });
  });
});
