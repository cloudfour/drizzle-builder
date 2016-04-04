const ERROR_LEVELS = {
  NOTICE: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4
};

function handleError (error, level) {
  console.log(error);
}

export {
  handleError,
  ERROR_LEVELS
};
