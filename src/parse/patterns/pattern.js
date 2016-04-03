import { resourceId } from '../../utils/object';
import { keyname, titleCase } from '../../utils/shared';

/**
 * `name` is a specially-recognized key in the pattern
 * that can override naming by filename
 *
 * @param {Object} patternFile
 * @return {String}
 */
function patternName (patternFile) {
  return ((patternFile.data && patternFile.data.name) ||
    titleCase(keyname(patternFile.path)));
}

/**
 * Generate a pattern entry (object) by extending the patternFile
 * with a few things.
 */
function parsePattern (patternFile, patternData, relativeRoot) {
  return Object.assign(
    patternFile,
    {
      id: resourceId(patternFile, relativeRoot, 'patterns'),
      name: patternName(patternFile)
    }
  );
}

export default parsePattern;
