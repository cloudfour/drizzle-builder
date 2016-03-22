import * as utils from '../utils';
import * as parseUtils from './utils';

/**
 *
 */
function parsePatterns (options) {
  const patternData = {};
  const dirPromise = utils.globRoot(options.src.patterns);
  const readPromise = utils.readFiles(options.src.patterns, options);
  return Promise.all([readPromise, dirPromise]).then(allData => {
    const fileData = allData[0];
    const globRoot = allData[1];
    fileData.forEach(patternFile => {
      const entryKey = utils.keyname(patternFile.path, { stripNumbers: false });
      const pathKeys = utils.relativePathArray(patternFile.path,
        options.keys.patterns);
      const patternEntry = utils.deepObj(pathKeys, patternData);

      const idKeys = pathKeys.map(key => utils.keyname(key));
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
