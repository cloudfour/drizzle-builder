var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var parseTemplates = require('../../dist/parse/templates');

describe('parse/templates', () => {
  it('should parse and organize templates', () => {
    var opts = config.init(config.fixtureOpts);
    return opts.then(parseTemplates).then(templateData => {
      expect(templateData).to.contain.keys(
        'collection',
        'default',
        'page',
        'partials'
      );
      expect(templateData.partials).to.contain.keys('menu', 'nested');
    });
  });
});
