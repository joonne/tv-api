const { handleErrors } = require('../../src/helpers/errors');

describe('errors', () => {
  describe('handleError', () => {
    it('should call the res.end method & return message as stringified json', (done) => {
      const res = {
        end(response) {
          return response;
        },
      };
      const err = {
        statusCode: 200,
        message: 'message',
      };
      handleErrors(res, err).should.equal(JSON.stringify({ message: 'message' }));
      done();
    });
  });
});
