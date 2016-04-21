import deepExtend from 'deep-extend';
import defaults from './defaults';
import Promise from 'bluebird';
import Handlebars from 'handlebars';
import path from 'path';

/**
 * For relative pathing to work, let's convert all paths in src options to
 * absolute paths, if they are not already.
 * @param {Object} opts   Mutated in place.
 */
function normalizePaths (opts) {
  for (var srcKey in opts.src) {
    if (!path.isAbsolute(opts.src[srcKey].glob)) {
      opts.src[srcKey].glob = path.resolve(opts.src[srcKey].glob);
    }
    if (!path.isAbsolute(opts.src[srcKey].basedir)) {
      opts.src[srcKey].basedir = path.resolve(opts.src[srcKey].basedir);
    }
  }
}

/**
 * Merge defaults into passed options.
 * @param {Object} options
 * @param {Object} handlebars   Handlebars instance—it can be passed explicitly,
 *                              primarily for testing purposes.
 * @return {Promise} resolving to merged options
 */

function init (options = {}, handlebars) {
  const opts = deepExtend({}, defaults, options);
  normalizePaths(opts);
  opts.handlebars = handlebars || Handlebars.create();
  return Promise.resolve(opts);
}

export default init;
