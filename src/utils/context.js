import { deepCollection } from './object'; // TODO NOPE
import { resourcePath } from './shared';
import path from 'path';
import { pathSatisfies, is } from 'ramda';

function getBaseUrl (resource, drizzleData) {
  const options = drizzleData.options;
  const destRoot = options.dest.root;
  const destResource = options.dest[
    Object.keys(options.keys).find(
      key => options.keys[key].singular === resource.resourceType
    )
  ];

  const baseurl = path.relative(
    path.dirname(resourcePath(resource.id, destResource)),
    destRoot
  );

  return baseurl === '' ? `.${baseurl}` : baseurl;
}

function resourceContext (resource, drizzleData) {
  const context = Object.assign({}, resource);
  context.drizzle = drizzleData;

  if (pathSatisfies(is(String), ['dest', 'root'], drizzleData.options)) {
    context.baseurl = getBaseUrl(resource, drizzleData);
  }

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
