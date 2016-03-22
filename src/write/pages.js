import path from 'path';
import { write } from './utils';
import * as utils from '../utils';

/**
 * Figure out the output path for `page` and write it to the filesystem.
 * @TODO options.keys is still dumb
 * @TODO hard-coded `.html` OK?
 *
 * @param {Object} page         Will be mutated
 * @param {Object} drizzleData
 * @param {String} entryKey     The keyname (filename) of the file
 * @return {Promise} for file write
 */
function writePage (page, drizzleData, entryKey) {
  const keys       = utils.relativePathArray(
    page.path, drizzleData.options.keys.pages);
  keys.shift();
  const outputPath = path.join(keys.join(path.sep), entryKey + '.html');
  const fullPath = path.normalize(path.join(
    drizzleData.options.dest,
    outputPath));
  page.outputPath = fullPath;
  return write(fullPath, page.contents);
}

/**
 * Traverse pages object and write out any page objects to files. An object
 * is considered a page if it has a `contents` property.
 *
 * @param {Object} pages   current level of pages tree
 * @param {Object} drizzleData
 * @param {String} currentKey  This is a bit inelegant, but we need to keep
 *                             track of the current object's key in the owning
 *                             object because it will be part of the filename(s)
 * @param {Array} writePromises All write promises so far
 * @return {Array} of Promises
 */
function walkPages (pages, drizzleData, currentKey = null, writePromises = []) {
  if (pages.contents) {
    return writePage(pages, drizzleData, currentKey);
  }
  for (var pageKey in pages) {
    writePromises = writePromises.concat(
      walkPages(pages[pageKey], drizzleData, pageKey, writePromises));
  }
  return writePromises;
}

/**
 * TODO: Better resolve/return value
 */
function writePages (drizzleData) {
  return Promise.all(walkPages(drizzleData.pages, drizzleData))
    .then(() => {
      return drizzleData;
    });
}

export default writePages;
