'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preparePartials = exports.prepareHelpers = exports.prepareTemplates = undefined;

var _path = require('path');

var path = _interopRequireDefault(_path).default;

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  return new Promise(function (resolve, reject) {
    if (typeof helpers === 'string' || Array.isArray(helpers)) {
      utils.getFiles(helpers).then(function (helperPaths) {
        var helperFns = new Object();
        helperPaths.forEach(function (helperPath) {
          var helperKey = path.basename(helperPath, path.extname(helperPath));
          helperFns[helperKey] = require(helperPath);
        });
        resolve(helperFns);
      });
    } else {
      resolve(helpers);
    }
  }).then(function (helpers) {
    for (var helper in helpers) {
      Handlebars.registerHelper(helper, helpers[helper]);
    }
    return Handlebars.helpers;
  });
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

exports.prepareTemplates = prepareTemplates;
exports.prepareHelpers = prepareHelpers;
exports.preparePartials = preparePartials;