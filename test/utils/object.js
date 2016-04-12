/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
//var config = require('./config');
var utils = require('../../dist/utils/object');
var DrizzleError = require('../../dist/utils/error');

describe.only ('utils/object', () => {
  describe('deepCollection', () => {
    it ('should return deep collection', () => {
      var patternsObj = {
        components : {
          button: {
            collection: {
              name: 'Ding',
              items: {
                foo: {
                  bar: 'baz'
                }
              }
            }
          }
        }
      };
      var patternId = 'patterns.components.button.foo';
      var reference = utils.deepCollection(patternId, patternsObj);
      expect(reference).to.be.an('object').and.to.contain.keys('name', 'items');
    });
    it ('should throw if collection path non-extant', () => {
      const obj = {foo : {}};
      expect(utils.deepCollection.bind(
        utils, 'foo.bar.baz', obj, false)).to.throw(DrizzleError);
    });
  });
  describe('deepObj', () => {
    it ('should return deep object and create paths', () => {
      const obj = {};
      const reference = utils.deepObj(['foo', 'bar', 'baz'], obj);
      expect(reference).to.be.an('object');
      expect(obj.foo.bar.baz).to.equal(reference);
    });
    it ('should not create paths when indicated', () => {
      const obj = {foo : {}};
      expect(utils.deepObj.bind(
        utils, ['foo', 'bar', 'baz'], obj, false)).to.throw(DrizzleError);
    });
  });
  describe('deepPattern', () => {
    it ('should return deep object', () => {
      var patternsObj = {
        components : {
          button: {
            collection: {
              items: {
                foo: {
                  bar: 'baz'
                }
              }
            }
          }
        }
      };
      var patternId = 'patterns.components.button.foo';
      var reference = utils.deepPattern(patternId, patternsObj);
      expect(reference).to.be.an('object').and.to.contain.key('bar');
    });
    it ('should throw if pattern path non-extant', () => {
      const obj = {foo : {}};
      expect(utils.deepPattern.bind(
        utils, 'foo.bar.baz', obj, false)).to.throw(DrizzleError);
    });
  });

  describe('resourceId', () => {
    it ('should generate a prefixed resourceId', () => {
      var pseudoFile = { path: '/foo/bar/baz/ding/dong.txt' };
      var pseudoRoot = '/foo/bar/baz';
      var resourceId = utils.resourceId(pseudoFile, pseudoRoot, 'pattern');
      expect(resourceId).to.equal('pattern.ding.dong');
    });
    it ('should no longer remove special characters from IDs', () => {
      var pseudoFile = { path: '/foo/bar/baz/03-ding/04-dong.txt' };
      var pseudoRoot = '/foo/bar/baz';
      var resourceId = utils.resourceId(pseudoFile, pseudoRoot, 'patterns');
      expect(resourceId).to.equal('patterns.03-ding.04-dong');
    });
  });
  describe('resourceKey', () => {
    it ('should generate the right key for a file', () => {
      var resourceKey = utils.resourceKey(
        { path: '/foo/bar/baz/05-dingle.txt' }
      );
      expect(resourceKey).to.equal('05-dingle');
    });
  });
});
