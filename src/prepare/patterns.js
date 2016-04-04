import frontMatter from 'front-matter';
import { resourceId } from '../utils/object';
import { readFiles } from '../utils/parse';
import { commonRoot } from '../utils/path';

/**
 * Parse patterns and register them as partials.
 * @param {Object} Handlebars instance
 * @param {String} or {Array} glob
 */
function preparePatterns (options) {
  return readFiles(options.src.patterns).then(patternFiles => {
    const relativeRoot = commonRoot(patternFiles);
    patternFiles.forEach(patternFile => {
      const partialKey = resourceId(
        patternFile, relativeRoot, 'patterns');
      // Pull out front matter
      const patternContents = frontMatter(patternFile.contents).body;
      options.handlebars.registerPartial(partialKey, patternContents);
    });
    return options;
  });
}

export default preparePatterns;
