/**
 * Build the proper context for rendering a collection.
 *
 * @param {Object} collection  The collection object
 * @param {Object} drizzleData All drizzle data
 * @return {Object} context object
 */
function collectionContext (collection, drizzleData) {
  const context = Object.assign({}, collection);
  context.drizzle = drizzleData;
  return context;
}

export default collectionContext;
