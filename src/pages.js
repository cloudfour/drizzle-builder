import { applyTemplate } from './template';
import path from 'path';
import Promise from 'bluebird';
/* TODO: FS stuff in separate module */
import {writeFile as writeFileCB} from 'fs';
import {mkdirp as mkdirpCB} from 'mkdirp';
var writeFile = Promise.promisify(writeFileCB);
var mkdirp    = Promise.promisify(mkdirpCB);

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
  mkdirp(path.dirname(outputPath));
  return writeFile(outputPath, compiled);
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
  return Promise.all(writePages(drizzleData.context.pages, drizzleData))
    .then(() => {
      return true;
    });
}

export default pages;
