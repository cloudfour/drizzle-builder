import { titleCase } from '../../utils/shared';
import * as path from 'path';

/**
 * Remove anything in the `collection.hidden` array from
 * `patternKeys`
 * @param {Object} collection
 * @param {Array} patternKeys   All patternKeys
 * @return {Array} visible pattern keys
 */
function visiblePatterns (collection, patternKeys) {
  if (!collection.hidden) {
    return patternKeys;
  }
  if (!Array.isArray(collection.hidden)) {
    collection.hidden = [collection.hidden];
  }
  patternKeys = patternKeys.filter(patternKey => {
    return (collection.hidden.indexOf(patternKey) < 0);
  });
  return patternKeys;
}

/**
 * Create a `sortedItems` property on the collection, and sort patterns
 * either by default or as defined by the `order` property in metadata.
 *
 * @param {Object} collection     The collection object with patterns that need
 *                                sorting.
 * @return {Object} collection    `collection` will be mutated, also.
 */
function sortPatterns (collection) {
  let sortedKeys = collection.order || [];
  collection.patterns = [];
  sortedKeys = sortedKeys.concat(
    Object.keys(collection.items).filter(itemKey => {
      // Make sure all keys are accounted for
      return (sortedKeys.indexOf(itemKey) < 0);
    }));
  // Remove hidden patterns
  sortedKeys = visiblePatterns(collection, sortedKeys);
  sortedKeys.forEach(sortedKey => {
    collection.patterns.push(collection.items[sortedKey]);
  });
  return collection;
}

/**
 * Glom together an object representing a single collection, based on
 * any found `collection` YAML/JSON file and pre-existing stub data,
 * as well as defaults.
 *
 * @param {Array} collectionFiles  Any files returned by readFiles for the
 *                                 `collection` YAML/JSON glob. May be an
 *                                 empty Array if no files matched.
 * @param {patternData}            Pattern data at (and below) the level
 *                                 corresponding to this collection.
 * @return undefined               patternData is mutated in place.
 */
function parseCollection (collectionFiles, patternData) {
  // Default naming for collections uses the immediate parent dirname
  const collectionKey = patternData.collection.path.split(path.sep).pop() ||
    'patterns';
  patternData.collection = Object.assign(patternData.collection, {
    name: titleCase(collectionKey)
  });
  // If there is a collection YAML/JSON file...
  if (collectionFiles && collectionFiles.length) {
    patternData.collection = Object.assign(patternData.collection,
      collectionFiles[0].contents);
  }
  patternData.collection = sortPatterns(patternData.collection);
}

export default parseCollection;
