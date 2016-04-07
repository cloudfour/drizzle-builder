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
  if (template) {
    if (typeof template !== 'function') {
      template = Handlebars.compile(template);
    }
    // Render and return
    return template(localContext);
  } else {
    new DrizzleError(`Partial for pattern ${patternId} not found`,
      DrizzleError.LEVELS.ERROR).handle(drizzleData.options.debug);
  }
}

/**
 * Register some drizzle-specific pattern helpers
 */
function registerPatternHelpers (options) {
  const Handlebars = options.handlebars;
  if (Handlebars.partials.pattern) {
    new DrizzleError('`Handlebars.partials.pattern` already registered',
      DrizzleError.LEVELS.WARN).handle(options.debug);
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

  if (Handlebars.partials.patternSource) {
    new DrizzleError('`Handlebars.partials.patternSource` already registered',
      DrizzleError.LEVELS.WARN).handle(options.debug);
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
