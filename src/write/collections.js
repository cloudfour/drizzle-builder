import { writePage } from '../utils/write';
import DrizzleError from '../utils/error';

const hasCollection = patterns => patterns.hasOwnProperty('collection');
const isCollection = patterns => patterns.hasOwnProperty('items');

/**
 * Traverse patterns object and write out any collection objects to files.
 *
 * @param {Object} pages   current level of pages tree
 * @param {Object} drizzleData
 * @param {Array} writePromises All write promises so far
 * @return {Array} of Promises
 */
function walkCollections (patterns, drizzleData, writePromises = []) {
  if (hasCollection(patterns)) {
    writePromises.push(writePage(patterns.collection.id, patterns.collection,
      drizzleData.options.dest.patterns,
      drizzleData.options.keys.collections.plural));
  }
  for (const patternKey in patterns) {
    if (!isCollection(patterns[patternKey])) {
      walkCollections(patterns[patternKey],
        drizzleData, writePromises);
    }
  }
  return writePromises;
}

/**
 * Traverse the patterns object and write out collections HTML pages.
 *
 * @param {Object} drizzleData
 * @return {Promise} resolving to {Object} drizzleData
 */
function writeCollections (drizzleData) {
  return Promise.all(walkCollections(
    drizzleData.patterns,
    drizzleData)
  ).then(writePromises => drizzleData,
         error => DrizzleError.error(error, drizzleData.options.debug));
}

export default writeCollections;
