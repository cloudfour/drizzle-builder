import * as utils from './utils';
import Promise from 'bluebird';

function writePages (pages, drizzleData) {
  //console.log(JSON.stringify(pages, null, '  '));
  return {};
}

function pages (drizzleData) {
  return writePages(drizzleData.context.pages, drizzleData);
}

export default pages;
