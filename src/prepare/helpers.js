import * as utils from '../utils';

/**
 * Register helpers on Handlebars. Helpers (helperOpts) can be provided as
 * either:
 * - a glob. Files matching glob will each be require'd and registered on
 *   Handlebars (one helper per module)
 * - an object. Properties are helper names/keys, values should be helper
 *   functions.
 *
 * @param {glob | object} helperOpts
 * @return Promise resolving to the helpers that have been registered
 */
function getHelpers (helperOpts = {}) {
  const helpers = {};
  return new Promise((resolve, reject) => {
    if (utils.isGlob(helperOpts)) {
      utils.getFiles(helperOpts).then(helperPaths => {
        helperPaths.forEach(hPath => {
          helpers[utils.keyname(hPath)] = require(hPath);
        });
        resolve(helpers);
      });
    } else {
      resolve(helperOpts);
    }
  });
}

/**
 * Register helpers on the passed Handlebars instance.
 * Accept an object with helperKey => helperFunctions,
 * or a glob (as Array or string) of files (modules) to
 * register. In the latter case, the filename w/o extension
 * will be used as the helper key.
 *
 * @param {Object} Handlebars handlebars instance
 * @param {glob | Object} helperOpts @see getHelpers
 * @return {Promise} that resolves to all helpers registered on Handlebars
 */
function prepareHelpers (Handlebars, helperOpts = {}) {
  return getHelpers(helperOpts)
    .then(helpers => {
      for (var helper in helpers) {
        Handlebars.registerHelper(helper, helpers[helper]);
      }
      return Handlebars.helpers;
    });
}

export default prepareHelpers;