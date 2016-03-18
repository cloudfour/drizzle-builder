/* global describe, it */
var chai       = require('chai');
var config     = require('./config');
var expect     = chai.expect;
var Handlebars = require('handlebars');
var template = require('../dist/template');

describe.skip ('templates', () => {
  var opts = {
    handlebars: Handlebars,
    helpers: config.fixturePath('helpers/*.js'),
    partials: config.fixturePath('partials/*')
  };
  describe('helpers and partials', () => {
    it ('should register correct helpers and partials', () => {
      return template.prepareTemplates(opts).then(handlebars => {
        expect(handlebars.partials).to.contain.keys('menu', 'header');
        expect(handlebars.helpers).to.contain.keys('toSlug', 'toJSON');
      });
    });

    describe ('helpers', () => {
      it ('should acept a string glob for helpers', () => {
        return template.prepareHelpers(Handlebars,
          config.fixturePath('helpers/*.js'))
          .then(registeredPartials => {
            expect(registeredPartials).to.contain.keys('toJSON', 'toSlug',
              'toFraction');
          });
      });
      it ('should accept an array glob for helpers', () => {
        return template.prepareHelpers(Handlebars,
            [config.fixturePath('helpers/*.js'),
             config.fixturePath('helpers/moar-helpers/*.js')])
          .then(registeredHelpers => {
            expect(registeredHelpers).to.contain.keys('toJSON',
              'toSlug', 'toFraction', 'random', 'toFixed', 'toTitle');
          });
      });
      it ('should accept an object with keyed helpers', () => {
        return template.prepareHelpers(Handlebars,
            { toJSON: str => str })
          .then(registeredHelpers => {
            expect(registeredHelpers).to.contain.keys('toJSON');
          });
      });

      it ('should behave acceptably if no helpers are passed', () => {
        return template.prepareHelpers(Handlebars)
          .then(registeredHelpers => {
            expect(registeredHelpers).to.be.ok;
          });
      });
    });
    describe ('partials', () => {
      it ('should accept a glob for partials', () => {
        template.preparePartials(Handlebars, config.fixturePath('partials/*'))
          .then(partials => {
            expect(partials).to.contain.keys('menu', 'header');
          });
      });
      it ('should behave acceptably if no partials passed', () => {
        template.preparePartials(Handlebars)
          .then(registeredPartials => {
            expect(registeredPartials).to.be.ok;
          });
      });
    });
  });
});
