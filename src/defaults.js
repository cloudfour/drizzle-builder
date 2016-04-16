import parsers from './parse/parsers';

const defaults = {
  beautifier: {
    indent_size: 2,
    indent_char: ' ',
    indent_with_tabs: false,
    unformatted:
      `a abbr acronym address b bdo big cite code col del dfn dt em font
      h1 h2 h3 h4 h5 h6 i img ins kbd mark pre q s samp small span
      strike strong sub sup tt u var`.split(' ')
  },
  debug: {
    logFn: console.log
  },
  dest          : {
    collections: './dist/patterns',
    pages   : './dist/pages',
    patterns: './dist/patterns'
  },
  fieldParsers  : { },
  helpers       : {},
  layouts: {
    page      : 'default',
    collection: 'collection'
  },
  parsers       : parsers,
  src: {
    data    : {
      basedir: 'src/data',
      glob: 'src/data/**/*'
    },
    pages   : {
      basedir: 'src/pages',
      glob: 'src/pages/**/*'
    },
    patterns: {
      basedir: 'src/patterns',
      glob: 'src/patterns/**/*.html'
    },
    templates: {
      basedir: 'src/templates',
      glob: 'src/templates/**/*'
    }
  }
};

/*
 * The following are undocumented because it is not anticipated they'll
 * change in common usage.
 */
defaults.keys = {
  collections: {
    singular: 'collection',
    plural: 'collections'
  },
  data: {
    singular: 'data',
    plural: 'data'
  },
  pages      : {
    singular: 'page',
    plural: 'pages'
  },
  patterns   : {
    singular: 'pattern',
    plural: 'patterns'
  },
  templates  : {
    singular: 'template',
    plural: 'templates'
  }
};

export default defaults;
