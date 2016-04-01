import Handlebars from 'handlebars';
import parsers from './parse/parsers';

const defaults = {
  src: {
    data    : ['src/data/**/*'],
    layouts : ['src/layouts/**/*'],
    pages   : ['src/pages/**/*'],
    partials: ['src/partials/**/*'],
    patterns: ['src/patterns/**/*.html']
  },
  dest          : 'dist',
  destPaths     : {
    pages   : '',
    patterns: 'patterns/'
  },
  handlebars    : Handlebars,
  helpers       : {},
  markdownFields: ['notes'],
  parsers       : parsers
};

export default defaults;
