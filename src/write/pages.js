import { writeResource } from '../utils/write';

const isPage = page => page.hasOwnProperty('contents');

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
function walkPages (pages, drizzleData, currentKeys = [], writePromises = []) {
  if (isPage(pages)) {
    return writeResource(currentKeys, pages, drizzleData.options.dest.pages);
  }
  for (var pageKey in pages) {
    currentKeys.push(pageKey);
    writePromises = writePromises.concat(
      walkPages(pages[pageKey], drizzleData, currentKeys, writePromises));
  }
  return writePromises;
}

function writePages (drizzleData) {
  return Promise.all(walkPages(drizzleData.pages, drizzleData))
    .then(() => drizzleData);
}

export default writePages;
