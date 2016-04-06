import Handlebars from 'handlebars';
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
  handlebars    : Handlebars,
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
    layouts : {
      basedir: 'src/layouts',
      glob: 'src/layouts/**/*'
    },
    pages   : {
      basedir: 'src/pages',
      glob: 'src/pages/**/*'
    },
    partials: {
      basedir: 'src/partials',
      glob: 'src/partials/**/*'
    },
    patterns: {
      basedir: 'src/patterns',
      glob: 'src/patterns/**/*.html'
    }
  }
};

export default defaults;
