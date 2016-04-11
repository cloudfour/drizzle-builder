import mergeOptions from './options';
import prepare from './prepare/';
import render from './render/';
import parse from './parse/';
import write from './write/';

/**
 * Build the drizzle! This will:
 * - Parse and merge passed options with defaults
 * - Prepare templating—partials, templates, helpers
 * - Parse files—data, patterns, pages, layouts—and organize a data object
 * - Render templates, collections, pages
 * - Write rendered data to the filesystem
 *
 * @param {Object} options   User options for the build
 * @return {Promise} resolving to {Object} of all data generated and used
 */
function drizzle (options) {
  const opts = mergeOptions(options);
  // @TODO: Ultra temporary
  opts.handlebars = require('handlebars');
  return prepare(opts).then(parse).then(render).then(write);
}

export default drizzle;
