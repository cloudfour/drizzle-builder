import yaml from 'js-yaml';
import { readFilesKeyed } from './utils';

/**
 * Take glob in dataOpts and parse all data from matching files as YAML.
 *
 * @param {glob} dataOpts
 * @return {Promise} resolving to object of parsed data
 */
function prepareData (dataOpts) {
  const parsedData = new Object();
  return readFilesKeyed(dataOpts).then(fileData => {
    Object.keys(fileData).forEach(fileKey => {
      parsedData[fileKey] = yaml.safeLoad(fileData[fileKey]);
    });
    return parsedData;
  });
}

export default prepareData;
