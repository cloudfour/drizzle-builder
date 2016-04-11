import { deepCollection } from './object'; // TODO NOPE

function resourceContext (resource, drizzleData) {
  const context = Object.assign({}, resource);
  context.drizzle = drizzleData;
  if (typeof resource.data === 'object') {
    Object.keys(resource.data).map(dataKey =>
      context[dataKey] = resource.data[dataKey]);
    delete context.data;
  }
  return context;
}

/**
 */
function patternContext (pattern, drizzleData) {
  const context = resourceContext(pattern, drizzleData);
  // Get the collection for this pattern and add a reference to it
  context.collection = deepCollection(pattern.id, drizzleData.patterns);
  return context;
}

export { patternContext, resourceContext };
