'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var globby = require('globby');
var path = require('path');
var utils = require('./utils');

/**
 * Register helpers on the passed Handlebars instance.
 * Accept an object with helperKey => helperFunctions,
 * or a glob (as Array or string) of files (modules) to
 * register. In the latter case, the filename w/o extension
 * will be used as the helper key.
 *
 * @param {Object} Handlebars handlebars instance
 * @param {Object} || [{Array} || {String} glob]
 * @param return {Promise}, resolving to
 *           {Object} of all helpers registered on Handlebars
 */
function prepareHelpers(Handlebars) {
  var helpers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (typeof helpers === 'string' || Array.isArray(helpers)) {
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
}

/**
 * Register a glob of partials.
 * @param {Object} Handlebars instance
 * @param {String || Array} glob
 */
function preparePartials(Handlebars) {
  var partials = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

  return utils.readFiles(partials).then(function (partialFiles) {
    partialFiles.forEach(function (partialFile) {
      var partialKey = utils.keyname(partialFile.path);
      Handlebars.registerPartial(partialKey, partialFile.contents);
    });
    return Handlebars.partials;
  });
}

/**
 * Register partials and helpers per opts
 *
 * @param {Object} opts Drizzle options
 * @return {Promise} resolves to {Object} Handlebars instance
 */
function prepareTemplates(opts) {
  var templateOpts = opts.templates;
  return Promise.all([prepareHelpers(templateOpts.handlebars, templateOpts.helpers), preparePartials(templateOpts.handlebars, templateOpts.partials)]).then(function (handlebarsInfo) {
    return templateOpts.handlebars;
  });
}

exports.default = prepareTemplates;
exports.prepareTemplates = prepareTemplates;
exports.prepareHelpers = prepareHelpers;
exports.preparePartials = preparePartials;