const { publishScheduledPostsIfExist } = require('./src/service');

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return publishScheduledPostsIfExist(callback);
};
