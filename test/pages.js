/* global describe, it */
/* Integration testing for parse module */
var chai = require('chai');
var config = require('./config');

var expect = chai.expect;
var pages = require('../dist/pages');
var drizzle = require('../dist');

describe ('building pages', () => {
  it ('should build pages', () => {
    return drizzle(config.fixtureOpts).then(drizzleData => {
      pages(drizzleData.options, drizzleData.context, drizzleData.templates);
    });
  });
});
