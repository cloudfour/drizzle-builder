import { keyname, relativePathArray } from './shared';

import DrizzleError from './error';

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
        throw new DrizzleError(`Property ${curr} not found on supplied object`,
          DrizzleError.LEVELS.ERROR);
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
  const pathBits = patternId.split('.'); // TODO pattern separator elsewhere?
  pathBits.shift();
  pathBits.splice(-1, 0, 'collection', 'items');
  return deepObj(pathBits, obj, false);
}

/**
 * Given a nested pattern `obj` and a `patternId`, find its collection
 * in the object `obj`.
 * @see deepPattern
 */
function deepCollection (patternId, obj) {
  const pathBits = patternId.split('.'); // TODO pattern separator elsewhere?
  pathBits.pop();
  pathBits.push('collection');
  pathBits.shift();
  return deepObj(pathBits, obj, false);
}

/**
 * Generate a resourceId for a file. Use file.path and base the
 * ID elements on the path elements between relativeTo and file. Path
 * elements will have special characters removed.
 * @example resourceId(
 *  '/foo/bar/baz/ole/01-fun-times.hbs', '/foo/bar/baz/', 'patterns'
 * ); // -> patterns.ole.fun-times
 * @param {Object}    Object representing file. Needs to have a `path` property
 * @param {String} || {Array} relativeTo path to relative root or path
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

export { deepCollection, // object
         deepObj, // object
         deepPattern, // object
         keyname, // object
         resourceId, //object
         resourceKey // object
       };
