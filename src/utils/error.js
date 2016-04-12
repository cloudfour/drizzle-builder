function DrizzleError (message, level) {
  this.message = message;
  this.level = level || DrizzleError.LEVELS.WARN;
  this.stack = (new Error()).stack;
}

DrizzleError.prototype = Object.create(Error.prototype);

/**
 * Handle an error by logging or throwing it. Will always throw if
 * debug env set (DRIZZLE_DEBUG).
 */
DrizzleError.prototype.handle = function (options = {}) {
  options = Object.assign({
    logFn: console.log,
    throwThreshold: DrizzleError.LEVELS.ERROR
  }, options);
  if (this.level >= options.throwThreshold || process.env.DRIZZLE_DEBUG) {
    throw this;
  }
  options.logFn(this.message);
};

/**
 * This static method allows DrizzleError to handle things that may not
 * be DrizzleErrors yet (e.g. they're Errors).
 */
DrizzleError.error = function (error, options = {}) {
  if (!(error instanceof DrizzleError)) {
    error = new DrizzleError(error, DrizzleError.LEVELS.ERROR);
  }
  error.handle(options);
};

DrizzleError.LEVELS = {
  NOTICE: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4
};

export default DrizzleError;
