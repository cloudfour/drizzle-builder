# drizzle-builder [![Build Status](https://travis-ci.org/cloudfour/drizzle-builder.svg?branch=master)](https://travis-ci.org/cloudfour/drizzle-builder)

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

## Authoring with Drizzle

### Creating Resources

Drizzle builds static HTML output from source resource files.

* _Pages_ are compiled against a page layout template and output as HTML files.
* _Patterns_ are parsed into collections, which are compiled against a collection layout template and output as HTML files.
* _Data_ files can be used to provide data to patterns and pages.

#### Front Matter, YAML and JSON

Pages and patterns can use YAML front matter to override defaults, set particular attributes or provide arbitrary local data for the resource during template compilation. In general, data defined in front matter is made available at the top level of compilation (template) context for that resource.

##### Reserved Properties

Certain properties are reserved at the top level for Drizzle use. Each resource has its own reserved keys as well, but the following keys should not be used in front matter for any resource:

* `contents`: Used by Drizzle to store parsed and rendered contents for resources.
* `data`: Used for storing pattern- and page-specific data in global objects.
* `drizzle`: The `drizzle` property is reserved for global context during template compilation.
* `outputPath`: Used by Drizzle to record where the resource should be output to the file system.
* `path`: Used by Drizzle to retain the path to the original resource source file.

#### Formats and Parsing

#### Keys and Object Structure

#### Pages

Each file that matches the `pages` glob (`options.src.pages.glob`) will generate an HTML page.

##### Special Properties

* `layout`: Specify the layout template to use for this page resource (default layout templated is defined in `options.layouts.page`).

#### Patterns

##### Special Properties

* `name`: Override default naming for the pattern, which is based on filename.
* `hidden`: A truthy value will "hide" this pattern, making it available as data, but not rendered on its collection's page.
* `order`: Numeric value for where this pattern should appear in its collection's list of patterns. Defaults to alphabetical by filename.

##### Reserved Properties

* `collection`: Used by Drizzle to attach some metadata about this pattern's collection.

#### Collections

Collections are "meta" resources. Each directory within the glob match for `options.src.patterns.glob` that contains at least one matching pattern file is considered a "collection." By default, collections are named based on their directory name. One output HTML page is generated per collection.

##### Collection Metadata (Special Properties)

Creating a file named `collection.yaml`, `collection.yml` or `collection.json` in a pattern directory allows you to override data about that collection. Accepted properties are:

* `name` `{String}`: Override default directory-based naming
* `hidden` : An `Array` of `{String}` pattern ids to hide in the collection's output (base filename without extension)
* `order`: An `Array` of `{String}` pattern ids in the order you'd like them to display

`hidden` and `order` values can also be defined in individual patterns' front matter. Local pattern data will override data in `collection` metadata files.

Unlike other resources, properties in `collection` metadata files that are _not_ one the properties listed here will be ignored.

##### Reserved Properties

* `items`: Used by Drizzle to store _all_ of the patterns in this collection (even hidden ones)
* `patterns`: Used by Drizzle to store all of the _visible_, _ordered_ patterns in this collection.

#### Data

Files that match `options.src.data.globs` will be parsed and made available to templates. See documentation about global scope in the templates section.

### Templates

#### Context

The context available to resources during template compilation is a combination of a shared global context and a local context specific to the resource.

##### Global Context

Templates receive a `drizzle` data at the top level of their context. Top-level keys on this object are:

* `data`: Structured object of parsed data files
* `options`: Object of options that drizzle is using
* `pages`: Structured object of all page data
* `patterns`: Structured object of all patterns
* `templates`: Structured object of all templates (partials, layouts) and their contents

##### Local Context


#### handlebars-layouts

#### Default Templates


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

An `{Object}` associating different drizzle output page types with their _default_ layout (template). Currently relevant for `page` and `collection`. String values correspond to the filename (minus extension) of the layout under the `src.templates` directory/glob.

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
* `pages`: source page files (typically Handlebars with YAML frontmatter) to transform into HTML pages.
* `patterns`: patterns.
* `templates`: Handlebars source files—layouts and partials—to be registered as partials on Handlebars. Also made available on the `templates` property of global data.

Default:

```
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
```

## drizzleData

`drizzle()` returns a `Promise` resolving to an `Object` (`drizzleData`) representing the data about the build.

### Properties

* `options`: The `options` the build was ultimately created with.
* `data`: Parsed data from data source files.
* `pages`: Contents of parsed page source files and their metadata.
* `patterns`: Hierarchical structure of patterns, their containing collections and metadata.
* `templates`: Contents of parsed layouts and partials.

## Development

### Useful npm scripts

* `npm build`: `babel`-ize `src` into `dist`
* `npm test`: `build`, then run `mocha` tests
