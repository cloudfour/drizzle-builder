/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var utils = require('../../dist/utils/path');

describe ('utils/path', () => {
  describe('commonRoot', () => {
    it ('should derive a common root path for an Array of filepaths', () => {
      var paths = [
        '/one/two/foo/bar/baz/oof.txt',
        '/one/two/foo/bong/diff.txt',
        '/one/two/bar/ding/dang.txt',
        '/one/two/diff.txt'
      ];
      var common = utils.commonRoot(paths);
      expect(common).to.be.a('string').and.to.contain('/one/two');
    });
    it ('should derive a common root path for an Array of file objects', () => {
      var paths = [
        { path: '/one/two/foo/bar/baz/oof.txt' },
        { path: '/one/two/foo/bong/diff.txt' },
        { path: '/one/two/bar/ding/dang.txt' },
        { path: '/one/two/diff.txt' }
      ];
      var common = utils.commonRoot(paths);
      expect(common).to.be.a('string').and.to.contain('/one/two');
    });
    it ('should return empty string if no common ancestor', () => {
      var paths = [
        { path: '/zing/one/alpha/foo/bar/baz/oof.txt' },
        { path: '/almighty/one/two/foo/bong/diff.txt' },
        { path: '/ancillary/two/bar/ding/dang.txt' },
        { path: '/forensic/two/diff.txt' }
      ];
      var common = utils.commonRoot(paths);
      expect(common).to.be.a('string').and.to.be.empty;
    });
  });
  describe('relativePathArray', () => {
    it ('should be refactored and tested');
  });
});
