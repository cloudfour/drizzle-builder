import * as utils from '../utils';
import frontMatter from 'front-matter';

/**
 * Register a glob of partials.
 * @param {Object} Handlebars instance
 * @param {String || Array} glob
 */
function preparePatterns (Handlebars, patterns = '') {
  return utils.readFiles(patterns).then(patternFiles => {
    const relativeRoot = utils.commonRoot(patternFiles);
    patternFiles.forEach(patternFile => {
      const partialKey = utils.resourceId(
        patternFile, relativeRoot, 'patterns');
      const patternContents = frontMatter(patternFile.contents).body;
      Handlebars.registerPartial(partialKey, patternContents);
    });
    return Handlebars.partials;
  });
}

export default preparePatterns;
