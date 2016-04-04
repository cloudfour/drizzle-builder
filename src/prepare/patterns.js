import frontMatter from 'front-matter';
import { resourceId } from '../utils/object';
import { readFiles } from '../utils/parse';

/**
 * Parse patterns and register them as partials.
 * @param {Object} Handlebars instance
 * @param {String} or {Array} glob
 */
function preparePatterns (options) {
  return readFiles(options.src.patterns.glob).then(patternFiles => {
    patternFiles.forEach(patternFile => {
      const partialKey = resourceId(
        patternFile, options.src.patterns.basedir, 'patterns');
      // Pull out front matter
      const patternContents = frontMatter(patternFile.contents).body;
      options.handlebars.registerPartial(partialKey, patternContents);
    });
    return options;
  });
}

export default preparePatterns;
