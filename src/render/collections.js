import { resourceContext } from '../utils/context';
import { applyTemplate } from '../utils/render';
import { deepObj } from '../utils/object';
import { idKeys } from '../utils/shared';
import DrizzleError from '../utils/error';

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
  let layoutObj;
  try {
    // deepObj will throw if it fails, which is good and fine...
    layoutObj = deepObj(idKeys(layoutKey), drizzleData.templates, false);
  } catch (e) {
    // But Make this error more friendly and specific
    DrizzleError.error(new DrizzleError(
      `Could not find partial for default collection layout
'${layoutKey}'. Check 'options.layouts.collection' and/or
'options.src.templates' values to make sure they are OK`,
    DrizzleError.LEVELS.ERROR), drizzleData.options.debug);
  }
  patterns.collection.contents = applyTemplate(
    layoutObj.contents,
    resourceContext(patterns.collection, drizzleData),
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
