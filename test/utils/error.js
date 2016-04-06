/* global describe, it */
var chai = require('chai');
var expect = chai.expect;
chai.use(expect);
var DrizzleError = require('../../dist/utils/error');
//chai.use(sinonChai);

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
          expect(error.handle.bind(error)).to.throw;
        });
        it ('should not throw if below threshold', () => {
          const error = new DrizzleError('random error',
            DrizzleError.LEVELS.NOTICE);
          expect(error.handle.bind(error)).not.to.throw;
        });
        it ('should take a threshold', () => {
          const error = new DrizzleError('random error',
            DrizzleError.LEVELS.NOTICE);
          expect(error.handle.bind(error,
            { throwThreshold: DrizzleError.LEVELS.NOTICE })).to.throw;
        });
      });
    });
    it ('should by default log to console on non-throw errors');
    it ('should accept a logging function');
    it ('should throw by default on ERROR');
  });
});
