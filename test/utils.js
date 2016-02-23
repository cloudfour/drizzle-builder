/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var utils = require('../dist/utils');
var path  = require('path');

describe ('utils', () => {
  describe('title casing', () => {
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
      var stringsOut = stringsIn.map(outStr => utils.toTitleCase(outStr));
      for (var i = 0; i < stringsOut.length; i++) {
        expect(stringsOut[i]).to.equal(stringsExpected[i]);
      }
    });
  });
  describe('reading files', () => {
    it ('should read files from a glob', done => {
      var glob = path.join(__dirname, 'fixtures/helpers/*.js');
      utils.readFiles(glob).then(allFileData => {
        expect(allFileData).to.have.length.of(3);
        expect(allFileData[0]).to.have.keys('path', 'contents');
        done();
      });
    });
  });
});
