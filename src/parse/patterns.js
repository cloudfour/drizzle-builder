import path from 'path';
import parseCollections from './collections';
import { keyname, titleCase } from '../utils/shared';
import { deepObj, resourceId, resourceKey } from '../utils/object';
import { commonRoot, relativePathArray } from '../utils/path';
import { readFiles } from '../utils/parse';

/**
 * Parse collection information for the pattern in `patternFile`. Resolve
 * to the `items` object in the owning collection so that the pattern data
 * may be inserted there. Return that reference.
 *
 * @param {Object} patternFile  The file object with info about this pattern
 * @param {Object} patternData  Reference to all parsed pattern data
 * @param {String} relativeRoot Relative "root" path for patterns
 * @param {Object} options
 * @return {Object} reference to the owning collection's `items` object
 */
function initCollection (patternFile, patternData, relativeRoot, options) {
  const pathBits = relativePathArray(
    patternFile.path,
    relativeRoot);

  const collectionEntry = deepObj(pathBits, patternData);
  const collectionKey = (pathBits.length && pathBits.length > 0) ?
    pathBits[pathBits.length - 1] : 'patterns';

  collectionEntry.collection = collectionEntry.collection || {
    items: {},
    name: titleCase(collectionKey),
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
    titleCase(keyname(patternFile.path)));
}

/**
 * Parse all patterns files. Make sure a collection exists for the pattern and
 * Add pattern data to the collection's items
 * object.
 * @param {Object} options
 * @return {Promise} resolving to all pattern data
 */
function parsePatterns (options) {
  const patternData = {};
  // First, read pattern files...
  return readFiles(options.src.patterns, options).then(fileData => {
    const relativeRoot = commonRoot(fileData);

    fileData.forEach(patternFile => {
      const collectionItemEntry = initCollection(
        patternFile, patternData, relativeRoot, options);

      collectionItemEntry[resourceKey(patternFile)] = Object.assign(
        patternFile,
        {
          id: resourceId(patternFile, relativeRoot, 'patterns'),
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
