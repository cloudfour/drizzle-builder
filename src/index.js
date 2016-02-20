const defaults = {
  materials: ['src/materials/**/*']
};

const buildDrizzle = (options) => {
  const opts = Object.assign(options, defaults);
  return opts;
};

export default buildDrizzle;
export { defaults };
