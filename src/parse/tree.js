/**
 * Build an object representing the upcoming output tree
 * @module parse/tree
 */

/**
return {
  data      : allData[0],
  pages     : allData[1],
  patterns  : allData[2],
  templates : allData[3],
  options   : options
};
**/

function walkResources(resources, options, resourceType, resourceTree = []) {
  for (var resourceKey in resources) {
    const item = resources[resourceKey];
    if (item.resourceType && item.resourceType === resourceType.singular) {
      resourceTree.push(item);
    } else {
      walkResources(item, options, resourceType, resourceTree);
    }
  }
  return resourceTree;
}

function parseTree(allData, options) {
  const dataObj = {
    data: allData[0],
    pages: allData[1],
    patterns: allData[2],
    templates: allData[3],
    tree: {
      pages: walkResources(allData[1], options, options.keys.pages),
      collections: walkResources(allData[2], options, options.keys.collections)
    },
    options: options
  };
  return dataObj;
}

export default parseTree;
