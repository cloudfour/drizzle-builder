import * as utils from './utils';
import Promise from 'bluebird';

function isPage (obj) {
  return (typeof obj === 'object' &&
    obj.resourceType &&
    obj.resourceType === 'page');
}

function writePage (page, drizzleData) {
  console.log('writing page', page.outputPath);
}

function writePages (pages, drizzleData) {
  if (isPage(pages)) {
    return writePage(pages, drizzleData);
  }
  for (var pageKey in pages) {
    writePages(pages[pageKey], drizzleData);
  }
  return {}; // TODO
}

function pages (drizzleData) {
  return writePages(drizzleData.context.pages, drizzleData);
}

export default pages;
