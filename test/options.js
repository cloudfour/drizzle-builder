/* global describe, it */
var chai = require('chai');
var config = require('./config');
var expect = chai.expect;
var parseOptions = require('../dist/options');

describe ('options', () => {
  var keys = [
    'data',
    'handlebars',
    'helpers',
    'keys',
    'layouts',
    'pages',
    'partials',
    'patterns'
  ];
  describe ('parseOptions', () => {
    describe('generating default options', () => {
      it ('should generate default options when none passed', () => {
        var opts = parseOptions();
        expect(opts).to.be.an('object');
      });
    });
  });
});
