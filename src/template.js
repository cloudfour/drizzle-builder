var globby = require('globby');
var path  = require('path');

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
const prepareHelpers = (Handlebars, helpers = {}) => {
  if (typeof helpers === 'string') {
    helpers = Array.of(helpers);
  }
  if (Array.isArray(helpers)) {
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
};

const prepareLayouts = () => {};
const preparePartials = () => {};

const prepareTemplates = opts => {
  prepareHelpers(opts.templates && opts.templates.helpers);
  prepareLayouts(opts);
  preparePartials(opts);
};

export default prepareTemplates;
export { prepareHelpers };
