'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var parseOptions = require('./options');
var prepareTemplates = require('./template').prepareTemplates;
var utils = require('./utils');

/**
 * Build the drizzle output
 *
 * @return {Promise}; resolves to options {object} (for now)
 */
function drizzle(options) {
  var opts = parseOptions(options);

  // const buildData = new Object();
  // const readLayouts = utils.readFilesKeyed(opts.templates.layouts)
  //   .then(fileData => buildData.layouts = fileData);
  // const readDocs = utils.readFilesKeyed(opts.docs)
  //   .then(fileData => {
  //     for (var file in fileData) {
  //       fileData[file].name = utils.toTitleCase(file);
  //       fileData[file].content = 'todo'; // markdown file.content
  //     }
  //     return fileData;
  //   });
  // const readData = utils.readFilesKeyed(opts.data).then(fileData =>  {
  //   for (var file in fileData) {
  //     fileData[file].contents = 'todo'; // yaml load contents
  //   }
  //   return fileData;
  // });
  return prepareTemplates(opts).then(function (handlebars) {
    return opts;
  });
}

exports.default = drizzle;
module.exports = exports['default'];