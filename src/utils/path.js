import path from 'path';

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
  if (filePath.indexOf(fromPath) === -1) {
    // TODO Error handling: this should cause a warn
    return [];
  }
  const keys = path.relative(fromPath, path.dirname(filePath));
  if (keys && keys.length) {
    return keys.split(path.sep);
  }
  return [];
}


export { relativePathArray };
