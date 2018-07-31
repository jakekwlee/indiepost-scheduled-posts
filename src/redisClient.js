const util = require('util');
const redis = require('redis');
const config = require('./config');

const { port, host } = config.redis;
const redisClient = redis.createClient(port, host);
let del = util.promisify(redisClient.del).bind(redisClient);

redisClient.on('error', err => {
  console.error(err.message);
  del = () => Promise.resolve();
});

module.exports = {
  deleteCacheAsync: del,
};
