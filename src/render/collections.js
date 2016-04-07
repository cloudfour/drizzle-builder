import collectionContext from './context/collection';
import { applyTemplate } from '../utils/render';

/**
 * For any given `patterns` entry, render a pattern-collection page for
 * its `items`. Also, remove the `contents` property for individual patterns.
 * Patterns will not render individual pages. This function mutates `patterns`.
 *
 * @param {Object} patterns      The current level of the patterns tree we're
 *                               rendering
 * @param {Object} drizzleData   All the data we have, including `options`
 * @param {String} collectionKey The key of the current set of `patterns`.
 *                               Used to derive the collection's "name"
 * @return {Object}              patterns data at this level.
 */
function renderCollection (patterns, drizzleData, collectionKey) {
  const layoutKey = drizzleData.options.layouts.collection;
  patterns.collection.contents = applyTemplate(
    drizzleData.layouts[layoutKey].contents, // TODO error-checking
    collectionContext(patterns.collection, drizzleData),
    drizzleData.options);
  return patterns;
}

/**
 * Recursively walk through the patterns data object and render content
 * for "pattern collections" (any entry in `patterns` that contains an
 * `items` property).
 *
 * @param {Object} patterns     The current level of the `patterns` object.
 * @param {Object} drizzleData
 * @param {String} currentKey   The key for the current `patterns` object.
 * @return {Object} drizzleData All drizzleData
 */
function walkCollections (patterns, drizzleData, currentKey = 'patterns') {
  for (const patternKey in patterns) {
    if (patternKey === 'collection') {
      renderCollection(patterns, drizzleData, currentKey);
    } else {
      walkCollections(patterns[patternKey], drizzleData, patternKey);
    }
  }
  return drizzleData.patterns;
}

/**
 * Render pattern collections.
 * @param {Object} drizzleData
 * @return {Object} patterns data
 */
function renderCollections (drizzleData) {
  return walkCollections(drizzleData.patterns, drizzleData);
}

export default renderCollections;
