'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Promise = require('bluebird');

var parseOptions = require('./options');

/**
 * Build the drizzle output
 *
 * @return {Promise}; resolves to options {object} (for now)
 */
var drizzle = function drizzle(options) {
  var opts = parseOptions(options);
  return Promise.resolve(opts);
};

exports.default = drizzle;
module.exports = exports['default'];