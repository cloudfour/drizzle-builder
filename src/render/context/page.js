/**
 * Build local context for rendering a page.
 * @param {Object} page  Page data object
 * @param {Object}       All drizzle data
 * @return {Object}      Context object
 */
function pageContext (page, drizzleData) {
  const context = Object.assign({}, page);
  if (typeof page.data === 'object') {
    for (const dataKey in page.data) {
      context[dataKey] = page.data[dataKey];
    }
  }
  context.drizzle = drizzleData;
  return context;
}

export default pageContext;
