import path from 'path';
import { write } from './utils';
import * as utils from '../utils';

/**
 *
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
 * TODO: Comment
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
 * TODO: Comment
 * TODO: Better resolve/return value
 */
function writePages (drizzleData) {
  return Promise.all(walkPages(drizzleData.pages, drizzleData))
    .then(() => {
      return drizzleData;
    });
}

export default writePages;
