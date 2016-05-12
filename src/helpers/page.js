import R from 'ramda';
import {splitPath} from '../utils/object';
import {resourcePath} from '../utils/shared';
import {sortByProp} from '../utils/list';

export default function register (options) {
  const Handlebars = options.handlebars;

  Handlebars.registerHelper('pages', (path, context) => {
    const builder = context.data.root.drizzle;
    const pageDest = builder.options.dest.pages;
    const pathBits = splitPath(path);
    const subset = R.path(pathBits, builder.pages);
    const isPage = R.propEq('resourceType', 'page');
    const pickProps = R.pick(['id', 'url', 'data', 'key']);
    const options = context.hash;
    let results = [];

    // Fill results with objects refined from the page subset
    for (const key in subset) {
      const page = subset[key];
      if (isPage(page)) {
        page.url = resourcePath(page.id, pageDest);
        page.key = key;
        results.push(pickProps(page));
      }
    }

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

  return Handlebars;
}
