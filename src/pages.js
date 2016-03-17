import * as utils from './utils';
import Promise from 'bluebird';

function outputPages(pages, context, options, handlebars) {
  if (pages.items) {
    outputPages(pages.items, context, options, handlebars);
  }
}

function buildPages (options, context, handlebars) {
  const pages = context.pages;
}

export default buildPages;
