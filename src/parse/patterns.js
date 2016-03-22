import * as utils from '../utils';
import * as parseUtils from './utils';

/**
 *
 */
function parsePatterns (options) {
  const patternData = {};
  return utils.readFiles(options.src.patterns, options).then(fileData => {
    const relativeRoot = utils.commonRoot(fileData);
    fileData.forEach(patternFile => {
      const entryKey = utils.keyname(patternFile.path, { stripNumbers: false });
      const pathKeys = utils.relativePathArray(patternFile.path,
        relativeRoot);
      const patternEntry = utils.deepObj(pathKeys, patternData);

      const idKeys = pathKeys.map(utils.keyname);
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
    return patternData;
  });
}

export default parsePatterns;
