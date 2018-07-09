var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var parseData = require('../../dist/parse/data');

describe('parse/data', () => {
  var opts;
  before(() => {
    return config.init(config.fixtureOpts).then(options => (opts = options));
  });
  it('should parse data from files', () => {
    var fileKeys = ['another-data', 'data-as-json', 'sample-data'];
    parseData(opts).then(allData => {
      expect(allData)
        .to.be.an('object')
        .and.to.contain.keys(fileKeys);
    });
  });
});
