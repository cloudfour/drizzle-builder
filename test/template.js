/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var Handlebars = require('handlebars');
var template = require('../dist/template');


describe ('template functions', () => {
  describe ('preparing templates', () => {
    describe ('preparing helpers', () => {
      it ('should accept a string glob for helpers', done => {
        template.prepareHelpers(Handlebars,
            `${__dirname}/fixtures/helpers/*.js`)
          .then(registeredPartials => {
            expect(registeredPartials).to.contain.keys('toJSON',
              'toSlug', 'toFraction');
            done();
          });
      });

      it ('should accept an array glob for helpers', done => {
        template.prepareHelpers(Handlebars,
            [`${__dirname}/fixtures/helpers/*.js`,
             `${__dirname}/fixtures/helpers/moar-helpers/*.js`])
          .then(registeredPartials => {
            expect(registeredPartials).to.contain.keys('toJSON',
              'toSlug', 'toFraction', 'random', 'toFixed', 'toTitle');
            done();
          });
      });

      it ('should accept an object with keyed helpers', done => {
        template.prepareHelpers(Handlebars,
            { toJSON: str => str })
          .then(registeredPartials => {
            expect(registeredPartials).to.contain.keys('toJSON');
            done();
          });
      });
    });
  });
});
