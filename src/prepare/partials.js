import * as utils from '../utils';
/**
 * Register a glob of partials.
 * @param {Object} Handlebars instance
 * @param {String || Array} glob
 */
function preparePartials (Handlebars, partials = '') {
  return utils.readFiles(partials).then(partialFiles => {
    const relativeRoot = utils.commonRoot(partialFiles);
    partialFiles.forEach(partialFile => {
      const partialKey = utils.resourceId(partialFile, relativeRoot);
      Handlebars.registerPartial(partialKey, partialFile.contents);
    });
    return Handlebars.partials;
  });
}

export default preparePartials;
