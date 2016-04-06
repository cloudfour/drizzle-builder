import { resourceId, resourceKey } from '../utils/object';
import { readFiles, readFileTree } from '../utils/parse';
import { titleCase } from '../utils/shared';
import path from 'path';

const isPattern = obj => obj.hasOwnProperty('path');
const collectionPath = itms => path.dirname(itms[Object.keys(itms).pop()].path);
const collectionKey = itms => collectionPath(itms).split(path.sep).pop();

const hasPatternOrdering = itms => {
  return Object.keys(itms).some(itm => {
    return (itms[itm].data && itms[itm].data.hasOwnProperty('order'));
  });
};

function isHidden (collection, pattern, patternKey) {
  return ((collection.hidden && collection.hidden.indexOf(patternKey) !== -1) ||
    (pattern.data && pattern.data.hidden));
}

function isCollection (obj) {
  if (isPattern(obj)) { return false; }
  return Object.keys(obj).some(childKey => isPattern(obj[childKey]));
}

function buildPattern (patternObj, options) {
  const patternFile = { path: patternObj.path };
  return Object.assign(patternObj, {
    id: resourceId(patternFile, options.src.patterns.basedir, 'patterns'),
    name: (patternObj.data && patternObj.data.name) ||
      titleCase(resourceKey(patternFile))
  });
}

function buildPatterns (collectionObj, options) {
  const patterns = {};
  for (const childKey in collectionObj) {
    if (isPattern(collectionObj[childKey])) {
      patterns[childKey] = buildPattern(collectionObj[childKey], options);
      delete collectionObj[childKey];
    }
  }
  return patterns;
}

function collectionGlob (items) {
  return path.join(collectionPath(items), 'collection.+(yml|yaml|json)');
}

function buildOrderedPatterns (collection) {
  let sortedKeys;
  if (hasPatternOrdering(collection.items)) {
    sortedKeys = Object.keys(collection.items).sort((keyA, keyB) => {
      const orderA = collection.items[keyA].data.order || 10000;
      const orderB = collection.items[keyB].data.order || 10000;
      return orderA - orderB;
    });
  } else {
    sortedKeys = collection.order || [];
  }
  const patterns = [];
  sortedKeys = sortedKeys.concat(
    Object.keys(collection.items).filter(itemKey => {
      // Make sure all keys are accounted for
      return (sortedKeys.indexOf(itemKey) < 0);
    })
  );
  sortedKeys.forEach(sortedKey => {
    if (!isHidden(collection, collection.items[sortedKey], sortedKey)) {
      patterns.push(collection.items[sortedKey]);
    }
  });
  return patterns;
}

function buildCollection (collectionObj, options) {
  const items = buildPatterns (collectionObj, options);
  return readFiles(collectionGlob(items), options).then(collData => {
    const collectionMeta = (collData.length) ? collData[0].contents : {};
    collectionObj.collection = Object.assign ({
      items: items,
      name: titleCase(collectionKey(items))
    }, collectionMeta);
    collectionObj.collection.patterns = buildOrderedPatterns(
      collectionObj.collection);
    return collectionObj;
  });
}

function buildCollections (patternObj, options, collectionPromises = []) {
  if (isPattern(patternObj)) { return collectionPromises; }
  if (isCollection(patternObj)) {
    collectionPromises.push(buildCollection (patternObj, options));
  }
  for (const patternKey in patternObj) {
    if (patternKey !== 'collection') {
      buildCollections (patternObj[patternKey], options, collectionPromises);
    }
  }
  return collectionPromises;
}

function parsePatterns (options) {
  return readFileTree(options.src.patterns, options).then(patternObj => {
    return Promise.all(buildCollections(patternObj, options))
      .then(() => patternObj);
  });
}

export default parsePatterns;
