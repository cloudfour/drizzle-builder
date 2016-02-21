'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Promise = require('bluebird');

var parseOptions = require('./options');

var drizzle = function drizzle(options) {
  var opts = parseOptions(options);
  return Promise.resolve(opts);
};

exports.default = drizzle;
module.exports = exports['default'];