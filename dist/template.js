'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var globby = require('globby');
var path = require('path');

var prepareHelpers = function prepareHelpers(Handlebars) {
  var helpers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (typeof helpers === 'string') {
    helpers = Array.of(helpers);
  }
  if (Array.isArray(helpers)) {
    return globby(helpers).then(function (helperPaths) {
      helperPaths.forEach(function (helperPath) {
        var helperKey = path.basename(helperPath, path.extname(helperPath));
        Handlebars.registerHelper(helperKey, require(helperPath));
      });
      return Handlebars.helpers;
    });
  }
  for (var helperKey in helpers) {
    Handlebars.registerHelper(helperKey, helpers[helperKey]);
  }
  return Promise.resolve(Handlebars.helpers);
};

var prepareLayouts = function prepareLayouts() {};
var preparePartials = function preparePartials() {};

var prepareTemplates = function prepareTemplates(opts) {
  prepareHelpers(opts.templates && opts.templates.helpers);
  prepareLayouts(opts);
  preparePartials(opts);
};

exports.default = prepareTemplates;
exports.prepareHelpers = prepareHelpers;