/* global describe, it */
var assert = require('assert');
var builder = require('../dist/');
var defaults = require('../dist/').defaults;

describe ('drizzle-build', () => {
  describe ('configuration', () => {
    it ('should derive correct defaults', () => {
      assert.equal(1, 1);
      console.log(defaults);
      console.log(builder);
    });
  });
});
