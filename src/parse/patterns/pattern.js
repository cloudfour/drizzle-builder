import { resourceId } from '../../utils/object';
import { keyname, titleCase } from '../../utils/shared';

/**
 * If any of the pattern's data fields are objects containing a 'parser'
 * key, run the string in `contents` through the indicated parser function and
 * set the value of the field to the resulting string. Mutates pattern.data.
 *
 * @param {Object} pattern    pattern object
 * @param {Object} options
 * @return {Object} Updated pattern
 */
function parseDataFields (pattern, options) {
  pattern.data = pattern.data || {};
  for (const dataKey in pattern.data) {
    const field = pattern.data[dataKey];
    if (typeof field === 'object' &&
      field.hasOwnProperty('parser')) {
      if (!options.parsers.hasOwnProperty(field.parser)) {
        // TODO Here's a hook for error handling
      } else if (!field.hasOwnProperty('contents')) {
        // TODO again
      } else {
        // Replace the data field with the contents run through the parser.
        pattern.data[dataKey] = options.parsers[field.parser]
          .parseFn(field.contents).contents;
      }
    }
  }
  return pattern;
}

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
function parsePattern (patternFile, patternData, relativeRoot, options) {
  let parsedPattern = Object.assign(
    patternFile,
    {
      id: resourceId(patternFile, relativeRoot, 'patterns'),
      name: patternName(patternFile)
    }
  );
  parsedPattern = parseDataFields(parsedPattern, options);
  return parsedPattern;
}

export default parsePattern;
