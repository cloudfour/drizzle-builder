import handlebarsLayouts from 'handlebars-layouts';
import { keyname } from '../utils/shared';
import { readFiles } from '../utils/parse';

function prepareLayouts (options) {
  // Register helper for layouts, from the module
  options.handlebars.registerHelper(handlebarsLayouts(options.handlebars));

  // Add layouts as partials
  return readFiles(options.src.layouts).then(layoutFiles => {
    layoutFiles.forEach(partialFile => {
      const partialKey = keyname(partialFile.path);
      // TODO: These should be keyed better
      options.handlebars.registerPartial(partialKey, partialFile.contents);
    });
    return options;
  });
}

export default prepareLayouts;
