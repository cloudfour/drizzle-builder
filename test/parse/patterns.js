/* global describe, it */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var parsePatterns = require('../../dist/parse/patterns');

describe.only ('parse/patterns', () => {
  var opts = config.parseOptions(config.fixtureOpts);
  it ('should parse patterns from files', () => {
    return parsePatterns(opts).then(allData => {
      config.logObj(allData);
    });
  });
});
