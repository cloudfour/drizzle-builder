import { readFilesKeyed } from '../utils/parse';

function parseData (options) {
  return readFilesKeyed(options.src.data, options);
}

export default parseData;
