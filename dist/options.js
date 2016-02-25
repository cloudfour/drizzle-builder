'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _handlebars = require('handlebars');

var Handlebars = _interopRequireDefault(_handlebars).default;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
  templates: {
    handlebars: Handlebars,
    helpers: {},
    layouts: ['src/layouts/*'],
    pages: ['src/pages/**/*'],
    partials: ['src/partials/**/*']
  }
};

/**
 * Merge defaults into options.
 * @return {object} merged options
 */
function mergeDefaults() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  /* eslint-disable prefer-const */
  var _options = options;
  var _options$templates = _options.templates;
  _options$templates = _options$templates === undefined ? {} : _options$templates;
  var _options$templates$ha = _options$templates.handlebars;
  var handlebars = _options$templates$ha === undefined ? defaults.templates.handlebars : _options$templates$ha;
  var _options$templates$he = _options$templates.helpers;
  var helpers = _options$templates$he === undefined ? defaults.templates.helpers : _options$templates$he;
  var _options$templates$la = _options$templates.layouts;
  var layouts = _options$templates$la === undefined ? defaults.templates.layouts : _options$templates$la;
  var _options$templates$pa = _options$templates.pages;
  var pages = _options$templates$pa === undefined ? defaults.templates.pages : _options$templates$pa;
  var _options$templates$pa2 = _options$templates.partials;
  var partials = _options$templates$pa2 === undefined ? defaults.templates.partials : _options$templates$pa2;

  options = {
    templates: { handlebars: handlebars, helpers: helpers, layouts: layouts, pages: pages, partials: partials }
  };
  /* eslint-enable prefer-const */
  return options;
}

/**
 * Map old options object shape onto new shape
 * so that we can provide backwards-compatibility with fabricator
 * The returned options {object} is of the correct shape to have
 * defaults merged into it.
 *
 * @TODO Eventually, support for fabricator/deprecated things should be
 *       moved into their own module
 * @return {object} User options
 */
function translateOptions() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  /* eslint-disable prefer-const */
  options = options || {};
  var _options2 = options;
  var _options2$templates = _options2.templates;
  _options2$templates = _options2$templates === undefined ? {} : _options2$templates;
  var _options2$templates$h = _options2$templates.handlebars;
  var handlebars = _options2$templates$h === undefined ? options.handlebars : _options2$templates$h;
  var _options2$templates$h2 = _options2$templates.helpers;
  var helpers = _options2$templates$h2 === undefined ? options.helpers : _options2$templates$h2;
  var _options2$templates$l = _options2$templates.layouts;
  var layouts = _options2$templates$l === undefined ? options.layouts : _options2$templates$l;
  var _options2$templates$p = _options2$templates.pages;
  var pages = _options2$templates$p === undefined ? options.views : _options2$templates$p;
  var _options2$templates$p2 = _options2$templates.partials;
  var partials = _options2$templates$p2 === undefined ? options.layoutIncludes : _options2$templates$p2;

  options = {
    templates: { handlebars: handlebars, helpers: helpers, layouts: layouts, pages: pages, partials: partials }
  };
  return options;
  /* eslint-enable prefer-const */
}

var parseOptions = function parseOptions(options) {
  return mergeDefaults(translateOptions(options));
};

exports.default = parseOptions;
module.exports = exports['default'];