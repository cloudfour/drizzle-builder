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
  it ('should create nested directories as needed', () => {
    return utils.write(outPath + '/ding.txt', 'This is stuff').then(() => {
      return testUtils.isFile('./test/dist/testFileWrite/ding.txt')
      .then(result => {
        expect(result).to.be.true;
      });
    });
  });
});
