function DrizzleError (message, level) {
  this.message = message;
  this.level = level || DrizzleError.LEVELS.WARN;
  this.stack = (new Error()).stack;
}

DrizzleError.prototype = Object.create(Error.prototype);

/**
 * This static method allows DrizzleError to handle things that may not
 * be DrizzleErrors yet (e.g. they're Errors).
 */
DrizzleError.error = function (error, options = {}) {
  options.debug = Object.assign({
    logFn: console.log,
    throwThreshold: DrizzleError.LEVELS.ERROR
  }, options.debug || {});
  if (!(error instanceof DrizzleError)) {
    error = new DrizzleError(error, DrizzleError.LEVELS.ERROR);
  }
  if (this.level >= options.throwThreshold || process.env.DRIZZLE_DEBUG) {
    throw error;
  }
  options.debug.logFn(error.message);
};

DrizzleError.LEVELS = {
  NOTICE: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4
};

export default DrizzleError;
