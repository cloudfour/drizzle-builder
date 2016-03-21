import path from 'path';
import { applyTemplate } from '../render/templates';
import { write } from './utils';

function isPage (obj) {
  return (typeof obj === 'object' &&
    obj.resourceType &&
    obj.resourceType === 'page');
}

/**
 * TODO: Move to another module, separate out fs stuff
 */
function writePage (page, drizzleData) {
  const templateContext = Object.assign({}, drizzleData.context, page);
  const compiled = applyTemplate(page.contents,
    templateContext, drizzleData.options);
  const outputPath = path.normalize(path.join(
    drizzleData.options.dest,
    page.outputPath));
  return write(outputPath, compiled);
}

/**
 * TODO: Comment
 */
function writePages (pages, drizzleData, writePromises = []) {
  if (isPage(pages)) {
    return writePage(pages, drizzleData);
  }
  for (var pageKey in pages) {
    writePromises = writePromises.concat(
      writePages(pages[pageKey], drizzleData, writePromises));
  }
  return writePromises;
}

/**
 * TODO: Comment
 * TODO: Better resolve/return value
 */
function pages (drizzleData) {
  return Promise.all(writePages(drizzleData.pages, drizzleData))
    .then(() => {
      return drizzleData;
    });
}

export default pages;
