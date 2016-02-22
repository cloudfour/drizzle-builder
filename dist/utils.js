'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Convert str to title case (every word will be capitalized)
 * @param {String} str
 * @return {String}
 */
var toTitleCase = function toTitleCase(str) {
  return str.toLowerCase().replace(/(\-|_)/g, ' ').replace(/\w\S*/g, function (word) {
    return word.charAt(0).toUpperCase() + word.substr(1);
  });
};

exports.toTitleCase = toTitleCase;