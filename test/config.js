var path = require('path');

const fixtures = path.join(__dirname, 'fixtures/');
var config = {
  fixtures: fixtures,
  fixturePath: function (glob) {
    return path.normalize(path.join(fixtures, glob));
  }
};

module.exports = config;
