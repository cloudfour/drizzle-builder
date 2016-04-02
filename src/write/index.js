import writePages from './pages';
import writeCollections from './collections';

/**
 * Write pages and collection-pages to filesystem
 * @param {Object} drizzleData All drizzle data so far
 * @return {Promise} resolving to drizzleData
 */
function write (drizzleData) {
  return Promise.all([
    writePages(drizzleData),
    writeCollections(drizzleData)
  ]).then(() => drizzleData);
}

export default write;
