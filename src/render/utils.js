import {html as prettyHTML } from 'js-beautify';

function applyTemplate (template, context, options) {
  if (typeof template !== 'function') {
    template = compileTemplate(template, options);
  }
  return template(context);
}

function compileTemplate (template, options) {
  return options.handlebars.compile(template);
}

function localContext (localData, drizzleData) {
  return Object.assign({}, drizzleData, localData);
}

export { applyTemplate,
         compileTemplate,
         localContext };
