import path from 'path';

/**
 * Given an array of file objects, take all of their paths and find
 * what the common root directory is for all of them.
 * @example commonRoot([
 *  'foo/bar/baz/ding/dong.html',
 *  'foo/bar/baz/huff/dumb.txt',
 *  'foo/bar/baz/oleo.html',
 *  'foo/bar/baz/one/two.html']); // -> 'foo/bar/baz/'
 *
 * @param {Array} files     Each element should be a file-like {object} with
 *                          a `path` property OR {String} (path).
 * @return {String}         Common root path
 */
function commonRoot (files) {
  const paths = files.map(file => file.path || file);
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


export { commonRoot,
         relativePathArray
       };
