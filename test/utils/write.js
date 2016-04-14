/* global describe, it, after, before */
var chai = require('chai');
var expect = chai.expect;
var utils = require('../../dist/utils/write');
var Promise = require('bluebird');
var rimraf = Promise.promisify(require('rimraf'));
var testUtils = require('../test-utils');

describe ('utils/write', () => {
  var outPath = './test/dist/testFileWrite/';
  before (() => {
    return rimraf(outPath);
  });
  describe('write/write', () => {
    it ('should create nested directories as needed', () => {
      return utils.write(outPath + '/ding.txt', 'This is stuff').then(() => {
        return testUtils.isFile('./test/dist/testFileWrite/ding.txt')
        .then(result => {
          expect(result).to.be.true;
        });
      });
    });
  });
  describe ('write/writePage', () => {
    it ('should generate an outputPath', () => {
      var pageObj = {
        contents: 'These are some contents'
      };
      var pageId = 'pages.one.two.three';
      var dest = './test/dist/writePage';
      return utils.writePage(pageId, pageObj, dest, 'pages')
      .then(updatedObj => {
        expect(pageObj).to.contain.key('outputPath');
        expect(pageObj.outputPath).to.contain('one/two/three.html');
      });
    });
    it ('should remove resource prefix from output path', () => {
      var pageObj = {
        contents: 'These are some contents'
      };
      var pageId = 'pages.one.two.three';
      var dest = './test/dist/writePage';
      return utils.writePage(pageId, pageObj, dest, 'pages')
      .then(updatedObj => {
        expect(pageObj.outputPath).not.to.contain('pages');
      });
    });
    it ('should write contents to file', () => {
      var pageObj = {
        contents: 'These are some contents'
      };
      var pageId = 'pages.one.two.three';
      var dest = './test/dist/writePage';
      return utils.writePage(pageId, pageObj, dest, 'pages')
      .then(updatedObj => {
        return testUtils.fileContents(pageObj.outputPath).then(contents => {
          expect(contents).to.equal('These are some contents');
        });
      });
    });
  });
});
