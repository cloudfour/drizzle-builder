import marked from 'marked';

/**
 * Given an object representing a page or pattern or other file:
 * If that object has a `data` property, use that to
 * create the right kind of context for the object. Process relevant fields
 * with markdown.
 */
function parseLocalData (fileObj, options, extendedData = {}) {
  const mdFields = options.markdownFields || [];
  const localData = Object.assign({}, fileObj.data);
  // First, clean up data object by running markdown over relevant fields
  // TODO: This feels awkward here
  // Move to render?
  mdFields.forEach(mdField => {
    if (localData[mdField]) {
      localData[mdField] = marked(localData[mdField]);
    }
  });
  fileObj = Object.assign(localData, fileObj, extendedData);
  return fileObj;
}

export { parseLocalData };
