import { deepCollection } from '../../utils/object';

/**
 * Generate a local context for a pattern before it is rendered
 * Merge in data from its collection and bring the pattern's `data` properties
 * up to top level.
 *
 * @param {Object} pattern    The pattern object from drizzle data
 * @param {Object} drizzleData All drizzleData (global)
 * @return {Object} context object
 */
function patternContext (pattern, drizzleData) {
  const context = Object.assign({}, pattern);
  context.drizzle = drizzleData;
  // Bring anything in the `pattern.data` property up to top level
  if (typeof pattern.data === 'object') {
    for (const dataKey in pattern.data) {
      context[dataKey] = pattern.data[dataKey];
    }
    delete context.data;
  }
  // Get the collection for this pattern and add a reference to it
  context.collection = deepCollection(pattern.id, drizzleData.patterns);
  return context;
}

export default patternContext;
