import path from 'path';

/**
 * Split a string on a common separator.
 * @param {String} idString
 * @return {Array}
 */
function idKeys (idString) {
  return idString.split('.');
}
/**
 * Utility function to process strings to make them key-like (for properties).
 * Previously this stripped prefixed numbers, etc., but for now it is
 * dead simple.
 */
function keyname (str) {
  return path.basename(str, path.extname(str));
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
  if (filePath.indexOf(fromPath) === -1 || filePath  === fromPath) {
    // TODO Error handling: this should cause a warn
    return [];
  }
  const keys = path.relative(fromPath, path.dirname(filePath));
  if (keys && keys.length) {
    return keys.split(path.sep);
  }
  return [];
}

/**
 *
 */
function resourcePath (resourceId, dest, options) {
  const subPath = idKeys(resourceId);
  subPath.shift();
  const filename = subPath.pop() + '.html';
  const outputPath = path.normalize(path.join(
    dest,
    subPath.join(path.sep),
    filename
  ));
  return outputPath;
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

export { idKeys,
         keyname,
         relativePathArray,
         resourcePath,
         titleCase
       };
