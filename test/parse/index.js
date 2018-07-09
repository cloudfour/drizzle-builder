var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var parseAll = require('../../dist/parse');

describe('parse/index (parseAll)', () => {
  it('should correctly build composite data object', () => {
    var opts = config.init(config.fixtureOpts);
    return opts.then(parseAll).then(allData => {
      expect(allData)
        .to.be.an('object')
        .and.to.have.keys(
          'data',
          'pages',
          'patterns',
          'options',
          'templates',
          'tree'
        );
    });
  });
});
