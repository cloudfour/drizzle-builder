import Handlebars from 'handlebars';
import parsers from './parse/parsers';

const defaults = {
  beautifier: {
    indent_size: 1,
    indent_char: '	',
    indent_with_tabs: true
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
      basedir: 'data',
      glob: 'src/data/**/*'
    },
    layouts : {
      basedir: 'layouts',
      glob: 'src/layouts/**/*'
    },
    pages   : {
      basedir: 'pages',
      glob: 'src/pages/**/*'
    },
    partials: {
      basedir: 'partials',
      glob: 'src/partials/**/*'
    },
    patterns: {
      basedir: 'patterns',
      glob: 'src/patterns/**/*.html'
    }
  }
};

export default defaults;
