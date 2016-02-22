var Promise = require('bluebird');
var globby = require('globby');
var readFile = Promise.promisify(require('fs').readFile);

const readFiles = glob => {
  return globby(glob).then(paths => {
    var fileReadPromises = paths.map(path => {
      return readFile(path, 'utf-8')
        .then(contents => ({ path, contents }));
    });
    return Promise.all(fileReadPromises);
  });
};

/**
 * Convert str to title case (every word will be capitalized)
 * @param {String} str
 * @return {String}
 */
const toTitleCase = str => str
  .toLowerCase()
  .replace(/(\-|_)/g, ' ')
  .replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.substr(1));

export { toTitleCase, readFiles };
