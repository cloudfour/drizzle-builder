var chai = require('chai');
var expect = chai.expect;
var config = require('../config');
var prepare = require('../../dist/prepare');
var parse = require('../../dist/parse');
var render = require('../../dist/render');
var writePatterns = require('../../dist/write/collections');
var objectUtils = require('../../dist/utils/object');
var testUtils = require('../test-utils');
var path = require('path');

chai.use(require('chai-fs'));

describe('write/collections', () => {
  describe('writing normal collections', () => {
    var drizzleData;
    before(() => {
      return config
        .init(config.fixtureOpts)
        .then(prepare)
        .then(parse)
        .then(render)
        .then(writePatterns)
        .then(aData => {
          drizzleData = aData;
          return drizzleData;
        });
    });
    describe('determining output paths', () => {
      it('should write out the correct files', () => {
        // Console.log(Object.keys(objectUtils.flattenById(drizzleData.patterns)));
        // console.log(Object.keys(objectUtils.flattenById(drizzleData.pages)));
        const outPaths = [
          drizzleData.patterns.collection.outputPath,
          drizzleData.patterns.components.collection.outputPath,
          drizzleData.patterns.components.button.collection.outputPath
        ];
        return testUtils.areFiles(outPaths).then(result => {
          expect(result).to.be.true;
        });
      });
      it('should name the output collection files correctly', () => {
        var patterns = drizzleData.patterns;
        expect(patterns.components.collection.outputPath).to.contain(
          'components.html'
        );
        expect(patterns.components.button.collection.outputPath).to.contain(
          'button.html'
        );
        expect(patterns.collection.outputPath).to.contain('patterns.html');
      });
    });
  });
  describe('outputting to dest.patterns', () => {
    var drizzleData;
    before(() => {
      return config
        .init(config.fixtureOpts)
        .then(opts => {
          opts.dest.patterns = './test/dist/otherPatterns';
          return opts;
        })
        .then(prepare)
        .then(parse)
        .then(render)
        .then(writePatterns)
        .then(aData => {
          drizzleData = aData;
          return drizzleData;
        });
    });
    it('should prefix output paths', () => {
      var patterns = objectUtils.flattenById(drizzleData.patterns);
      for (var pKey in patterns) {
        if (pKey.indexOf('collection') === 0) {
          expect(patterns[pKey].outputPath).to.contain('otherPatterns');
        }
      }
    });
  });
  describe('deeply-nested collections and patterns', () => {
    var drizzleData;
    before(() => {
      return config
        .init(config.fixtureOpts)
        .then(opts => {
          opts.src.patterns = {
            glob: './test/fixtures/morePatterns/**/*.html',
            basedir: './test/fixtures/morePatterns'
          };
          // This is because there is a page in this default test options that
          // has a dependency on a pattern that isn't present in morePatterns
          opts.src.pages = {
            glob: './test/fixtures/morePages/**/*',
            basedir: './test/fixtures/morePages'
          };
          return opts;
        })
        .then(prepare)
        .then(parse)
        .then(render)
        .then(writePatterns)
        .then(aData => {
          drizzleData = aData;
          return drizzleData;
        });
    });
    it('should correctly nest collection pages', () => {
      var allPatterns = objectUtils.flattenById(drizzleData.patterns);
      expect(allPatterns['collections.one.one-one'].outputPath).to.contain(
        path.normalize('one/one-one.html')
      );
      expect(allPatterns['collections.one'].outputPath).to.have.basename(
        'one.html'
      );
      expect(allPatterns['collections.two'].outputPath).to.have.basename(
        'two.html'
      );
      expect(allPatterns['collections.two.two-one'].outputPath).to.contain(
        path.normalize('two/two-one.html')
      );
    });
  });
});
