import R from 'ramda';
import {relative as relativePath} from 'path';
import {splitPath} from '../utils/object';
import {sortByProp} from '../utils/list';
import {resourcePath, isType} from '../utils/shared';

const isDir = isType(undefined);

/**
 * Return an inner object/array from the Drizzle context.
 *
 * @param {String} path
 * The path string (e.g. "foo/bar/baz")
 *
 * @param {Object} drizzle
 * The Drizzle root context.
 *
 * @return {Mixed}
 * Whatever structure exists at the supplied path.
 */
function extractSubset (path, drizzle) {
  const pathBits = splitPath(path);
  const results = R.path(pathBits, drizzle);
  return results;
}

/**
 * Return a relative base path for .html destinations.
 *
 * @param {String} type
 * The resource type identifier (e.g. "page", "pattern", "collection")
 *
 * @param {Object} drizzle
 * The Drizzle root context.
 *
 * @return {String}
 * The relative base path for the supplied resource type.
 */
function destRoot (type, drizzle) {
  const options = drizzle.options;

  // TODO: this is unfortunate, and due to difficulty using defaults.keys
  const keys = new Map([
    ['page', 'pages'],
    ['collection', 'collections'],
    ['pattern', 'patterns']
  ]);

  return relativePath(
    options.dest.root,
    options.dest[keys.get(type)]
  );
}

/**
 * Return a refined object (page, pattern, etc.) representing a menu item.
 *
 * @param {Object} props
 * The "raw" object representation of a menu item.
 *
 * @param {Object} drizzle
 * The Drizzle root context.
 *
 * @return {Object}
 * The "refined" object representation of a menu item (with fewer properties
 * and a new `url` property).
 */
function menuItem (props, drizzle) {
  props.url = resourcePath(
    props.id,
    destRoot(props.resourceType, drizzle)
  );
  return R.omit(['contents', 'items'], props);
}

export default function register (options) {
  const Handlebars = options.handlebars;

  Handlebars.registerHelper('pages', (...args) => {
    const path = R.is(String, args[0]) ? args[0] : '.';
    const context = args[1] || args[0];
    const drizzle = context.data.root.drizzle;
    const options = context.hash;
    const subset = extractSubset(`pages/${path}`, drizzle);
    const isIgnored = R.equals(options.ignore);
    let results = [];

    for (const key in subset) {
      const item = subset[key];

      if (!isDir(item) && !isIgnored(key)) {
        results.push(menuItem(item, drizzle));
      }
    }

    if (options.sortby) {
      results = sortByProp(['data', options.sortby], results);
    }

    return results;
  });

  Handlebars.registerHelper('page', (...args) => {
    const path = R.is(String, args[0]) ? args[0] : 'index';
    const context = args[1] || args[0];
    const drizzle = context.data.root.drizzle;
    const subset = extractSubset(`pages/${path}`, drizzle);
    const result = {};

    if (!isDir(subset)) {
      Object.assign(result, menuItem(subset, drizzle));
    }

    return result;
  });

  Handlebars.registerHelper('collections', (...args) => {
    const path = R.is(String, args[0]) ? args[0] : '.';
    const context = args[1] || args[0];
    const drizzle = context.data.root.drizzle;
    const options = context.hash;
    const subset = extractSubset(`patterns/${path}`, drizzle);
    const isIgnored = R.equals(options.ignore);
    let results = [];

    for (const key in subset) {
      const item = subset[key];

      if (item.collection && !isIgnored(key)) {
        results.push(menuItem(item.collection, drizzle));
      }
    }

    if (options.sortby) {
      results = sortByProp([options.sortby], results);
    }

    return results;
  });

  Handlebars.registerHelper('collection', (...args) => {
    const path = R.is(String, args[0]) ? args[0] : '.';
    const context = args[1] || args[0];
    const drizzle = context.data.root.drizzle;
    const subset = extractSubset(`patterns/${path}/collection`, drizzle);
    const result = {};

    if (!isDir(subset)) {
      Object.assign(result, menuItem(subset, drizzle));
    }

    return result;
  });

  return Handlebars;
}
