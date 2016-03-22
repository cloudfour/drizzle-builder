import * as utils from '../utils';
import * as parseUtils from './utils';

function parsePages (options) {
  const pageData = {};

  return utils.readFiles(options.src.pages, options).then(fileData => {
    const relativeRoot = utils.commonRoot(fileData);
    fileData.forEach(pageFile => {
      const entryKey   = utils.keyname(pageFile.path, { stripNumbers: false });
      const keys       = utils.relativePathArray(
        pageFile.path, relativeRoot);
      utils.deepObj(keys, pageData)[entryKey] = parseUtils
        .parseLocalData(pageFile, options);
    });
    return pageData;
  });
}

export default parsePages;
