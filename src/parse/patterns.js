import * as utils from '../utils';
import path from 'path';
import parseCollections from './collections';

/**
 * Parse collection information for the pattern in `patternFile`. Resolve
 * to the `items` object in the owning collection so that the pattern data
 * may be inserted there.
 */
function initCollection (patternFile, patternData, relativeRoot, options) {
  const pathBits = utils.relativePathArray(
    patternFile.path,
    relativeRoot);

  const collectionEntry = utils.deepObj(pathBits, patternData);
  const collectionKey = (pathBits.length && pathBits.length > 0) ?
    pathBits[pathBits.length - 1] : 'patterns';

  collectionEntry.collection = collectionEntry.collection || {
    items: {},
    name: utils.titleCase(collectionKey), // TODO Allow override
    path: path.dirname(patternFile.path)
  };
  return collectionEntry.collection.items;
}

/**
 * `name` is a specially-recognized key in the pattern
 * that can override naming by filename
 *
 * @param {Object} patternFile
 * @return {String}
 */
function patternName (patternFile) {
  return ((patternFile.data && patternFile.data.name) ||
    utils.titleCase(utils.keyname(patternFile.path)));
}

/**
 * Parse all patterns file. For each pattern, make sure its collection
 * is initialized (parsed) and add pattern data to the collection's items
 * object.
 */
function parsePatterns (options) {
  const patternData = {};
  // First, read pattern files...
  return utils.readFiles(options.src.patterns, options).then(fileData => {
    const relativeRoot = utils.commonRoot(fileData);

    fileData.forEach(patternFile => {
      const collectionItemEntry = initCollection(
        patternFile, patternData, relativeRoot, options);

      collectionItemEntry[utils.resourceKey(patternFile)] = Object.assign(
        patternFile,
        {
          id: utils.resourceId(patternFile, relativeRoot, 'patterns'),
          name: patternName(patternFile)
        }
      );
    });
    return patternData;
  }).then(patternData => {
    return parseCollections(patternData, options);
  });
}

export default parsePatterns;
