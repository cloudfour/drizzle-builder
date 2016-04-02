import handlebarsLayouts from 'handlebars-layouts';
import { keyname } from '../utils/shared';
import { readFiles } from '../utils/parse';

function prepareLayouts (Handlebars, layouts = '') {
  // Register helper for layouts, from the module
  Handlebars.registerHelper(handlebarsLayouts(Handlebars));

  // Add layouts as partials
  return readFiles(layouts).then(layoutFiles => {
    layoutFiles.forEach(partialFile => {
      const partialKey = keyname(partialFile.path);
      // TODO: These should be keyed better
      Handlebars.registerPartial(partialKey, partialFile.contents);
    });
    return Handlebars.partials;
  });
}

export default prepareLayouts;
