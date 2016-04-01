import { deepCollection } from '../../utils/object';

/**
 * Generate a local context for a pattern before it is rendered
 * Merge in data from its collection and bring its `data` properties
 * up to top level.
 */
function patternContext (pattern, drizzleData) {
  const context = Object.assign({}, pattern);
  context.drizzle = drizzleData;
  if (typeof pattern.data === 'object') {
    for (const dataKey in pattern.data) {
      context[dataKey] = pattern.data[dataKey];
    }
    delete context.data;
  }
  context.collection = deepCollection(pattern.id, drizzleData.patterns);
  return context;
}

export default patternContext;
