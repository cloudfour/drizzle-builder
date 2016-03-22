import * as utils from '../utils';

function parseData (options) {
  return utils.readFilesKeyed(options.src.data, options);
}

export default parseData;
