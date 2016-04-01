import globby from 'globby';
import Promise from 'bluebird';
import path from 'path';
import {readFile as readFileCB} from 'fs';
var readFile = Promise.promisify(readFileCB);

/* Helper functions */

/**
 * Return extension-less basename of filepath
 * @param {String} filepath
 * @example basename('foo/bar/baz.txt'); // -> 'baz'
 */
function basename (filepath) {
  return path.basename(filepath, path.extname(filepath));
}

/**
 * Return normalized (no '..', '.') full dirname of filepath
 * @param {String} filepath
 * @example dirname('../ding/foo.txt'); // -> '/Users/shiela/ding/'
 */
function dirname (filepath) {
  return path.normalize(path.dirname(filepath));
}

/**
 * Return the name of this file's directory's immediate parent directory
 * @param {String} filepath
 * @example basename('foo/bar/baz.txt'); // -> 'bar'
 */
function localDirname (filepath) {
  return dirname(filepath).split(path.sep).pop();
}

/**
 * Return the name of this file's directory's immediate parent directory
 * @param {String} filepath
 * @example basename('foo/bar/baz.txt'); // -> 'foo'
 */
function parentDirname (filepath) {
  return dirname(filepath).split(path.sep).slice(-2, -1)[0];
}

/**
 * Given an array of file objects, take all of their paths and find
 * what the common root directory is for all of them.
 * @example commonRoot([
 *  'foo/bar/baz/ding/dong.html',
 *  'foo/bar/baz/huff/dumb.txt',
 *  'foo/bar/baz/oleo.html',
 *  'foo/bar/baz/one/two.html']); // -> 'foo/bar/baz/'
 *
 * @param {Array} files     File objects. Each should have a `path` property
 * @return {String}         Common root path
 */
