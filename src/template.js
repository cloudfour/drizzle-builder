import globby from 'globby';
import path from 'path';
import * as utils from './utils';

/**
 * Register helpers on the passed Handlebars instance.
 * Accept an object with helperKey => helperFunctions,
 * or a glob (as Array or string) of files (modules) to
 * register. In the latter case, the filename w/o extension
 * will be used as the helper key.
 *
 * @param {Object} Handlebars handlebars instance
 * @param {Object} || [{Array} || {String} glob]
 * @param return {Promise}, resolving to
 *           {Object} of all helpers registered on Handlebars
 */
function prepareHelpers (Handlebars, helpers = {}) {
  if (typeof helpers === 'string' || Array.isArray(helpers)) {
    return globby(helpers).then(helperPaths => {
      helperPaths.forEach(helperPath => {
        const helperKey = path.basename(helperPath, path.extname(helperPath));
        Handlebars.registerHelper(helperKey, require(helperPath));
      });
      return Handlebars.helpers;
    });
  }
  for (var helperKey in helpers) {
    Handlebars.registerHelper(helperKey, helpers[helperKey]);
  }
  return Promise.resolve(Handlebars.helpers);
}

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

/**
 * Register partials and helpers per opts
 *
 * @param {Object} opts Drizzle options
 * @return {Promise} resolves to {Object} Handlebars instance
 */
function prepareTemplates (opts) {
  var templateOpts = opts.templates;
  return Promise.all([
    prepareHelpers(templateOpts.handlebars, templateOpts.helpers),
    preparePartials(templateOpts.handlebars, templateOpts.partials)
  ]).then(handlebarsInfo => {
    return templateOpts.handlebars;
  });
}

export { prepareTemplates, prepareHelpers, preparePartials };
