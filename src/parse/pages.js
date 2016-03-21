import * as utils from '../utils';
import * as parseUtils from './utils';
import path from 'path';

function parsePages (options) {
  const pageData = {};

  return utils.readFiles(options.pages, options).then(fileData => {
    fileData.forEach(pageFile => {
      const entryKey   = utils.keyname(pageFile.path, { stripNumbers: false });
      const keys       = utils.relativePathArray(
        pageFile.path, options.keys.pages);
      keys.shift();
      const outputPath = path.join(keys.join(path.sep), entryKey + '.html');
      utils.deepObj(keys, pageData)[entryKey] = Object.assign(
        parseUtils.parseLocalData(pageFile, options), pageFile, {
          outputPath,
          resourceType: 'page'
        });
    });
    return pageData;
  });
}

export default parsePages;
