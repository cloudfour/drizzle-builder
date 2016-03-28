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
function writePattern (collection, drizzleData, entryKeys) {
  const fileKey = entryKeys.pop();
  const outputPath = path.join(entryKeys.join(path.sep), fileKey + '.html');
  const fullPath = path.normalize(path.join(
    drizzleData.options.dest,
    drizzleData.options.destPaths.patterns,
    outputPath));
  collection.outputPath = fullPath;
  return write(fullPath, collection.contents);
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
  if (patterns.contents) {
    return writePattern(patterns, drizzleData, currentKeys);
  }
  for (const patternKey in patterns) {
    currentKeys.push(patternKey);
    writePromises = writePromises.concat(
      walkPatterns(patterns[patternKey],
        drizzleData, currentKeys, writePromises));
  }
  return writePromises;
}

/**
 * TODO: Comment, etc.
 */
function writePatterns (drizzleData) {
  return Promise.all(walkPatterns(drizzleData.patterns, drizzleData))
    .then(() => {
      return drizzleData;
    });
}

export default writePatterns;
