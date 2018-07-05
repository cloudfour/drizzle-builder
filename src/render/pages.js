import { applyTemplate } from '../utils/render';
import { resourceContext } from '../utils/context';

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
 *
 * @param {Object} page
 * @param {Object} drizzleData
 * @return {String} wrapped contents
 */
function wrapWithLayout(page, drizzleData) {
  const layout = page.data.layout || drizzleData.options.layouts.page;
  // TODO Add test to see if _any_ extends is extant. Multiple extends
  // for ANY reason will cause handlebars-layouts to asplode.
  const alreadyWrapped = new RegExp(
    `{{\\s*#extend\\s*[\'\"]${layout}[\'\"].*}}`
  ).test(page.contents);
  const wrapped = alreadyWrapped
    ? page.contents
    : `  {{#extend '${layout}' }}
    {{#content 'main'}}${page.contents}{{/content}}
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
function renderPage(page, drizzleData) {
  page.contents = applyTemplate(
    wrapWithLayout(page, drizzleData),
    resourceContext(page, drizzleData),
    drizzleData.options
  );
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
function walkPages(pages, drizzleData) {
  if (typeof pages.contents !== 'undefined') {
    return renderPage(pages, drizzleData);
  }
  for (var pageKey in pages) {
    walkPages(pages[pageKey], drizzleData);
  }
  return drizzleData.pages;
}

/**
 * Walk the pages object and render its contents
 *
 * @param {Object} drizzleData
 * @return {Object} pageData
 */
function renderPages(drizzleData) {
  return walkPages(drizzleData.pages, drizzleData);
}

export default renderPages;
