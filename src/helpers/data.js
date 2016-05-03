/**
 * @param {String} The path to lookup within drizzle.data
 * @returns {*} The data located at the supplied path
 * @example
 *
 *    {{#each (data "specimens.headings")}}
 *      {{this}}
 *    {{/each}}
 */

export default function register (options) {
  const Handlebars = options.handlebars;

  Handlebars.registerHelper('data', (path, context) => {
    const parts = path.split('.');
    const root = context.data.root.drizzle.data;
    const reducer = (prev, curr) => {
      if (prev.contents) return prev.contents[curr];
      return prev[curr].contents || prev[curr];
    };
    return parts.reduce(reducer, root);
  });

  return Handlebars;
}
