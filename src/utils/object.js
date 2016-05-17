import {idKeys, keyname, relativePathArray} from './shared';
import R from 'ramda';
import DrizzleError from './error';
import {join, relative} from 'path';

/**
 * Return a reference to the deeply-nested object indicated by the items
 * in `pathKeys`. If `createEntries`, entry levels will be created as needed
 * if they don't yet exist on `obj`.
 *
 * @param {Array} pathKeys    Elements making up the "path" to the reference
 * @param {Object}            Object to add needed references to
 *
 * @example deepRef(['foo', 'bar', 'baz'], { foo: {} }, true); // => foo.bar.baz
 */
function deepObj (pathKeys, obj, createEntries = true) {
  return pathKeys.reduce((prev, curr) => {
    if (typeof prev[curr] === 'undefined') {
      if (createEntries) {
        prev[curr] = {};
      } else {
        DrizzleError.error(new DrizzleError(
          `Property ${curr} not found on supplied object`,
          DrizzleError.LEVELS.ERROR));
      }
    }
    return prev[curr];
  }, obj);
}

/**
 * Given a nested pattern `obj` and a `patternId`, find that pattern
 * in the object. That means inserting some properties to stick it in the
 * proper `collection` and `items` for a given pattern hierarchy.
 * @example deepPattern('foo.bar.baz.bong', patterns); // ->
 *   object reference at patterns.foo.bar.baz.collection.items.bong
 *
 * @param {String} patternId
 * @param {Object} obj       Object with all Patterns
 * @return {Object}          Object reference to patterns
 */
function deepPattern (patternId, obj) {
  const pathBits = idKeys(patternId);
  pathBits.shift();
  pathBits.splice(-1, 0, 'collection', 'items');
  return deepObj(pathBits, obj, false);
}

/**
 * Given a nested pattern `obj` and a `patternId`, find its collection
 * in the object `obj`.
 * @see deepPattern
 */
function deepCollection (collectionId, obj) {
  const pathBits = idKeys(collectionId);
  pathBits.pop();
  pathBits.push('collection');
  pathBits.shift();
  return deepObj(pathBits, obj, false);
}

/**
 * isObject function opinionated against Arrays
 * @param {Obj}
 * @return {Boolean}
 */
function isObject (obj) {
  const objType = typeof obj;
  return (objType === 'object' && !!obj && !Array.isArray(obj));
}

/**
 * Take a deeply-nested object and return a single-level object keyed
 * by the `id` property of original object entries.
 *
 * @param {Obj} obj
 * @param {Obj} keyedObj   For recursion; not strictly necessary but...
 * @return {Obj} keyed by ids
 */
function flattenById (obj, keyedObj = {}) {
  if (obj.hasOwnProperty('id')) {
    keyedObj[obj.id] = obj;
  }
  for (var key in obj) {
    if (isObject(obj[key])) {
      flattenById(obj[key], keyedObj);
    }
  }
  return keyedObj;
}
/**
 * Generate a resourceId for a file. Use file.path and base the
 * ID elements on the path elements between relativeTo and file. Path
 * elements will have special characters removed.
 * @example resourceId(
 *  '/foo/bar/baz/ole/01-fun-times.hbs', '/foo/bar/baz/', 'patterns'
 * ); // -> patterns.ole.fun-times
 * @param {Object}    Object representing file. Needs to have a `path` property
 * @param {String|Array} relativeTo path to relative root or path
 *                            elements to same in Array
 * @param {String} resourceCollection  Will be prepended as first element in ID
 *                                     if provided.
 * @return {String} ID for this resource
 */
function resourceId (resourceFile, relativeTo, resourceCollection = '') {
  const pathKeys = relativePathArray(resourceFile.path, relativeTo)
    .map(keyname);
  const resourceBits = [];
  if (resourceCollection && resourceCollection.length) {
    resourceBits.push(resourceCollection);
  }
  return resourceBits
    .concat(pathKeys)
    .concat([keyname(resourceFile.path)])
    .join ('.');
}

/**
 * Convenience function to create proper variant of file's basename for
 * use as a key in a data object.
 * @example resourceKey({ path: '/foo/bar/baz/04-fun' }); // -> '04-fun'
 * @param {Object} resourceFile Object representing a file. Needs `path` prop
 * @return {String}
 */
function resourceKey (resourceFile) {
  return keyname(resourceFile.path);
}

/**
 * Split a path string delimited by "." or "/".
 *
 * @param {String} path
 * A path string to split.
 *
 * @return {Array}
 * An array of path segments.
 *
 * @example
 * splitPath('a/b/c/1.2.3');
 * // ['a', 'b', 'c', '1', '2', '3']
 */
function splitPath (path) {
  const delim = /[\.\/]/;
  const result = R.pipe(R.split(delim), R.without(''))(path);
  return result;
}

/**
 * Normalize a sloppy (or dot-separated) path into a "valid" path.
 *
 * @param {String} path
 * A raw input path string.
 *
 * @return {String}
 * A normalized path string.
 *
 * @example
 * normalizePath('foo/bar//baz.bang.1./');
 * // 'foo/bar/baz/bang/1'
 */
function normalizePath (path) {
  return join(...splitPath(path));
}

/**
 * Check if one path is a direct child of another.
 *
 * @param {String} pathA
 * @param {String} pathB
 * @return {Boolean}
 *
 * @example
 * isPathChild('components/button', 'components');
 * // true
 */
function isPathChild (pathA, pathB) {
  const relPath = relative(
    normalizePath(pathA),
    normalizePath(pathB)
  );
  return relPath === '..';
}

export { deepCollection, // object
         deepObj, // object
         deepPattern, // object
         flattenById,
         keyname, // object
         resourceId, //object
         resourceKey, // object
         splitPath,
         normalizePath,
         isPathChild
       };
