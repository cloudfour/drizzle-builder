/**
 * Prepare/helpers module.
 * @module prepare/helpers
 */

import { keyname } from '../utils/shared';
import { getFiles, isGlob } from '../utils/parse';
import registerDataHelpers from '../helpers/data';
import registerPageHelpers from '../helpers/page';
import registerPatternHelpers from '../helpers/pattern';
import stringHelpers from '../helpers/string';
import handlebarsLayouts from 'handlebars-layouts';

import DrizzleError from '../utils/error';

/**
 * Register helpers on Handlebars. Helpers (options.helpers) can be provided as
 * either:
 * - a glob. Files matching glob will each be require'd and registered on
 *   Handlebars (one helper per module)
 * - an object. Properties are helper names/keys, values should be helper
 *   functions.
 *
 * @param {Object} options with `helpers` property
 * @return {Promise} resolving to the helpers that have been registered
 */
function getHelpers (options) {
  const helpers = {};
  return new Promise((resolve, reject) => {
    if (isGlob(options.helpers)) {
      getFiles(options.helpers).then(helperPaths => {
        helperPaths.forEach(hPath => {
          helpers[keyname(hPath)] = require(hPath);
        });
        resolve(helpers);
      });
    } else {
      resolve(options.helpers);
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
 * @param {Object} options
 * @return {Promise} that resolves to all helpers registered on Handlebars
 */
function prepareHelpers (options) {
  // Register helper for layouts, from the module
  options.handlebars.registerHelper(handlebarsLayouts(options.handlebars));
  return getHelpers(options)
    .then(helpers => {
      registerPatternHelpers(options);
      registerDataHelpers(options);
      registerPageHelpers(options);

      options.handlebars.registerHelper(
        'ns', stringHelpers.ns(options.handlebars, {prefix: 'drizzle-'})
      );

      for (var helper in helpers) {
        options.handlebars.registerHelper(helper, helpers[helper]);
      }
      return options;
    }, error => DrizzleError.error(error, options.debug));
}

export default prepareHelpers;
