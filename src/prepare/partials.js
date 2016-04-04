import { resourceId } from '../utils/object';
import { readFiles } from '../utils/parse';

/**
 * Register a glob of partials.
 * @param {Object} Handlebars instance
 * @param {String} or {Array} glob
 */
function preparePartials (options) {
  return readFiles(options.src.partials.glob).then(partialFiles => {
    partialFiles.forEach(partialFile => {
      const partialKey = resourceId(partialFile, options.src.partials.basedir);
      options.handlebars.registerPartial(partialKey, partialFile.contents);
    });
    return options;
  });
}

export default preparePartials;
