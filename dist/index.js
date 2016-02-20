'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var defaults = {
  materials: ['src/materials/**/*']
};

var buildDrizzle = function buildDrizzle(options) {
  var opts = Object.assign(options, defaults);
  return opts;
};

exports.default = buildDrizzle;
exports.defaults = defaults;