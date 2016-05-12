import R from 'ramda';
import natsort from 'natsort';

const sortObjects = natsort();

/**
 * Sort an array of objects by property.
 *
 * @param {String|Array} prop
 * A property to sort by. If passed as an array, it
 * will be treated as a deep property path.
 *
 * @param {Array} list
 * An array of objects to sort.
 *
 * @return {Array}
 * A sorted copy of the passed array.
 *
 * @example
 * sortByProp('order', items);
 * // [{order: 1}, {order: 2}]
 *
 * @example
 * sortByProp(['data', 'title'], items);
 * // [{data: {title: 'a'}}, {data: {title: 'b'}}]
 */
function sortByProp (prop, list) {
  const get = R.is(Array, prop) ? R.path : R.prop;
  return R.sort((elA, elB) => {
    const a = get(prop, elA);
    const b = get(prop, elB);
    return sortObjects(a, b);
  }, list);
}

export {
  sortByProp
};
