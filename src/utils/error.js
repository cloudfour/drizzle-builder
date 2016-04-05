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
      log(`NOTICE: ${error}`, false);
      break;
    case ERROR_LEVELS.WARN:
      log(`WARN: ${error}`, false);
      break;
    case ERROR_LEVELS.ERROR:
      log(`ERROR: ${error}`, true);
      break;
    case ERROR_LEVELS.FATAL:
      log(`FATAL: ${error}`, true);
      process.exit(1);
      break;
    default:
      log(error, false);
      break;
  }
}

export {
  handleError,
  ERROR_LEVELS
};
