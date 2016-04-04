/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var utils = require('../../dist/utils/shared');

describe ('utils/shared', () => {
  describe('keyname', () => {
    it ('should not strip leading numbers by default', () => {
      var result = utils.keyname('foo/01-bar.baz');
      expect(result).to.contain('01-'); // This is a change from previous
    });
    it ('should strip parent directories and extensions', () => {
      var result = utils.keyname('foo/01-bar.baz');
      expect(result).not.to.contain('foo');
      expect(result).not.to.contain('baz');
    });
  });
  describe('titleCase', () => {
    it ('should correctly title-case a string', () => {
      // @TODO move these into fixtures?
      var stringsIn = ['a-doctor and a horse',
        '4 horsemen of the apocalypse!',
        '52-and a half   with extra spaces',
        'YOU do not kNow w8t you r talking ab0oooot'
      ];
      var stringsExpected = ['A Doctor And A Horse',
        '4 Horsemen Of The Apocalypse!',
        '52 And A Half   With Extra Spaces',
        'You Do Not Know W8t You R Talking Ab0oooot'
      ];
      var stringsOut = stringsIn.map(outStr => utils.titleCase(outStr));
      for (var i = 0; i < stringsOut.length; i++) {
        expect(stringsOut[i]).to.equal(stringsExpected[i]);
      }
    });
  });
});
