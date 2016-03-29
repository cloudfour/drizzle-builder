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
      // Retrieve the correct object reference where we should put this
      // pattern. This represents the "collection" containing this pattern.
      const patternEntry = utils.deepObj(
        utils.relativePathArray(patternFile.path, relativeRoot),
        patternData
      );
      // Create the special `items` property (object) if not extant
      patternEntry.items = patternEntry.items || {};
      // Each pattern is added to the `items` object of its parent collection
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
