import yaml from 'js-yaml';
import { readFilesKeyed } from './utils';

/**
 * Take glob in dataOpts and parse all data from matching files as YAML.
 *
 * @param {glob} dataOpts
 * @return {Promise} resolving to object of parsed data
 */
function prepareData (dataGlob) {
  return readFilesKeyed(dataGlob, {
    contentFn: yaml.safeLoad
  });
}

export default prepareData;
