import writePages from './pages';
import writeCollections from './collections';

import DrizzleError from '../utils/error';

/**
 * Write pages and collection-pages to filesystem.
 *
 * @param {Object} drizzleData All drizzle data so far
 * @return {Promise} resolving to drizzleData
 */
function write (drizzleData) {
  return Promise.all([
    writePages(drizzleData),
    writeCollections(drizzleData)
  ]).then(
    () => drizzleData,
    error => new DrizzleError(error).handle(drizzleData.options.debug)
  );
}

export default write;
