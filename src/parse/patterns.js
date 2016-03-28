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
      const patternEntry = utils.deepObj(
        utils.relativePathArray(patternFile.path, relativeRoot),
        patternData
      );

      patternEntry.items = patternEntry.items || {};
      patternEntry
        .items[utils.resourceKey(patternFile)] = parseUtils.parseLocalData(
          patternFile,
          options,
          {
            id: utils.resourceId(patternFile, relativeRoot, 'patterns'),
            name: utils.titleCase(utils.keyname(patternFile.path))
          }
      );
    });
    return patternData;
  });
}

export default parsePatterns;
