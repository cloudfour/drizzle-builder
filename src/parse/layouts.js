import * as utils from '../utils';

function parseLayouts (options) {
  return utils.readFilesKeyed(options.src.layouts, options);
}

export default parseLayouts;
