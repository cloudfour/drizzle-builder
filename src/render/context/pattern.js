import * as utils from '../../utils';

function patternContext (pattern, drizzleData) {
  const context = Object.assign({}, pattern);
  context.drizzle = drizzleData;
  if (typeof pattern.data === 'object') {
    for (const dataKey in pattern.data) {
      context[dataKey] = pattern.data[dataKey];
    }
    delete context.data;
  }
  context.collection = utils.deepCollection(pattern.id, drizzleData.patterns);
  return context;
}

export default patternContext;
