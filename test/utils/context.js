/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var utils = require('../../dist/utils/context');

describe('utils/context', () => {
  var fakeDrizzle = {
    patterns: {},
    pages: {},
    options: {},
    layouts: {}
  };
  var testObj = {
    name: 'My Name',
    data: {
      foo: 'bar',
      baz: 'ding'
    }
  };
  describe('resourceContext', () => {
    it('should move `data` properties up to top level', () => {
      var context = utils.resourceContext(testObj, fakeDrizzle);
      expect(context).not.to.contain.key('data');
      expect(context).to.contain.keys('foo', 'baz');
    });
    it('should put drizzleData reference in `drizzle`', () => {
      var context = utils.resourceContext(testObj, fakeDrizzle);
      expect(context).to.contain.key('drizzle');
    });
    it('should leave the resource object alone', () => {
      utils.resourceContext(testObj, fakeDrizzle);
      expect(testObj).to.contain.key('data');
      expect(testObj).not.to.contain.keys('foo', 'baz');
    });
  });
});
