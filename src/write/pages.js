import { writePage } from '../utils/write';
import DrizzleError from '../utils/error';

const isPage = page => page.hasOwnProperty('contents');

/**
 * Traverse pages object and write out any page objects to files. An object
 * is considered a page if it has a `contents` property.
 *
 * @param {Object} pages   current level of pages tree
 * @param {Object} drizzleData
 * @param {Array} writePromises All write promises so far
 * @return {Array} of Promises
 */
function walkPages(pages, drizzleData, writePromises = []) {
  if (isPage(pages)) {
    return writePage(
      pages.id,
      pages,
      drizzleData.options.dest.pages,
      drizzleData.options.keys.pages.plural
    );
  }
  for (var pageKey in pages) {
    writePromises = writePromises.concat(
      walkPages(pages[pageKey], drizzleData, writePromises)
    );
  }
  return writePromises;
}

/**
 * Write out HTML pages for pages data.
 *
 * @param {Object} drizzleData
 * @return {Promise} resolving to drizzleData
 */
function writePages(drizzleData) {
  return Promise.all(walkPages(drizzleData.pages, drizzleData)).then(
    () => drizzleData,
    error => DrizzleError.error(error, drizzleData.options.debug)
  );
}

export default writePages;
