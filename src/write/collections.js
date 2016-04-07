import { writeResource } from '../utils/write';

/**
 * Traverse patterns object and write out any collection objects to files.
 *
 * @param {Object} pages   current level of pages tree
 * @param {Object} drizzleData
 * @param {Array} entryKeys  Array of path elements leading to this collection
 * @param {Array} writePromises All write promises so far
 * @return {Array} of Promises
 */
function walkCollections (patterns, drizzleData,
  entryKeys = [], writePromises = []) {
  if (patterns.collection) {
    writePromises.push(
      writeResource(entryKeys, patterns.collection,
        drizzleData.options.dest.patterns));
  }
  for (const patternKey in patterns) {
    // TODO Better test following
    if (patternKey !== 'items' && patternKey !== 'collection') {
      entryKeys.push(patternKey);
      walkCollections(patterns[patternKey],
        drizzleData, entryKeys, writePromises);
      entryKeys.pop();
    }
  }
  return writePromises;
}

/**
 * Traverse the patterns object and write out collections.
 *
 * @param {Object} drizzleData
 * @return {Promise} resolving to {Object} drizzleData
 */
function writeCollections (drizzleData) {
  return Promise.all(walkCollections(
    drizzleData.patterns,
    drizzleData,
    [drizzleData.options.src.patterns.basedir])
  ).then(writePromises => drizzleData);
}

export default writeCollections;
