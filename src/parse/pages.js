import * as utils from '../utils';
import * as parseUtils from './utils';

function parsePages (options) {
  const pageData = {};

  return utils.readFiles(options.pages, options).then(fileData => {
    fileData.forEach(pageFile => {
      const entryKey   = utils.keyname(pageFile.path, { stripNumbers: false });
      const keys       = utils.relativePathArray(
        pageFile.path, options.keys.pages);
      keys.shift();
      utils.deepObj(keys, pageData)[entryKey] = parseUtils
        .parseLocalData(pageFile, options);
    });
    return pageData;
  });
}

export default parsePages;
