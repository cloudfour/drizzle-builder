import R from 'ramda';
import {relative as relativePath} from 'path';
import {splitPath} from '../utils/object';
import {sortByProp} from '../utils/list';
import {
  resourcePath,
  isType
} from '../utils/shared';

const isDir = isType(undefined);
const pickProps = R.pick(['id', 'url', 'data']);

/**
 * Return an inner object/array from the Drizzle context.
 */
function extractSubset (path, drizzle) {
  const pathBits = splitPath(path);
  const results = R.path(pathBits, drizzle);
  return results;
}

/**
 * Return a relative base path for .html destinations.
 */
function destRoot (type, drizzle) {
  // TODO: this is unfortunate, and due to difficulty using defaults.keys
  const keys = new Map([
    ['page', 'pages'],
    ['collection', 'collections'],
    ['pattern', 'patterns']
  ]);

  return relativePath(
    drizzle.options.dest.root,
    drizzle.options.dest[keys.get(type)]
  );
}

/**
 * Return a refined object (page, pattern, etc.) representing a menu item.
 */
function menuItem (props, drizzle) {
  props.url = resourcePath(
    props.id,
    destRoot(props.resourceType, drizzle)
  );
  return pickProps(props);
}

export default function register (options) {
  const Handlebars = options.handlebars;

  Handlebars.registerHelper('pages', (path, context) => {
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
      // TODO: do we want to access via "data.foo" or just "foo"
      results = sortByProp(['data', options.sortby], results);
    }

    return results;
  });

  Handlebars.registerHelper('page', (path, context) => {
    const drizzle = context.data.root.drizzle;
    const subset = extractSubset(`pages/${path}`, drizzle);
    const result = {};

    if (!isDir(subset)) {
      Object.assign(result, menuItem(subset, drizzle));
    }

    return result;
  });

  return Handlebars;
}
