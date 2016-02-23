var globby   = require('globby');
var Promise  = require('bluebird');
var readFile = Promise.promisify(require('fs').readFile);
var path     = require('path');

const basename = filepath => path.basename(filepath, path.extname(filepath));
const removeNumbers = str => str.replace(/^[0-9|\.\-]+/, '');

function readFiles (glob) {
  return globby(glob).then(paths => {
    var fileReadPromises = paths.map(path => {
      return readFile(path, 'utf-8')
        .then(contents => ({ path, contents }));
    });
    return Promise.all(fileReadPromises);
  });
}

function keyname (filepath, preserveNumbers = false) {
  const name = basename(filepath).replace(/\s/g, '-');
  return (preserveNumbers) ? name : removeNumbers(name);
}

/**
 * Convert str to title case (every word will be capitalized)
 * @param {String} str
 * @return {String}
 */
function toTitleCase (str) {
  return str
    .toLowerCase()
    .replace(/(\-|_)/g, ' ')
    .replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.substr(1));
}

export { toTitleCase, readFiles, keyname };
