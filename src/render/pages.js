import * as renderUtils from './utils';

/**
 * Render an individual page: replace its `contents` property
 * with compiled contents
 */
function renderPage (page, drizzleData) {
  page.contents = renderUtils.applyTemplate(page.contents,
    renderUtils.localContext(page, drizzleData),
    drizzleData.options);
}

/**
 * Traverse pages data object. render individual pages
 */
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
