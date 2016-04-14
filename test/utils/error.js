var chai = require('chai');
var expect = chai.expect;
chai.use(expect);
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var DrizzleError = require('../../dist/utils/error');

describe ('utils/error', () => {
  describe ('instantiation and class', () => {
    it ('should instantiate a subclassed Error', () => {
      const error = new DrizzleError('random error',
        DrizzleError.LEVELS.NOTICE);
      expect(error).to.be.an('Object');
    });
    it ('should maintain level information', () => {
      const error = new DrizzleError('random error',
        DrizzleError.LEVELS.NOTICE);
      expect(error.level).to.equal(DrizzleError.LEVELS.NOTICE);
    });
    it ('should have a `message` prop', () => {
      const error = new DrizzleError('random error',
        DrizzleError.LEVELS.NOTICE);
      expect(error.message).to.equal('random error');
    });
    it ('should define a default level if none passed', () => {
      const error = new DrizzleError('random error');
      expect(error.level).to.equal(DrizzleError.LEVELS.WARN);
    });
  });
  describe ('handling and logging', () => {
    describe ('throwing', () => {
      describe ('throw threshold', () => {
        it ('should use a default throw threshold on `handle`', () => {
          const error = new DrizzleError('random error',
            DrizzleError.LEVELS.ERROR);
          expect(DrizzleError.error.bind(DrizzleError, error))
            .to.throw(DrizzleError);
        });
        it ('should not throw if below threshold', () => {
          const error = new DrizzleError('random error',
            DrizzleError.LEVELS.NOTICE);
          expect(DrizzleError.error.bind(DrizzleError, error))
            .to.throw(DrizzleError);
        });
      });
    });
    describe ('logging', () => {
      it ('should properly format error messages');
    });
  });
  describe('debugging', () => {
    it ('should throw all errors by default in debug', () => {
      const error = new DrizzleError('random error');
      expect(DrizzleError.error.bind(DrizzleError, error))
        .to.throw(DrizzleError);
    });
    it ('should by default log to console on non-throw errors', () => {
      const error = new DrizzleError('random error', DrizzleError.LEVELS.WARN);
      const debugOpts = { throwThreshold: 5 };
      expect(DrizzleError.error.bind(DrizzleError, error, debugOpts))
        .not.to.throw;
    });
    it ('should accept a logging function', () => {
      const error = new DrizzleError('random error', DrizzleError.LEVELS.WARN);
      const logFn = sinon.stub();
      const debugOpts = {
        throwThreshold: 5,
        logFn: logFn
      };
      DrizzleError.error(error, debugOpts);
      expect(logFn).to.have.been.calledOnce;
    });
  });
});
