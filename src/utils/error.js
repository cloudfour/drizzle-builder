function DrizzleError (message, level) {
  this.message = message;
  this.level = level || DrizzleError.LEVELS.WARN;
  this.stack = (new Error()).stack;
}

DrizzleError.prototype = Object.create(Error.prototype);

DrizzleError.prototype.handle = function (options = {}) {
  options = Object.assign({
    logFn: console.log,
    throwThreshold: DrizzleError.LEVELS.ERROR
  }, options);
  if (this.level >= options.throwThreshold) {
    throw this;
  }
  options.logFn(this.message);
};

DrizzleError.LEVELS = {
  NOTICE: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4
};

export default DrizzleError;
