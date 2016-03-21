import * as utils from '../utils';
import * as parseUtils from './utils';

/**
 *
 */
function parsePatterns (options) {
  const patternData = {};
  return utils.readFiles(options.patterns, options).then(fileData => {
    fileData.forEach(patternFile => {
      const entryKey = utils.keyname(patternFile.path, { stripNumbers: false });
      const keys     = utils.relativePathArray(patternFile.path,
        options.keys.patterns);
      const patternEntry = utils.deepObj(keys, patternData);

      const idKeys = keys.map(key => utils.keyname(key));
      const pathKey = utils.keyname(patternFile.path);
      const id = idKeys.concat(pathKey).join('.');

      patternEntry.items = patternEntry.items || {};
      patternEntry.items[entryKey] = Object.assign(
        parseUtils.parseLocalData(patternFile, options),
        patternFile,
        {
          id,
          name: utils.titleCase(pathKey)
        }
      );
    });
    return patternData[options.keys.patterns];
  });
}

export default parsePatterns;
