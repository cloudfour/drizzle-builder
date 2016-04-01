import path from 'path';
import { write } from './utils';

/**
 * Figure out the output path for `page` and write it to the filesystem.
 * @TODO options.keys is still dumb
 * @TODO hard-coded `.html` OK?
 *
 * @param {Object} collection         Will be mutated
 * @param {Object} drizzleData
 * @param {Array} entryKeys           path components
 * @return {Promise} for file write
 */
function writePatternCollection (patterns, drizzleData, entryKeys) {
  const collectionName = entryKeys.pop();
  const outputPath = path.join(entryKeys.join(path.sep),
    `${collectionName}.html`);
  const fullPath = path.normalize(path.join(
    drizzleData.options.dest,
    drizzleData.options.destPaths.patterns,
    outputPath));
  patterns.collection.outputPath = fullPath;
  return write(fullPath, patterns.collection.contents);
}

/**
 * Traverse pages object and write out any page objects to files. An object
 * is considered a page if it has a `contents` property.
 *
 * @param {Object} pages   current level of pages tree
 * @param {Object} drizzleData
 * @param {String} currentKey  This is a bit inelegant, but we need to keep
 *                             track of the current object's key in the owning
 *                             object because it will be part of the filename(s)
 * @param {Array} writePromises All write promises so far
 * @return {Array} of Promises
 */
function walkPatterns (patterns, drizzleData,
  currentKeys = [], writePromises = []) {
  if (patterns.collection) {
    writePromises.push(
      writePatternCollection(patterns, drizzleData, currentKeys));
  }
  for (const patternKey in patterns) {
    // TODO Better test following
    if (patternKey !== 'items' && patternKey !== 'collection') {
      currentKeys.push(patternKey);
      walkPatterns(patterns[patternKey],
        drizzleData, currentKeys, writePromises);
      currentKeys.pop();
    }
  }
  return writePromises;
}

/**
 * TODO: Comment, etc.
 */
function writePatterns (drizzleData) {
  return Promise.all(walkPatterns(drizzleData.patterns, drizzleData))
    .then(writePromises => {
      return drizzleData;
    });
}

export default writePatterns;
