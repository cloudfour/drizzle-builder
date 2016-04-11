# drizzle-builder

Transform source patterns and pages into static HTML output.

## Install

```
$ npm install --save drizzle-builder
```

## Usage

```javascript
import drizzle from 'drizzle-builder';

drizzle(options).then(drizzleData => {
  // drizzleData object contains data about the build
});
```

## API

### drizzle([options])

* `options {Object}`
* return: `Promise` resolving to `{Object}` of build data

## options

All `options` are optional.

### `beautifier`

`{Object}` of options to pass to `js-beautify`, which is used to pretty-fy source code.

Default:
```
beautifier: {
  indent_size: 1,
  indent_char: '	',
  indent_with_tabs: true
}
```

### `debug`

`{Object}`

Default:

```
debug: {
  logFn: console.log
}
```

* `logFn` `{Function}` that takes a `msg` argument. Defaults to `console.log`. You could change this if you wanted messages and errors to go somewhere else.

### `dest`

`{Object}` of `{String}` paths for outputting drizzle `pages` and pattern `collection` HTML files.

Can be relative to project root.

Default:

```
dest: {
  pages   : './dist',
  patterns: './dist/patterns'
}
```

### `layouts`

An `{Object}` associating different drizzle output page types with their _default_ layout (template). Currently relevant for `page` and `collection`. String values correspond to the filename (minus extension) of the layout under the `src.layouts` directory/glob.

Defaults to:
```
layouts: {
  page      : 'default',
  collection: 'collection'
}
```

### `parsers`

An `{Object}` of `parser` objects for parsing different kinds of source files. Any passed here will extend the default [`parsers`](src/parse/parsers.js).

@TODO: More docs here

```
parsers       : parsers
```

### `src`

`{Object}` source globs and "basedirs" for different types of drizzle resources.

The `glob` property is probably more straightforward: that's a glob to match files of that type of resource.
The `basedir` property is directory level to start keying the associated object from—sort of like a "relative path" to use as a root for keying the resources. It should be a `{string}` that matches one of the directories in the `glob` expression.

The default value of the `src.patterns` property, e.g.:
```
patterns: {
  glob: 'src/patterns/**/*.html',
  basedir: 'patterns'
}
```

indicates, e.g., that we should consider all pattern resources "relative" to the directory "patterns" and start the keying of the `patterns` object from there. *Note*: You can leave `basedir` alone unless you make significant changes to `glob`s from default.

`src` properties include:

* `data`: data files that contain (typically) YAML or JSON data to make available on drizzleData global context.
* `layouts`: layouts to register as partials on `handlebars`
* `pages`: source page files (typically Handlebars with YAML frontmatter) to transform into HTML pages.
* `partials`: files to register as partials on `handlebars`.
* `patterns`: patterns.

Default:

```
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
```

## drizzleData

`drizzle()` returns a `Promise` resolving to an `Object` (`drizzleData`) representing the data about the build.

### Properties

* `options`: The `options` the build was ultimately created with.
* `data`: Parsed data from data source files.
* `layouts`: Contents of parsed layout files and their metadata.
* `pages`: Contents of parsed page source files and their metadata.
* `patterns`: Hierarchical structure of patterns, their containing collections and metadata.

## Development

### Useful npm scripts

* `npm build`: `babel`-ize `src` into `dist`
* `npm test`: `build`, then run `mocha` tests
