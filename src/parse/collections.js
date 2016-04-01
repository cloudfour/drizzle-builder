import * as utils from '../utils';
import Promise from 'bluebird';

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
}

/**
 * Walk the pattern tree and extend collections with more metatdata.
 */
function walkCollections (patternData, options, filePromises = []) {
  for (const patternKey in patternData) {
    if (patternKey === 'collection') {
      // TODO Should this be some sort of option?
      const glob = patternData.collection.path + '/collection.+(yaml|yml|json)';
      filePromises.push(utils.readFiles(glob, options).then(metadata => {
        if (metadata && metadata.length) {
          // Extend collection data with data from file (first match)
          patternData.collection = Object.assign(patternData.collection,
            metadata[0].contents);
        }
        sortPatterns(patternData.collection);
      }));
    } else {
      walkCollections(patternData[patternKey], options, filePromises);
    }
  }
  return filePromises;
}

/**
 * Extend the `collection` objects in `drizzleData.patterns` with (optional)
 * metadata from `collection` files.
 */
function parseCollections (patternData, options) {
  return Promise.all(walkCollections(patternData, options))
    .then(() => {
      return patternData;
    });
}

export default parseCollections;
