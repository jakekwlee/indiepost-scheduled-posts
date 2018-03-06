const { publishScheduledPostsIfExist } = require('../../src/service');

describe('Service Tests', () => {
  it('publishScheduledPostsIfExist() should work properly', () => {
    const callback = (err, success = null) => err || success;
    return publishScheduledPostsIfExist(callback).then(result => {
      expect(result).toBeNull();
    });
  });
});
