var Handlebars = require('handlebars');

const defaults = {
  templates: {
    handlebars: Handlebars,
    helpers: {},
    layouts: ['src/layouts/*'],
    pages: ['src/pages/**/*'],
    partials: ['src/views/partials/includes/*']
  }
};

const translateOptions = options => {
  const templateOptionMap = {
    handlebars    : 'handlebars',
    helpers       : 'helpers',
    layouts       : 'layouts',
    layoutIncludes: 'partials',
    views         : 'pages'
  };
  options.templates = options.templates || {};
  Object.keys(templateOptionMap).map(templateOptionKey => {
    if (options[templateOptionKey]) {
      options.templates[templateOptionKey] = options[templateOptionKey];
      delete options[templateOptionKey];
    }
  });
  return options;
};

const parseOptions = options => {
  options         = translateOptions(options);
  const opts      = new Object();
  const templates = Object.assign(defaults.templates, options.templates);
  opts.templates  = templates;
  return opts;
};

export default parseOptions;
