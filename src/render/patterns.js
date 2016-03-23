import * as renderUtils from './utils';

/**
 *
 */
function renderPatternCollection (patterns, drizzleData, collectionKey) {
  patterns.contents = renderUtils.applyTemplate(`
    {{#extend "default"}}
      {{#content "body"}}
        {{#each items}}
          {{id}}
        {{/each}}
      {{/content}}
    {{/extend}}`,
    renderUtils.localContext(patterns, drizzleData),
    drizzleData.options);
  // console.log(patterns.contents);
}

/**
 *
 */
function walkPatterns (patterns, drizzleData, currentKey = 'patterns') {
  for (var patternKey in patterns) {
    if (patternKey === 'items') {
      renderPatternCollection(patterns, drizzleData, currentKey);
    } else {
      walkPatterns(patterns[patternKey], drizzleData, patternKey);
    }
  }
  return drizzleData;
}

function renderPatterns (drizzleData) {
  return walkPatterns(drizzleData.patterns, drizzleData);
}

export default renderPatterns;
