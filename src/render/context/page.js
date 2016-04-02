/**
 * Build local context for rendering a page.
 * @param {Object} page  Page data object
 * @param {Object}       All drizzle data
 * @return {Object}      Context object
 */
function pageContext (page, drizzleData) {
  const context = Object.assign({}, page);
  context.drizzle = drizzleData;
  return context;
}

export default pageContext;
