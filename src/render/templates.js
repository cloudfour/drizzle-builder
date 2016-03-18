
function applyTemplate (template, context, options) {
  if (typeof template !== 'function') {
    template = options.handlebars.compile(template);
  }
  return template(context);
}

export { applyTemplate };
