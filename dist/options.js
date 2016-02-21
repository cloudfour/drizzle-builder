'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Handlebars = require('handlebars');

var defaults = {
  templates: {
    handlebars: Handlebars,
    helpers: {},
    layouts: ['src/layouts/*'],
    pages: ['src/pages/**/*'],
    partials: ['src/views/partials/includes/*']
  }
};

var translateOptions = function translateOptions(options) {
  var templateOptionMap = {
    handlebars: 'handlebars',
    helpers: 'helpers',
    layouts: 'layouts',
    layoutIncludes: 'partials',
    views: 'pages'
  };
  options.templates = options.templates || {};
  Object.keys(templateOptionMap).map(function (templateOptionKey) {
    if (options[templateOptionKey]) {
      options.templates[templateOptionKey] = options[templateOptionKey];
      delete options[templateOptionKey];
    }
  });
  return options;
};

var parseOptions = function parseOptions(options) {
  options = translateOptions(options);
  var opts = new Object();
  var templates = Object.assign(defaults.templates, options.templates);
  opts.templates = templates;
  return opts;
};

exports.default = parseOptions;
module.exports = exports['default'];