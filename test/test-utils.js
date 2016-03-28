const fs = require('fs');
const Promise = require('bluebird');
const readFile = Promise.promisify(fs.readFile);
const stat     = Promise.promisify(fs.stat);

function areFiles (paths) {
  return Promise.all(paths.map(isFile)).then(results => {
    return !results.some(result => result === false);
  });
}

function isFile (path) {
  return stat(path).then(stats => {
    if (stats.isFile()) {
      return true;
    }
    return false;
  }).catch(fail => false);
}

function fileContents (path) {
  return readFile(path, 'utf-8');
}

module.exports = {
  areFiles: areFiles,
  fileContents: fileContents,
  isFile: isFile
};
