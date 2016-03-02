/* global describe, it */
var chai       = require('chai');
var expect     = chai.expect;
var Handlebars = require('handlebars');
var template = require('../dist/template');

describe ('template functions', () => {
  describe ('preparing templates', () => {
    describe ('preparing both helpers and partials', () => {
      it('should register appropriate helpers and partials', done => {
        template.prepareTemplates({ templates: {
          handlebars: Handlebars,
          helpers: `${__dirname}/fixtures/helpers/*.js`,
          partials: `${__dirname}/fixtures/partials/*`
        }}).then(handlebars => {
          expect(handlebars.partials).to.contain.keys('menu', 'header');
          expect(handlebars.helpers).to.contain.keys('toSlug', 'toJSON');
          done();
        });
      });
    });
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
          .then(registeredHelpers => {
            expect(registeredHelpers).to.contain.keys('toJSON',
              'toSlug', 'toFraction', 'random', 'toFixed', 'toTitle');
            done();
          });
      });

      it ('should accept an object with keyed helpers', done => {
        template.prepareHelpers(Handlebars,
            { toJSON: str => str })
          .then(registeredHelpers => {
            expect(registeredHelpers).to.contain.keys('toJSON');
            done();
          });
      });

      it ('should behave acceptably if no helpers are passed', done => {
        template.prepareHelpers(Handlebars)
          .then(registeredHelpers => {
            expect(registeredHelpers).to.be.ok;
            done();
          });
      });
    });

    describe('preparing partials', () => {
      it ('should accept a glob', done => {
        template.preparePartials(Handlebars, `${__dirname}/fixtures/partials/*`)
          .then(partials => {
            expect(partials).to.contain.keys('menu', 'header');
            done();
          });
      });
      it ('should behave acceptably if no partials passed', done => {
        template.preparePartials(Handlebars)
          .then(registeredPartials => {
            expect(registeredPartials).to.be.ok;
            done();
          });
      });
    });
  });
});
