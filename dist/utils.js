'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.titleCase = exports.readFilesKeyed = exports.readFiles = exports.parentDirname = exports.keyname = exports.getFiles = exports.dirname = undefined;

var _globby = require('globby');

var globby = _interopRequireDefault(_globby).default;

var _bluebird = require('bluebird');

var Promise = _interopRequireDefault(_bluebird).default;

var _path = require('path');

var path = _interopRequireDefault(_path).default;

var _fs = require('fs');

var readFileCB = _fs.readFile;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var readFile = Promise.promisify(readFileCB);

/* Helper functions */
var basename = function basename(filepath) {
  return path.basename(filepath, path.extname(filepath));
};
var dirname = function dirname(filepath) {
  return path.normalize(path.dirname(filepath));
};
var parentDirname = function parentDirname(filepath) {
  return dirname(filepath).split(path.sep).pop();
};
var removeNumbers = function removeNumbers(str) {
  return str.replace(/^[0-9|\.\-]+/, '');
};
var getFiles = function getFiles(glob) {
  return globby(glob, { nodir: true });
};

/**
 * Take a glob; read the files. Return a Promise that ultimately resolves
 * to an Array of objects:
 * [{ path: original filepath,
 *   contents: utf-8 file contents}...]
 */
function readFiles(glob) {
  return getFiles(glob).then(function (paths) {
    var fileReadPromises = paths.map(function (path) {
      return readFile(path, 'utf-8').then(function (contents) {
        return { path: path, contents: contents };
      });
    });
    return Promise.all(fileReadPromises);
  });
}

/**
 * Read the files from a glob, but then instead of resolving the
 * Promise with an Array of objects (@see readFiles), resolve with a
 * single object; each file's contents is keyed by its filename run
 * through keyname().
 *
 */
function readFilesKeyed(glob) {
  var preserveNumbers = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  return readFiles(glob).then(function (allFileData) {
    var keyedFileData = new Object();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = allFileData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var aFile = _step.value;

        keyedFileData[keyname(aFile.path, preserveNumbers)] = aFile.contents;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return keyedFileData;
  });
}

/**
 * Utility function to provide a consistent "key" for elements, materials,
 * partials, etc, based on a filepath:
 * - replace whitespace characters with `-`
 * - use only the basename, no extension
 * - unless preserveNumbers, remove numbers from the string as well
 *
 * @param {String} str    Typically a filepath
 * @param {Boolean} preserveNumbers
 * @return {String}
 */
function keyname(str) {
  var preserveNumbers = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  var name = basename(str).replace(/\s/g, '-');
  return preserveNumbers ? name : removeNumbers(name);
}

/**
 * Convert str to title case (every word will be capitalized)
 * @param {String} str
 * @return {String}
 */
function titleCase(str) {
  return str.toLowerCase().replace(/(\-|_)/g, ' ').replace(/\w\S*/g, function (word) {
    return word.charAt(0).toUpperCase() + word.substr(1);
  });
}

exports.dirname = dirname;
exports.getFiles = getFiles;
exports.keyname = keyname;
exports.parentDirname = parentDirname;
exports.readFiles = readFiles;
exports.readFilesKeyed = readFilesKeyed;
exports.titleCase = titleCase;