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
  describe ('write/writeResource', () => {
    it ('should generate an outputPath', () => {
      var entryKeys = ['one', 'two', 'three', 'page'];
      var pageObj = {
        contents: 'These are some contents'
      };
      var dest = './test/dist/testWriteResource';
      return utils.writeResource(entryKeys, pageObj, dest).then(updatedObj => {
        expect(pageObj).to.contain.key('outputPath');
      });
    });
    it ('should write file based on entryKeys', () => {
      var entryKeys = ['one', 'two', 'three', 'four', 'page'];
      var pageObj = {
        contents: 'These are some contents'
      };
      var dest = './test/dist/testWriteResource';
      return utils.writeResource(entryKeys, pageObj, dest).then(updatedObj => {
        expect(pageObj.outputPath).to.contain('test/dist/testWriteResource');
        expect(pageObj.outputPath).to.contain('one/two/three/four');
      });
    });
    it ('should write `contents` property to file', () => {
      var entryKeys = ['one', 'two', 'three', 'four', 'five', 'page'];
      var pageObj = {
        contents: 'These are some contents'
      };
      var dest = './test/dist/testWriteResource';
      return utils.writeResource(entryKeys, pageObj, dest).then(updatedObj => {
        return testUtils.fileContents(pageObj.outputPath).then(contents => {
          expect(contents).to.equal('These are some contents');
        });
      });
    });
  });
});
