import { deepPattern } from '../utils/object';
import patternContext from '../render/context/pattern';

/**
 * Retrieve correct pattern object data, find the right partial and
 * compile with correct local context.
 */
function renderPatternPartial (patternId, drizzleData, Handlebars) {
  const patternObj = deepPattern(patternId, drizzleData.patterns);
  const localContext = patternContext(patternObj, drizzleData);
  let template = Handlebars.partials[patternId];
  if (template) {
    if (typeof template !== 'function') {
      template = Handlebars.compile(template);
    }
    // Render and return
    return template(localContext);
  }
}

/**
 * Register some drizzle-specific pattern helpers
 */
function registerPatternHelpers (Handlebars) {
  /**
   * The `pattern` helper allows the embedding of patterns anywhere
   * and they can get their correct local context.
   */
  Handlebars.registerHelper('pattern', (id, rootContext, opts) => {
    const renderedTemplate = renderPatternPartial(
      id, rootContext.drizzle, Handlebars);
    return renderedTemplate;
  });
  /**
   * Similar to `pattern` but the returned string is HTML-escaped.
   * Can be used for rendering source in `<pre>` tags.
   */
  Handlebars.registerHelper('patternSource', (id, rootContext, opts) => {
    const renderedTemplate = renderPatternPartial(
      id, rootContext.drizzle, Handlebars);
    return Handlebars.Utils.escapeExpression(renderedTemplate);
  });
  return Handlebars;
}

export default registerPatternHelpers;