function commonRoot (files) {
  const paths = files.map(file => file.path);
  const relativePath = paths.reduce((prev, curr) => {
    prev = prev.split(path.sep);
    curr = curr.split(path.sep);
    prev = prev.filter(prevBit => {
      return curr.some(currBit => prevBit === currBit);
    });
    return prev.join(path.sep);
  });
  return relativePath;
}

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
    // TODO: Possibly throw if not?
    if (typeof prev[curr] === 'undefined' && createEntries) {
      prev[curr] = {};
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

function deepCollection (patternId, obj) {
  const pathBits = patternId.split('.'); // TODO pattern separator elsewhere?
  pathBits.pop();
  pathBits.push('collection');
  pathBits.shift();
  return deepObj(pathBits, obj, false);
}

/**
 * Take a given glob and convert it to a glob that will match directories
 * (instead of files). Return Promise that resolves to matching dirs.
 *
 * @example getDirs('foo/bar/baz')
 *
 * @param {glob}    glob to convert to directory glob
 * @param {Object}  options to pass on to getFiles/globby
 * @return {Promise} resolving to glob matches
 */
function getDirs (glob, options = {}) {
  const opts = Object.assign({
    nodir: false
  }, options);
  const dirGlob = (typeof glob === 'string') ? Array.of(glob) : glob;
  return getFiles(dirGlob.map(dirEntry => path.dirname(dirEntry) + '/*/'),
    opts);
}

/**
 * @param {glob} glob
 * @return {Promise} resolving to {Array} of files matching glob
 */
function getFiles (glob, globOpts = {}) {
  const opts = Object.assign({
    nodir: true
  }, globOpts);
  return globby(glob, opts);
}

/**
 * Utility function to test if a value COULD be a glob. A single string or
 * an Array of strings counts. Just because this returns true, however,
 * doesn't mean it is a glob that makes sense, just that it looks like one.
 *
 * @param {String || Array} candidate
 * @return Boolean
 */
function isGlob (candidate) {
  if (typeof candidate === 'string' && candidate.length > 0) { return true; }
  if (Array.isArray(candidate) && candidate.length > 0) {
    return candidate.every(candidateEl => typeof candidateEl === 'string');
  }
  return false;
}

/**
 * Utility function to process strings to make them key-like (for properties).
 * Previously this stripped prefixed numbers, etc., but for now it is
 * dead simple.
 */
function keyname (str) {
  return basename(str);
}

/**
 * Retrieve the correct parsing function for a file based on its
 * path. Each parser with a `pattern` property will compile that pattern
 * to a RegExp and test it against the filepath. If no match is found
 * against any of the parsers by path pattern, a default parser will be
 * returned: either a parser keyed by `default` in the `parsers` object
 * or, lacking that, a default function that leaves the contents of the
 * file untouched.
 *
 * @param {String} filepath
 * @param {Object} parsers
 * @see options module
 * @return {Function} applicable parsing function for file contents
 */
function matchParser (filepath, parsers = {}) {
  for (var parserKey in parsers) {
    if (parsers[parserKey].pattern) {
      if (new RegExp(parsers[parserKey].pattern).test(filepath)) {
        return parsers[parserKey].parseFn;
      }
    }
  }
  return (parsers.default && parsers.default.parseFn) ||
    ((contents, filepath) => ({ contents: contents }));
}


/**
 * Take a glob; read the files, optionally running a `contentFn` over
 * the contents of the file.
 *
 * @param {glob} glob of files to read
 * @param {Object} Options:
 *  - {Object} available parsers
 *  - {String} encoding
 *  - {Object} globOpts gets passed to getFiles
 * @return {Promise} resolving to Array of Objects:
 *  - {String} path
 *  - {String || Mixed} contents: contents of file after contentFn
 */
function readFiles (glob, {
  parsers = {},
  encoding = 'utf-8',
  globOpts = {}
} = {}) {
  return getFiles(glob, globOpts).then(paths => {
    return Promise.all(paths.map(filepath => {
      return readFile(filepath, encoding)
        .then(fileData => {
          const parser = matchParser(filepath, parsers);
          fileData = parser(fileData, filepath);
          if (typeof fileData === 'string') {
            fileData = { contents: fileData };
          }
          return Object.assign(fileData, { path: filepath });
        });
    }));
  });
}

/**
 * Read the files from a glob, but then instead of resolving the
 * Promise with an Array of objects (@see readFiles), resolve with a
 * single object; each file's contents is keyed by its filename run
 * through optional `keyFn(filePath, options)`` (default: keyname).
 * Will pass other options on to readFiles and keyFn
 *
 * @param {glob}
 * @param {Object} options (all optional):
 *  - keyFn
 *  - contentFn
 *  - stripNumbers
 * @return {Promise} resolving to {Object} of keyed file contents
 */
function readFilesKeyed (glob, options = {}) {
  const {
    keyFn = (path, options) => keyname(path, options)
  } = options;
  return readFiles(glob, options).then(allFileData => {
    const keyedFileData = new Object();
    for (var aFile of allFileData) {
      keyedFileData[keyFn(aFile.path, options)] = aFile;
    }
    return keyedFileData;
  });
}

/**
 * Given a file's path and a string representing a directory name,
 * return an Array that only contains directories at or beneath that
 * directory.
 *
 * @example relativePathArray('/foo/bar/baz/ding/dong/tink.txt', 'baz')
 *  // -> ['baz', 'ding', 'dong']
 * @param {String} filePath
 * @param {String} fromPath
 * @return {Array}
 */
function relativePathArray (filePath, fromPath) {
  const keys = path.relative(fromPath, path.dirname(filePath));
  if (keys && keys.length) {
    return keys.split(path.sep);
  }
  return [];
}

/**
 * Generate a resourceId for a file. Use file.path and base the
 * ID elements on the path elements between relativeRoot and file. Path
 * elements will have special characters removed.
 * @example resourceId(
 *  '/foo/bar/baz/ole/01-fun-times.hbs', '/foo/bar/baz/', 'patterns'
 * ); // -> patterns.ole.fun-times
 * @param {Object}    Object representing file. Needs to have a `path` property
 * @param {String} || {Array} relativeRoot path to relative root or path
 *                            elements to same in Array
 * @param {String} resourceCollection  Will be prepended as first element in ID
 *                                     if provided.
 * @return {String} ID for this resource
 */
function resourceId (resourceFile, relativeRoot, resourceCollection = '') {
  const pathKeys = relativePathArray(resourceFile.path, relativeRoot)
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
 * Convert str to title case (every word will be capitalized)
 * @param {String} str
 * @return {String}
 */
function titleCase (str) {
  return str
    .toLowerCase()
    .replace(/(\-|_)/g, ' ')
    .replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.substr(1));
}

export { commonRoot,
         deepCollection,
         deepObj,
         deepPattern,
         dirname,
         getDirs,
         getFiles,
         isGlob,
         keyname,
         localDirname,
         matchParser,
         parentDirname,
         readFiles,
         readFilesKeyed,
         relativePathArray,
         resourceId,
         resourceKey,
         titleCase
       };
