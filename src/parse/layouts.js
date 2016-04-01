import { readFilesKeyed } from '../utils/parse';

function parseLayouts (options) {
  return readFilesKeyed(options.src.layouts, options);
}

export default parseLayouts;
