import DrizzleError from '../utils/error';
import { deepPattern } from '../utils/object';
import { patternContext } from '../utils/context';

/**
 * Retrieve correct pattern object data, find the right partial and
 * compile with correct local context.
 * TODO: How do we test this?
 */
function renderPatternPartial (patternId, drizzleData, Handlebars) {
  const patternObj = deepPattern(patternId, drizzleData.patterns);
  const localContext = patternContext(patternObj, drizzleData);
  let template = Handlebars.partials[patternId];
  if (typeof template !== 'undefined') {
    if (typeof template !== 'function') {
      template = Handlebars.compile(template);
    }
    // Render and return
    return template(localContext);
  } else {
    DrizzleError.error(new DrizzleError(
      `Partial for pattern ${patternId} not found`, DrizzleError.LEVELS.ERROR),
      drizzleData.options.debug);
  }
}

/**
 * Register some drizzle-specific pattern helpers
 */
function registerPatternHelpers (options) {
  const Handlebars = options.handlebars;
  if (Handlebars.helpers.pattern) {
    DrizzleError.error(new DrizzleError('`pattern` helper already registered',
      DrizzleError.LEVELS.WARN), options.debug);
  }
  /**
   * The `pattern` helper allows the embedding of patterns anywhere
   * and they can get their correct local context.
   */
  Handlebars.registerHelper('pattern', (id, rootContext, opts) => {
    const renderedTemplate = renderPatternPartial(
      id, rootContext.drizzle, Handlebars);
    return renderedTemplate;
  });

  if (Handlebars.helpers.patternSource) {
    DrizzleError.error(new DrizzleError(
      '`patternSource` helper already registered',
      DrizzleError.LEVELS.WARN), options.debug);
  }
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
