'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Promise = require('bluebird');

var defaults = {
  materials: ['src/materials/**/*']
};

var buildDrizzle = function buildDrizzle(options) {
  var opts = Object.assign(options, defaults);
  return Promise.resolve(opts);
};

exports.default = buildDrizzle;
module.exports = exports['default'];