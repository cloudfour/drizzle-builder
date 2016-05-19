import { deepCollection } from './object'; // TODO NOPE
import { resourcePath } from './shared';
import path from 'path';
import { pathSatisfies, is } from 'ramda';

/**
 * This will return a relative URL prefix for a given resource (anything being
 * output to an HTML file).
 *
 * The purpose of this to value is to be assigned to the `{{baseurl}}` template
 * context property, for use in relative URLs within the HTML.
 *
 * This relative path is determined by the path-based ID of the resource (e.g.
 * patterns.components.button) and the `dest` configration settings for the
 * `resourceType` of the supplied resource (e.g. 'page', 'pattern').
 *
 * @param {Object} resource
 * @param {Object} drizzleData
 * @return {String}
 *
 * @example
 * getBaseUrl(somePageResource, drizzleData);
 * // '../..'
 */
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
