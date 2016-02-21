/* global describe, it */
var assert = require('assert');
var builder = require('../dist/');

describe ('drizzle-builder', () => {
  describe ('configuration', () => {
    it ('should derive correct defaults', done => {
      builder({}).then(options => {
        assert(options.materials.length === 1);
        done();
      });
    });
  });
});
