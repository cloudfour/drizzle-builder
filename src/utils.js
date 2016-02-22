/**
 * Convert str to title case (every word will be capitalized)
 * @param {String} str
 * @return {String}
 */
const toTitleCase = str => str
  .toLowerCase()
  .replace(/(\-|_)/g, ' ')
  .replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.substr(1));

export { toTitleCase };
