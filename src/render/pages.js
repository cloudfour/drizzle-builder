import * as renderUtils from './utils';

/**
 * Wrap the page's current contents with an `extend` helper
 * so that it extends its layout. If no layout was set in frontmatter,
 * a default will be used. Any hbs template can be used as the layout
 * for a page as long as it contains a `#block` with the id of `body`.
 *
 * If the page's contents already contains an `{{#extend}}` helper invocation
 * keyed to its layout (e.g. `{{#extend 'foo'}}` if the page's layout was set
 * to `foo` in frontMatter, it will not double-wrap it. This is to prevent
 * errors if a designer/developer creates a page file with the `{{#extend}}`
 * already in it.
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
 * with compiled contents. Mutates the passed page object.
 *
 * @param {Object} page        Data for this page
 * @param {Object} drizzleData All parsed data
 * @return {String} compiled/rendered page contents.
 */
function renderPage (page, drizzleData) {
  page.contents = renderUtils.applyTemplate(
    wrapWithLayout(page, drizzleData),
    renderUtils.localContext(page, drizzleData),
    drizzleData.options);
  return page.contents;
}

/**
 * Traverse pages data object. render individual pages. An object is
 * considered a "page" if it has a `contents` property (otherwise it
 * is treated as a (sub-)directory).
 *
 * @param {Object} pages       pages objects at current level of traverse
 * @param {Object} drizzleData all data
 * @return {Object} drizzleData, mutated to include updated contents from render
 */
function walkPages (pages, drizzleData) {
  if (pages.contents) {
    return renderPage(pages, drizzleData);
  }
  for (var pageKey in pages) {
    walkPages(pages[pageKey], drizzleData);
  }
  return drizzleData.pages;
}

function renderPages (drizzleData) {
  return walkPages(drizzleData.pages, drizzleData);
}

export default renderPages;
