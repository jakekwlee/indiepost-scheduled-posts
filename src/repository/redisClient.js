const util = require('util');
const redis = require('redis');
const config = require('../config/redis-config');

const redisClient = redis.createClient(config.port, config.host);
let del = util.promisify(redisClient.del).bind(redisClient);

redisClient.on('error', err => {
  console.error(err.message);
  del = () => Promise.resolve();
});

module.exports = {
  deleteCacheAsync: del,
};
