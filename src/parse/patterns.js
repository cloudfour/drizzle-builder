/**
 * @module parse/patterns
 */
import { resourceId, resourceKey } from '../utils/object';
import { readFiles, readFileTree } from '../utils/parse';
import { titleCase } from '../utils/shared';
import path from 'path';

import DrizzleError from '../utils/error';

const isPattern = obj => obj.hasOwnProperty('path');
const collectionPath = itms => path.dirname(itms[Object.keys(itms).pop()].path);
const collectionKey = itms => collectionPath(itms).split(path.sep).pop();

/**
 * Should this pattern be hidden per collection or pattern metadata?
 * @param {Object} collection   Collection obj
 * @param {Object} pattern      Pattern obj
 * @param {String} patternKey
 * @return {Boolean}
 */
function isHidden (collection, pattern, patternKey) {
  return ((collection.hidden && collection.hidden.indexOf(patternKey) !== -1) ||
    (pattern.data && pattern.data.hidden));
}

/**
 * Is the obj a collection?
 * @param {Object} obj
 * @return {Boolean}
 */
function isCollection (obj) {
  if (isPattern(obj)) { return false; }
  return Object.keys(obj).some(childKey => isPattern(obj[childKey]));
}

/**
 * Construct a glob to look for collection metadata.
 * @param {Object} items  All the patterns
 * @return {String} glob
 */
function collectionGlob (items) {
  return path.join(collectionPath(items), 'collection.+(yml|yaml|json)');
}

/**
 * Do any of the patterns in this collection have ordering information in their
 * front matter?
 *
 * @param itms      Patterns in the collection
 * @return {Boolean}
 */
const hasPatternOrdering = itms => {
  return Object.keys(itms).some(itm => {
    return (itms[itm].data && itms[itm].data.hasOwnProperty('order'));
  });
};

/**
 * Flesh out an individual pattern object.
 *
 * @param {Object} patternObj
 * @param {Object} options
 * @return {Object} built-out pattern
 */
function buildPattern (patternObj, options) {
  const patternFile = { path: patternObj.path };
  return Object.assign(patternObj, {
    id: resourceId(patternFile, options.src.patterns.basedir, 'patterns'),
    name: (patternObj.data && patternObj.data.name) ||
      titleCase(resourceKey(patternFile))
  });
}

/**
 * Flesh out all of the patterns that are within `collectionObj`. This is
 * before any of these patterns get assigned to `items` or `patterns` on
 * `collectionObj.collection`.
 *
 * @param {Object} collectionObj  The containing object with pattern children
 *                                that will ultimately be managed under
 *                                collectionObj.collection (items and patterns)
 * @param {Object} options
 * @return {Object} patterns      Built-out pattern objects
 */
function buildPatterns (collectionObj, options) {
  const patterns = {};
  for (const childKey in collectionObj) {
    if (isPattern(collectionObj[childKey])) {
      patterns[childKey] = buildPattern(collectionObj[childKey], options);
      delete collectionObj[childKey];
    }
  }
  return patterns;
}

/**
 * Transform the `collection`'s `items` (all patterns, unordered) into
 * an {Array} of ordered, visible patterns that should be rendered as part
 * of this collection. Check both individual pattern files and collection
 * metadata for ordering information, as well as information about hidden
 * patterns.
 *
 * @param {Object} collection
 * @return {Array} patterns            Ordered, visible patterns
 */
function buildOrderedPatterns (collection) {
  let sortedKeys;
  if (hasPatternOrdering(collection.items)) {
    sortedKeys = Object.keys(collection.items).sort((keyA, keyB) => {
      const orderA = collection.items[keyA].data.order || 10000;
      const orderB = collection.items[keyB].data.order || 10000;
      return orderA - orderB;
    });
  } else {
    sortedKeys = collection.order || [];
  }
  const patterns = [];
  sortedKeys = sortedKeys.concat(
    Object.keys(collection.items).filter(itemKey => {
      // Make sure all keys are accounted for
      return (sortedKeys.indexOf(itemKey) < 0);
    })
  );
  sortedKeys.forEach(sortedKey => {
    if (!isHidden(collection, collection.items[sortedKey], sortedKey)) {
      patterns.push(collection.items[sortedKey]);
    }
  });
  return patterns;
}

/**
 * Build an individual collection object. Give it some metadata based on
 * defaults and any metadata file found in its path. Build the Array of
 * patterns that should appear on this pattern collection's page.
 *
 * @param {Object} collectionObj  The containing object that holds the patterns
 *                                that are part of this collection.
 * @param {Object} options
 * @return {Promise} resolving to {Object} representing the containing object
 *                                for this collection (as distinct from
 *                                collectionObj.collection, which is what this
 *                                function tacks on).
 */
function buildCollection (collectionObj, options) {
  const items = buildPatterns (collectionObj, options);
  return readFiles(collectionGlob(items), options).then(collData => {
    const collectionMeta = (collData.length) ? collData[0].contents : {};
    collectionObj.collection = Object.assign ({
      items: items,
      name: titleCase(collectionKey(items))
    }, collectionMeta);
    collectionObj.collection.patterns = buildOrderedPatterns(
      collectionObj.collection);
    return collectionObj;
  });
}

/**
 * Traverse and build collections data and their contained patterns based on
 * parsed pattern data.
 *
 * @param {Object} patternObj  Patterns at the current level of traverse.
 * @param {Object} options
 * @param {Array} collectionPromises Array of `{Promise}`s representing
 *                             reading collection metadata
 */
function buildCollections (patternObj, options, collectionPromises = []) {
  if (isPattern(patternObj)) { return collectionPromises; }
  if (isCollection(patternObj)) {
    collectionPromises.push(buildCollection (patternObj, options));
  }
  for (const patternKey in patternObj) {
    if (patternKey !== 'collection') {
      buildCollections (patternObj[patternKey], options, collectionPromises);
    }
  }
  return collectionPromises;
}

/**
 * Parse pattern files and then flesh out individual pattern objects and
 * build collection data.
 *
 * @param {Object} options
 * @return {Promise} resolving to pattern/collection data
 */
function parsePatterns (options) {
  return readFileTree(options.src.patterns, options).then(patternObj => {
    return Promise.all(buildCollections(patternObj, options))
      .then(() => patternObj,
            error => DrizzleError.error(error, options.debug));
  });
}

export default parsePatterns;
