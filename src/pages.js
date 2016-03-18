import { applyTemplate } from './template';
import path from 'path';
import Promise from 'bluebird';
import {writeFile as writeFileCB} from 'fs';
import {mkdirp as mkdirpCB} from 'mkdirp';
var writeFile = Promise.promisify(writeFileCB);
var mkdirp    = Promise.promisify(mkdirpCB);

function isPage (obj) {
  return (typeof obj === 'object' &&
    obj.resourceType &&
    obj.resourceType === 'page');
}

function writePage (page, drizzleData) {
  const templateContext = Object.assign({}, drizzleData.context, page);
  const compiled = applyTemplate(page.contents,
    templateContext, drizzleData.options);
  const outputPath = path.normalize(path.join(
    drizzleData.options.dest,
    page.outputPath));
  mkdirp(path.dirname(outputPath));
  return writeFile(outputPath, compiled);
}

function writePages (pages, drizzleData) {
  if (isPage(pages)) {
    return writePage(pages, drizzleData);
  }
  for (var pageKey in pages) {
    writePages(pages[pageKey], drizzleData);
  }
  return {};
}

function pages (drizzleData) {
  return writePages(drizzleData.context.pages, drizzleData);
}

export default pages;
