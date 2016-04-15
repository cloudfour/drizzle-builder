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

function walkResources (resources, options, resourceType, resourceTree = {}) {
  for (var resourceKey in resources) {
    if (resources[resourceKey].resourceType &&
      resources[resourceKey].resourceType === resourceType) {
      resourceTree.items = resourceTree.items || [];
      resourceTree.items.push({
        id: resources[resourceKey].id,
        key: resourceKey,
        resource: resources[resourceKey]
      });
    } else {
      resourceTree.children = resourceTree.children || [];
      resourceTree.children.push(
        walkResources(resources[resourceKey], options,
          resourceType, resourceTree[resourceKey])
      );
    }
  }
  return resourceTree;
}

function parseTree (allData, options) {
  const dataObj = {
    data     : allData[0],
    pages    : allData[1],
    patterns : allData[2],
    templates: allData[3],
    tree: {
      pages: walkResources(allData[1], options, options.keys.pages.singular),
      collections: walkResources(
        allData[2], options, options.keys.collections.singular)
    },
    options  : options
  };
  return dataObj;
}


export default parseTree;
