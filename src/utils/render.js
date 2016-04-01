function applyTemplate (template, context, options) {
  if (typeof template !== 'function') {
    template = compileTemplate(template, options);
  }
  return template(context);
}

function compileTemplate (template, options) {
  return options.handlebars.compile(template);
}

export { applyTemplate,
         compileTemplate };
