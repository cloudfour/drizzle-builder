var path = require('path');

function fixturePath (glob) {
  return path.normalize(path.join(fixtures, glob));
}
const fixtures = path.join(__dirname, 'fixtures/');

var config = {
  fixturePath: fixturePath,
  fixtures: fixtures,
  fixtureOpts: {
    data: fixturePath('data/**/*.yaml'),
    docs: fixturePath('docs/**/*.md'),
    layouts: fixturePath('layouts/**/*.html'),
    pages: fixturePath('pages/**/*'),
    partials: fixturePath('partials/**/*.hbs'),
    patterns: fixturePath('patterns/**/*.html')
  }
};

module.exports = config;
