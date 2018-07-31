module.exports = {
  redis: {
    host: 'redis.indiepost.vpc',
    port: process.env.REDIS_PORT || 6379,
  },
  mysql: {
    host: 'rds.indiepost.vpc',
    user: 'indiepost',
    password: 'indiepost',
    database: 'indiepost',
  },
};
