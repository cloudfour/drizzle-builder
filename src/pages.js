import { applyTemplate } from './template';

function isPage (obj) {
  return (typeof obj === 'object' &&
    obj.resourceType &&
    obj.resourceType === 'page');
}

function writePage (page, drizzleData) {
  const templateContext = Object.assign({}, drizzleData.context, page);
  const compiled = applyTemplate(page.contents,
    templateContext, drizzleData.options);
  return compiled;
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
