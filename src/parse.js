import * as utils from './utils';
import Promise from 'bluebird';

/**
 * Parse a file structure of files matching `glob` into a nested object
 * structure:
 * { name: 'Directory Name in Title Case',
 *   items: {
 *     name: 'Sub Directory',
 *     items: { ... },
 *     'item-in-topdirectory': {
 *       name: 'Item In Top Directory',
 *       items: {   }
 *     }
 *   }
 * }
 *
 * Each object in `items` will be an object structured per the return value
 * of the parser associated with that file path pattern.
 */
function parseRecursive (glob, relativeKey, options) {
  const objectData = {};
  return utils.readFiles(glob, options).then(fileData => {
    fileData.forEach(objectFile => {
      const keys     = utils.relativePathArray(objectFile.path, relativeKey);
      const idKeys   = keys.map(key => utils.keyname(key));
      const entryKey = utils.keyname(objectFile.path, { stripNumbers: false });
      const pathKey  = utils.keyname(objectFile.path);
      const id       = idKeys.concat(pathKey).join('.');
      utils.deepRef(keys, objectData).items[entryKey] = Object.assign({
        id,
        name: utils.titleCase(pathKey)
      }, objectFile);
    });
    return objectData[relativeKey];
  });
}

/**
 * Parse a glob of files into flat-keyed object (no nested objects). Objects
 * will take form of return value from associated parser for the given file
 * path.
 * @TODO namespace conflicts, then what?
 * @param {glob} glob
 * @param {Object} options
 * @return {Promise} resolving to {Object}
 */
function parseFlat (glob, options) {
  return utils.readFilesKeyed(glob, options);
}


// @TODO Figure out how to emulate "local namespacing" of HBS vars
// so that one can reference data from front matter in patterns
// @TODO Run some fields through markdown
// @TODO Do we need to trim whitespace from pattern content?
// @TODO Do we need to store pattern data on another object as well?
// @TODO Do we need any further sorting?
// @TODO Need to register Handlebars partial

/**
 * Parse all the items needed for a drizzle build.
 */
function parseAll (options = {}) {
  return Promise.all([
    parseFlat(options.data, options),
    parseFlat(options.layouts, options),
    parseRecursive(options.pages, 'pages', options),
    parseRecursive(options.patterns, options.keys.patterns, options)
  ]).then(allData => {
    return {
      data    : allData[0],
      layouts : allData[1],
      pages   : allData[2],
      patterns: allData[3]
    };
  });
}

export { parseAll,
         parseFlat,
         parseRecursive
       };
