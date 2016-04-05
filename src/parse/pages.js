import { relativePathArray } from '../utils/path';
import { parseLocalData, readFiles } from '../utils/parse';
import { deepObj, resourceKey } from '../utils/object';

/**
 * Parse page files.
 * @param {Object} Options
 * @return {Promise} resolving to page data
 */
function parsePages (options) {
  const pageData = {};

  return readFiles(options.src.pages.glob, options).then(fileData => {
    fileData.forEach(pageFile => {
      const keys       = relativePathArray(
        pageFile.path, options.src.pages.basedir);
      deepObj(keys, pageData)[resourceKey(pageFile)] = parseLocalData(
        pageFile, options);
    });
    return pageData;
  });
}

export default parsePages;
