import R from 'ramda';
import {relative as relativePath} from 'path';
import {splitPath} from '../utils/object';
import {resourcePath} from '../utils/shared';
import {sortByProp} from '../utils/list';

function extractPages (path, drizzle) {
  const pages = drizzle.pages;
  const pathBits = splitPath(path);
  const isPage = R.propEq('resourceType', 'page');
  const pickProps = R.pick(['id', 'url', 'data', 'key', 'path']);
  const results = [];
  let subset = R.path(pathBits, pages) || Object.assign({}, pages);

  // TODO: https://github.com/cloudfour/drizzle/issues/43
  const pageDest = relativePath(
    drizzle.options.dest.root,
    drizzle.options.dest.pages
  );

  // If path pointed to a single page, wrap it up
  if (isPage(subset)) {
    subset = Object.assign({}, {[path]: subset});
  }

  // Fill results with objects refined from the page subset
  for (const key in subset) {
    const page = subset[key];
    if (isPage(page)) {
      page.url = resourcePath(page.id, pageDest);
      page.key = key;
      page.path = path;
      results.push(pickProps(page));
    }
  }

  return results;
}

export default function register (options) {
  const Handlebars = options.handlebars;

  Handlebars.registerHelper('pages', (path, context) => {
    const options = context.hash;
    let results = extractPages(path, context.data.root.drizzle);

    // Apply filtering to results
    if (options.ignore) {
      results = results.filter(page => page.key !== options.ignore);
    }

    // Apply sorting to results
    if (options.sortby) {
      results = sortByProp(['data', options.sortby], results);
    }

    return results;
  });

  Handlebars.registerHelper('page', (path, context) => {
    const pages = extractPages(path, context.data.root.drizzle);
    const result = pages.find(page => page.path === path);
    return result;
  });

  return Handlebars;
}
