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

function parseTree (allData, options) {
  const dataObj = {
    data     : allData[0],
    pages    : allData[1],
    patterns : allData[2],
    templates: allData[3],
    options  : options
  };
  return dataObj;
}


export default parseTree;
