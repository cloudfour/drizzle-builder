function collectionContext (collection, drizzleData) {
  const context = Object.assign({}, collection);
  context.drizzle = drizzleData;
  return context;
}

export default collectionContext;
