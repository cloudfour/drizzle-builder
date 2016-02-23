'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var parseOptions = require('./options');
var prepareTemplates = require('./template').prepareTemplates;
/**
 * Build the drizzle output
 *
 * @return {Promise}; resolves to options {object} (for now)
 */
function drizzle(options) {
  var opts = parseOptions(options);
  return prepareTemplates(opts).then(function (handlebars) {
    return opts;
  });
}

exports.default = drizzle;
module.exports = exports['default'];