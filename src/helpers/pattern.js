import * as utils from '../utils';
import patternContext from '../render/context/pattern';

function registerPatternHelper (Handlebars) {
  Handlebars.registerHelper('pattern', (id, rootContext, opts) => {
    // Retrieve pattern object from ID
    const patternObj = utils.deepPattern(id, rootContext.drizzle.patterns);
    if (!patternObj) { // TODO yeah: what then?
      return 'nope';
    }
    // Build a local context TODO Move this
    const localContext = patternContext(patternObj, rootContext.drizzle);

    // Find and work with partial template
    let template = Handlebars.partials[id];
    if (template) {
      if (typeof template !== 'function') {
        template = Handlebars.compile(template);
      }
      // Render and return
      return template(localContext);
    }
  });
  return Handlebars;
}

export default registerPatternHelper;
