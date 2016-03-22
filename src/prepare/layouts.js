import handlebarsLayouts from 'handlebars-layouts';
import * as utils from '../utils';

function prepareLayouts (Handlebars, layouts = '') {
  // Register helper for layouts, from the module
  Handlebars.registerHelper(handlebarsLayouts(Handlebars));

  // Add layouts as partials
  return utils.readFiles(layouts).then(layoutFiles => {
    layoutFiles.forEach(partialFile => {
      const partialKey = utils.keyname(partialFile.path);
      Handlebars.registerPartial(partialKey, partialFile.contents);
    });
    return Handlebars.partials;
  });
}

export default prepareLayouts;
