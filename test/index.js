/* global describe, it */
var assert = require('assert');
var builder = require('../dist/');

describe ('drizzle-builder', () => {
  describe ('configuration', () => {
    it ('should derive correct defaults', done => {
      builder({}).then(options => {
        console.log(options);
        assert(typeof options.templates === 'object');
        done();
      });
    });
  });
});
