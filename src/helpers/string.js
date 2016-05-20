import {
  concat,
  join,
  map,
  pipe,
  split,
  trim
} from 'ramda';

/**
 * Prefix every word in string with a namespace.
 *
 * The prefix (default: `ns-`) can be supplied as an option globally, or as an
 * argument when using the helper. This is intended to be used with HTML
 * attribute values, such as `[class]`.
 *
 * @example
 * <div class="{{ns "One Two"}}">
 * {{!
 *   <div class="ns-One ns-Two">
 * }}
 *
 * @example
 * <div class="{{ns "Component u-util" prefix="foo-"}}">
 * {{!
 *   <div class="foo-Component foo-u-util">
 * }}
 */
export function ns (Handlebars, options) {
  const defaults = {prefix: 'ns-'};

  return (str, context) => {
    const {prefix} = Object.assign(
      defaults,
      options,
      context.hash
    );

    const transform = pipe(
      trim,
      split(/[\s\t\n\r]+/gm),
      map(concat(prefix)),
      join(' ')
    );

    const result = transform(str.toString());

    return new Handlebars.SafeString(result);
  };
}

export default {
  ns
};
