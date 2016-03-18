import marked from 'marked';

/**
 * Given an object representing a page or pattern or other file:
 * If that object has a `data` property, use that to
 * create the right kind of context for the object. Process relevant fields
 * with markdown.
 */
function parseLocalData (fileObj, options) {
  const mdFields = options.markdownFields || [];
  if (fileObj.data && typeof fileObj.data === 'object') {
    // First, clean up data object by running markdown over relevant fields
    mdFields.forEach(mdField => {
      if (fileObj.data[mdField]) {
        fileObj.data[mdField] = marked(fileObj.data[mdField]);
      }
    });
    for (var dataKey in fileObj.data) {
      fileObj[dataKey] = fileObj.data[dataKey];
    }
    delete fileObj.data;
  }
  return fileObj;
}

export { parseLocalData };
