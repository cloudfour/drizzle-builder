import * as renderUtils from './utils';

/**
 * Wrap the page's current contents with an `extend` helper
 * so that it extends its layout. If no layout was set in frontmatter,
 * a default will be used. Any hbs template can be used as the layout
 * for a page as long as it contains a `#block` with the id of `body`.
 */
function wrapWithLayout (page, drizzleData) {
  const layout = page.layout || 'default'; // TODO option for default default
  const alreadyWrapped = new RegExp(
    `{{\\s*#extend\\s*[\'\"]${layout}[\'\"].*}}`)
    .test(page.contents);
  const wrapped = (alreadyWrapped) ? page.contents : `  {{#extend '${layout}' }}
    {{#content 'body'}}${page.contents}{{/content}}
  {{/extend}}`;
  return wrapped;
}

/**
 * Render an individual page: replace its `contents` property
 * with compiled contents
 */
function renderPage (page, drizzleData) {
  page.contents = renderUtils.applyTemplate(
    wrapWithLayout(page, drizzleData),
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
