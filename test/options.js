/* global describe, it, before */
var assert = require('assert');
var parseOptions = require('../dist/options');

describe ('drizzle-builder', () => {
  describe ('options', () => {
    describe ('translating options from fabricator', () => {
      var opts;
      before (() => {
        var options = {
          layoutIncludes: [
            'src/views/layouts/includes/*',
            'src/views/sandbox/includes/*' ],
        };
        opts = parseOptions(options);
      });

      it ('should translate old option keys', () => {
        assert(typeof opts.layoutIncludes === 'undefined');
        assert(typeof opts.templates === 'object');
        assert(opts.templates.partials.length);
      });
    });
  });
});
