import parsePattern from './pattern';
import * as path from 'path';
import { deepObj, resourceKey } from '../../utils/object';
import { readFiles } from '../../utils/parse';
import { commonRoot, relativePathArray } from '../../utils/path';

/**
 * Read each pattern file. Retrieve a reference to where it goes in the
 * `patternData` object. Create a containing collection if necessary. Add
 * the pattern to the `collection`'s `items` object.
 */
function parsePatterns (options) {
  const patternData = {};
  return readFiles(options.src.patterns.glob, options).then(patternFileData => {
    const relativeRoot = commonRoot(patternFileData);

    patternFileData.forEach(patternFile => {
      const pathElements = relativePathArray(patternFile.path, relativeRoot);
      const parentObj    = deepObj(pathElements, patternData);
      const patternKey   = resourceKey(patternFile);
      // Need a stubbed collection to stick this pattern in
      parentObj.collection = parentObj.collection || {
        items: {},
        path: path.dirname(patternFile.path)
      };
      parentObj.collection.items[patternKey] = parsePattern(
        patternFile, patternData, relativeRoot, options);
    });
    return patternData;
  });
}

export default parsePatterns;
