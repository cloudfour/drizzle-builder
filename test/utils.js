/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
var config = require('./config');
var path = require('path');
var utils = require('../dist/utils');

describe ('utils', () => {
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
  describe('getFiles', () => {
    it ('should retrieve a file list from a glob', () => {
      var glob = config.fixturePath('helpers/**/*');
      return utils.getFiles(glob).then(fileList => {
        expect(Array.isArray(fileList)).to.be.true;
        fileList.map(filePath => {
          // Ham-fisted test that everything is a file, not a directory
          expect(filePath).to.contain('.');
        });
      });
    });
    it ('should should respect glob options', () => {
      var glob = config.fixturePath('helpers/**/*');
      return utils.getFiles(glob, { nodir: false }).then(fileList => {
        // This fileList should contain at least one directory
        expect(Array.isArray(fileList)).to.be.true;
        expect(fileList.filter(listEntry => {
          return path.extname(listEntry).length === 0;
        })).to.have.length.of.at.least(1);

      });
    });
  });
  describe('getDirs', () => {
    it ('should only return directories', () => {
      return utils.getDirs(config.fixturePath('helpers/**/*.js'))
        .then(dirs => {
          dirs.forEach(dir => {
            expect(path.extname(dir)).to.be.empty;
            // And should not contain immediate parent
            expect(path.basename(dir)).not.to.equal('helpers');
          });
        });
    });
  });
  describe('isGlob', () => {
    it ('should correctly identify valid glob patterns', () => {
      var goodGlobs = [
        config.fixturePath('helpers/**/*'),
        ['foo', 'bar', 'baz'],
        [config.fixturePath('helpers/**/*'), 'foo'],
        'just a string'
      ];
      var badGlobs = [
        5,
        { foo: 'bar', baz: 'boof'},
        ['foo', 'bar', 5],
        '',
        []
      ];
      expect(goodGlobs.every(glob => utils.isGlob(glob))).to.be.true;
      expect(badGlobs.every(glob => utils.isGlob(glob))).to.be.false;
    });
  });
  describe('keyname', () => {
    it ('should strip leading numbers by default', () => {
      var result = utils.keyname('foo/01-bar.baz');
      expect(result).to.contain('01-'); // This is a change from previous
    });
    it ('should strip parent directories and extensions', () => {
      var result = utils.keyname('foo/01-bar.baz');
      expect(result).not.to.contain('foo');
      expect(result).not.to.contain('baz');
    });
    it ('should accept option to retain leading numbers', () => {
      var result = utils.keyname('foo/01-bar.baz', { stripNumbers: false });
      expect(result).to.contain('01-');
    });
  });
  describe('matchParser', () => {
    it ('should return a default parser function', () => {
      var parser = utils.matchParser('/foo/bar/baz.txt');
      expect(parser).to.be.a('function');
    });
    it ('should accept a default parser function', () => {
      var defaultParsers = {
        default: {
          pattern: /.*/,
          parseFn: (contents, filepath) => 'foo'
        }
      };
      var parser = utils.matchParser('/foo/bar/baz.txt', defaultParsers);
      expect(parser).to.be.a('function');
      expect(parser('ding')).to.equal('foo');
    });
  });
  describe('readFiles', () => {
    var parsers = {
      default: {
        parseFn: (contents, filepath) => 'foo'
      }
    };
    it ('should read files from a glob', () => {
      var glob = config.fixturePath('helpers/*.js');
      return utils.readFiles(glob).then(allFileData => {
        expect(allFileData).to.have.length.of(3);
        expect(allFileData[0]).to.have.keys('path', 'contents');
      });
    });
    it ('should run passed function over content', () => {
      var glob = config.fixturePath('helpers/*.js');
      return utils.readFiles(glob, { parsers })
        .then(allFileData => {
          expect(allFileData).to.have.length.of(3);
          expect(allFileData[0].contents).to.equal('foo');
        });
    });
    it ('should respect passed glob options', () => {
      var glob = config.fixturePath('files/*');
      // Include dotfiles
      return utils.readFiles(glob, {
        parsers: parsers,
        globOpts: { dot: true }
      })
        .then(allFileData => {
          expect(allFileData).to.have.length(2);
        });
    });
  });
  describe('readFilesKeyed', () => {
    var parsers = {
      default: {
        parseFn: (contents, filepath) => 'foo'
      }
    };
    it ('should be able to key files by keyname', () => {
      var glob = config.fixturePath('helpers/*.js');
      return utils.readFilesKeyed(glob).then(allFileData => {
        expect(allFileData).to.be.an('object');
        expect(allFileData).to.contain.keys('toFraction', 'toJSON', 'toSlug');
      });
    });
    it ('should accept an option to preserve leading numbers', () => {
      var glob = config.fixturePath('data/*.yaml');
      return utils.readFilesKeyed(glob, { stripNumbers: false })
        .then(allFileData => {
          expect(allFileData).to.be.an('object');
        });
    });
    it ('should accept a function to derive keys', () => {
      var glob = config.fixturePath('data/*.yaml');
      return utils.readFilesKeyed(glob,
        { keyFn: (path, options) => 'foo' + path })
          .then(allFileData => {
            expect(Object.keys(allFileData)[0]).to.contain('foo');
          });
    });
    it ('should pass contentFn through to readFiles', () => {
      var glob = config.fixturePath('data/*.yaml');
      return utils.readFilesKeyed(glob, {
        keyFn: (path, options) => 'foo' + path,
        parsers: parsers
      }).then(allFileData => {
        for (var fileKey in allFileData) {
          expect(fileKey).to.contain('foo');
          expect(allFileData[fileKey].contents).to.equal('foo');
        }
      });
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
  describe('dirname functions', () => {
    describe('parentDirname', () => {
      it ('should derive correct parent dirname', () => {
        var file = config.fixturePath('helpers/toFraction.js');
        var parent = utils.parentDirname(file);
        expect(parent).to.equal('fixtures');
      });
    });
    describe('localDirname', () => {
      it ('should derive correct immediate dirname', () => {
        var file = config.fixturePath('helpers/toFraction.js');
        var parent = utils.localDirname(file);
        expect(parent).to.equal('helpers');
      });
    });
  });
});
