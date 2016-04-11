var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var parseTemplates = require('../../dist/parse/templates');

describe ('parse/templates', () => {
  var opts = config.init(config.fixtureOpts);
  it ('should parse and organize templates', () => {
    return opts.then(parseTemplates).then(templateData => {
      expect(templateData).to.contain.keys(
        'collection', 'default', 'page', 'partials');
      expect(templateData.partials).to.contain.keys('menu', 'nested');
    });
  });
});
