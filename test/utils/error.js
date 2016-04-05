/* global describe, it */
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);
var testUtils = require('../test-utils');

describe ('utils/error', () => {
  describe ('low-level notices', () => {
    it ('should log a notice when asked to', () => {
      var logStub = sinon.stub();
      var errorUtils = testUtils.stubbedError(logStub);
      errorUtils.handleError('Note this', errorUtils.ERROR_LEVELS.WARN);
      expect(logStub).to.have.been.calledOnce;
      expect(logStub).to.have.been.calledWith('WARN: Note this');
    });
  });
});
