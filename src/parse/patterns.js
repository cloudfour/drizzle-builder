import * as utils from '../utils';
import * as parseUtils from './utils';

/**
 *
 */
function parsePatterns (options) {
  const patternData = {};
  return utils.readFiles(options.src.patterns, options).then(fileData => {
    const relativeRoot = utils.commonRoot(fileData);
    fileData.forEach(patternFile => {
      const pathBits = utils.relativePathArray(
        patternFile.path,
        relativeRoot);

      // TODO `patterns` name should be an option, not hard-coded
      // TODO All this collection munging should be broken out
      const collectionKey = (pathBits.length && pathBits.length > 0) ?
        pathBits[pathBits.length - 1] : 'patterns';
      // Retrieve the correct object reference where we should put this
      // pattern. This represents the "collection" containing this pattern.
      const collectionEntry = utils.deepObj(pathBits, patternData);

      // The entry returned represents the collection to which patternFile
      // belongs. Make sure the collection metadata is present.
      // TODO: This is the place to look for collection overrides, maybe?
      collectionEntry.collection = collectionEntry.collection || {
        items: {},
        name: utils.titleCase(collectionKey) // TODO Allow override
      };

      // TODO This is the place to assert ordering
      // Each pattern is added to the `items` object of its parent collection
      collectionEntry
        .collection
        .items[utils.resourceKey(patternFile)] = parseUtils.parseLocalData(
          patternFile,
          options,
          {
            id: utils.resourceId(patternFile, relativeRoot, 'patterns'),
            name: utils.titleCase(utils.keyname(patternFile.path))
          }
      );
    });
    return patternData;
  });
}

export default parsePatterns;
