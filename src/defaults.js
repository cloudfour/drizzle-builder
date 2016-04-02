import Handlebars from 'handlebars';
import parsers from './parse/parsers';

const defaults = {
  beautifier: {
    indent_size: 1,
    indent_char: '	',
    indent_with_tabs: true
  },
  dest          : 'dist',
  destPaths     : {
    pages   : '',
    patterns: 'patterns/'
  },
  handlebars    : Handlebars,
  helpers       : {},
  markdownFields: ['notes'],
  parsers       : parsers,
  src: {
    data    : ['src/data/**/*'],
    layouts : ['src/layouts/**/*'],
    pages   : ['src/pages/**/*'],
    partials: ['src/partials/**/*'],
    patterns: ['src/patterns/**/*.html']
  }
};

export default defaults;
