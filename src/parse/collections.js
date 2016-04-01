import * as utils from '../utils';
import Promise from 'bluebird';

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
      }));
    } else {
      return walkCollections(patternData[patternKey], options, filePromises);
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
