'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Promise = require('bluebird');
var globby = require('globby');
var readFile = Promise.promisify(require('fs').readFile);

var readFiles = function readFiles(glob) {
  return globby(glob).then(function (paths) {
    var fileReadPromises = paths.map(function (path) {
      return readFile(path, 'utf-8').then(function (contents) {
        return { path: path, contents: contents };
      });
    });
    return Promise.all(fileReadPromises);
  });
};

/**
 * Convert str to title case (every word will be capitalized)
 * @param {String} str
 * @return {String}
 */
var toTitleCase = function toTitleCase(str) {
  return str.toLowerCase().replace(/(\-|_)/g, ' ').replace(/\w\S*/g, function (word) {
    return word.charAt(0).toUpperCase() + word.substr(1);
  });
};

exports.toTitleCase = toTitleCase;
exports.readFiles = readFiles;