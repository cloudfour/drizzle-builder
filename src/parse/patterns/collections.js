import parseCollection from './collection';
import { readFiles } from '../../utils/parse';

const COLLECTION_GLOB = '/collection.+(yaml|yml|json)';

/**
 * Recursively walk over the patternData object, looking for collection
 * objects and extending them with more data. See if there is a
 * `collection` YAML or JSON file in the directory associated with the
 * collection. Use that to extend collection info, if so, including
 * ordering and hidden patterns.
 * @see collection.js
 * @param {Object} patternData  Pattern data at the level we're looking
 *                              (will be a different depth depending on
 *                               where we are recursively).
 * @param {Object} options
 * @param {Array} of {Promises} filePromises. Starts out undefined but
 *                              each time we try to look for collection
 *                              YAML/JSON data, another promise gets pushed.
 *                              Ultimately, all file promises will be returned
 *                              and when they are all resolved, we are done.
 */
function walkCollections (patternData, options, filePromises = []) {
  for (const patternKey in patternData) {
    if (patternKey === 'collection') {
      const glob = patternData.collection.path + COLLECTION_GLOB;
      filePromises.push(readFiles(glob, options).then(collectionFiles => {
        parseCollection(collectionFiles, patternData);
      }));
    } else {
      // Recurse down.
      walkCollections(patternData[patternKey], options, filePromises);
    }
  }
  return filePromises;
}

/**
 * Walk over `patternData` and extend the collection items with metadata
 *
 * @param {Object} patternData  The partially-populated pattern data object
 *                              to extend.
 * @param {Object} options
 * @return {Promise} resolving to all, extended patternData
 */
function parseCollections (patternData, options) {
  return Promise.all(walkCollections(patternData, options))
    .then(() => patternData);
}

export default parseCollections;
