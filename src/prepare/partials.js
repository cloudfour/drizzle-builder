import { resourceId } from '../utils/object';
import { readFiles } from '../utils/parse';
import { commonRoot } from '../utils/path';

/**
 * Register a glob of partials.
 * @param {Object} Handlebars instance
 * @param {String || Array} glob
 */
function preparePartials (Handlebars, partials = '') {
  return readFiles(partials).then(partialFiles => {
    const relativeRoot = commonRoot(partialFiles);
    partialFiles.forEach(partialFile => {
      const partialKey = resourceId(partialFile, relativeRoot);
      Handlebars.registerPartial(partialKey, partialFile.contents);
    });
    return Handlebars.partials;
  });
}

export default preparePartials;
