function pageContext (page, drizzleData) {
  const context = Object.assign({}, page);
  context.drizzle = drizzleData;
  return context;
}

export default pageContext;
