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
  var _options$result = options.result;
  var result = _options$result === undefined ? defaults : _options$result;
  var _options$templates = options.templates;
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

  result = {
    templates: { handlebars: handlebars, helpers: helpers, layouts: layouts, pages: pages, partials: partials }
  };
  /* eslint-enable prefer-const */
  return result;
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
  var _options$result2 = options.result;
  var result = _options$result2 === undefined ? defaults : _options$result2;
  var _options$templates2 = options.templates;
  _options$templates2 = _options$templates2 === undefined ? {} : _options$templates2;
  var _options$templates2$h = _options$templates2.handlebars;
  var handlebars = _options$templates2$h === undefined ? options.handlebars : _options$templates2$h;
  var _options$templates2$h2 = _options$templates2.helpers;
  var helpers = _options$templates2$h2 === undefined ? options.helpers : _options$templates2$h2;
  var _options$templates2$l = _options$templates2.layouts;
  var layouts = _options$templates2$l === undefined ? options.layouts : _options$templates2$l;
  var _options$templates2$p = _options$templates2.pages;
  var pages = _options$templates2$p === undefined ? options.views : _options$templates2$p;
  var _options$templates2$p2 = _options$templates2.partials;
  var partials = _options$templates2$p2 === undefined ? options.layoutIncludes : _options$templates2$p2;

  result = {
    templates: { handlebars: handlebars, helpers: helpers, layouts: layouts, pages: pages, partials: partials }
  };
  return result;
  /* eslint-enable prefer-const */
}

var parseOptions = function parseOptions(options) {
  return mergeDefaults(translateOptions(options));
};

exports.default = parseOptions;
module.exports = exports['default'];