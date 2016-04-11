import parsers from './parse/parsers';

const defaults = {
  beautifier: {
    indent_size: 1,
    indent_char: '	',
    indent_with_tabs: true
  },
  debug: {
    logFn: console.log
  },
  dest          : {
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

export default defaults;
