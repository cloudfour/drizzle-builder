var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var parseData = require('../../dist/parse/data');

describe ('parse/data', () => {
  var opts = config.init(config.fixtureOpts);
  var fileKeys = ['another-data', 'data-as-json', 'sample-data'];
  it ('should parse data from files', () => {
    return opts.then(parseData).then(allData => {
      expect(allData).to.be.an('object').and.to.contain.keys(fileKeys);
    });
  });
});
