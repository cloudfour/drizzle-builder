import * as utils from '../utils';
/**
 * Register a glob of partials.
 * @param {Object} Handlebars instance
 * @param {String || Array} glob
 */
function preparePartials (Handlebars, partials = '') {
  return utils.readFiles(partials).then(partialFiles => {
    partialFiles.forEach(partialFile => {
      const partialKey = utils.keyname(partialFile.path);
      Handlebars.registerPartial(partialKey, partialFile.contents);
    });
    return Handlebars.partials;
  });
}

export default preparePartials;
