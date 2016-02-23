'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Promise = require('bluebird');
var globby = require('globby');
var readFile = Promise.promisify(require('fs').readFile);
var path = require('path');

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

var basename = function basename(filepath) {
  return path.basename(filepath, path.extname(filepath));
};
var removeNumbers = function removeNumbers(str) {
  return str.replace(/^[0-9|\.\-]+/, '');
};

var keyname = function keyname(filepath) {
  var preserveNumbers = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  var name = basename(filepath).replace(/\s/g, '-');
  return preserveNumbers ? name : removeNumbers(name);
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
exports.keyname = keyname;