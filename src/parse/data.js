import * as utils from '../utils';

function parseData (options) {
  return utils.readFilesKeyed(options.data, options);
}

export default parseData;
