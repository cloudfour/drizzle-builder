import log from './log';

const ERROR_LEVELS = {
  NOTICE: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4
};

function handleError (error, level) {
  switch (level) {
    case ERROR_LEVELS.NOTICE:
      log(`NOTICE: ${error}`);
      break;
    case ERROR_LEVELS.WARN:
      log(`WARN: ${error}`);
      break;
    case ERROR_LEVELS.ERROR:
    default:
      log(`ERROR: ${error}`);
      break;
    case ERROR_LEVELS.FATAL:
      log(`FATAL: ${error}`);
      process.exit(1);
      break;
  }
}

export {
  handleError,
  ERROR_LEVELS
};
