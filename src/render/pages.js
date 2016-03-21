import * as templates from './templates';

function renderPage (page, drizzleData) {
  page.contents = templates.applyTemplate(page.contents,
    templates.localContext(page, drizzleData),
    drizzleData.options);
}

function walkPages (pages, drizzleData) {
  if (pages.contents) {
    return renderPage(pages, drizzleData);
  }
  for (var pageKey in pages) {
    walkPages(pages[pageKey], drizzleData);
  }
  return drizzleData;
}

function renderPages (drizzleData) {
  return walkPages(drizzleData.pages, drizzleData);
}

export default renderPages;
