import writePages from './pages';
import writeCollections from './collections';

function write (drizzleData) {
  return Promise.all([
    writePages(drizzleData),
    writeCollections(drizzleData)
  ]).then(() => drizzleData);
}

export default write;
