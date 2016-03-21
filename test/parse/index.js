/* global describe, it */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var parseAll = require('../../dist/parse/');

describe('parse/index (parseAll)', () => {
  it ('should correctly build composite data object', () => {
    var opts = config.parseOptions(config.fixtureOpts);
    return parseAll(opts).then(allData => {
      expect(allData).to.be.an('object').and.to.have
        .keys('data', 'pages', 'patterns', 'options');
    });
  });
});
