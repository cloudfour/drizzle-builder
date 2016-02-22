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

/**
 * Merge defaults into options.
 * @return {object} merged options
 */
var mergeDefaults = function mergeDefaults(options) {
  /* eslint-disable prefer-const */

  var _ref = options || {};

  var _ref$templates = _ref.templates;
  _ref$templates = _ref$templates === undefined ? {} : _ref$templates;
  var _ref$templates$handle = _ref$templates.handlebars;
  var handlebars = _ref$templates$handle === undefined ? defaults.templates.handlebars : _ref$templates$handle;
  var _ref$templates$helper = _ref$templates.helpers;
  var helpers = _ref$templates$helper === undefined ? defaults.templates.helpers : _ref$templates$helper;
  var _ref$templates$layout = _ref$templates.layouts;
  var layouts = _ref$templates$layout === undefined ? defaults.templates.layouts : _ref$templates$layout;
  var _ref$templates$pages = _ref$templates.pages;
  var pages = _ref$templates$pages === undefined ? defaults.templates.pages : _ref$templates$pages;
  var _ref$templates$partia = _ref$templates.partials;
  var partials = _ref$templates$partia === undefined ? defaults.templates.partials : _ref$templates$partia;

  options = {
    templates: { handlebars: handlebars, helpers: helpers, layouts: layouts, pages: pages, partials: partials }
  };
  /* eslint-enable prefer-const */
  return options;
};

/**
 * Map old options object shape onto new shape
 * so that we can provide backwards-compatibility with fabricator
 * The returned options {object} is of the correct shape to have
 * defaults merged into it.
 *
 * @return {object} User options
 */
var translateOptions = function translateOptions(options) {
  /* eslint-disable prefer-const */
  options = options || {};
  var _options = options;
  var _options$templates = _options.templates;
  _options$templates = _options$templates === undefined ? {} : _options$templates;
  var _options$templates$ha = _options$templates.handlebars;
  var handlebars = _options$templates$ha === undefined ? options.handlebars : _options$templates$ha;
  var _options$templates$he = _options$templates.helpers;
  var helpers = _options$templates$he === undefined ? options.helpers : _options$templates$he;
  var _options$templates$la = _options$templates.layouts;
  var layouts = _options$templates$la === undefined ? options.layouts : _options$templates$la;
  var _options$templates$pa = _options$templates.pages;
  var pages = _options$templates$pa === undefined ? options.views : _options$templates$pa;
  var _options$templates$pa2 = _options$templates.partials;
  var partials = _options$templates$pa2 === undefined ? options.layoutIncludes : _options$templates$pa2;

  options = {
    templates: { handlebars: handlebars, helpers: helpers, layouts: layouts, pages: pages, partials: partials }
  };
  return options;
  /* eslint-enable prefer-const */
};

var parseOptions = function parseOptions(options) {
  return mergeDefaults(translateOptions(options));
};

exports.default = parseOptions;
module.exports = exports['default'];