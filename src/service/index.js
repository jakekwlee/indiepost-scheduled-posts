const mysql = require('mysql2/promise');
const moment = require('moment-timezone');
const dbConfig = require('../config/mysql-config');
const redisClient = require('../repository/redisClient');
const {
  getScheduledPosts,
  getAreFeaturedPostsExist,
  publishScheduledPosts,
  logPublishedPosts,
  unsetFeaturedPosts,
} = require('../repository');

const publishScheduledPostsIfExist = callback => {
  const pool = mysql.createPool(dbConfig);
  const now = moment()
    .tz('Asia/Seoul')
    .format('YYYY/MM/DD HH:mm:ss');
  return getScheduledPosts(now, pool)
    .then(posts => {
      if (posts.length === 0) {
        // End process immediately
        pool.end();
        return callback();
      }
      const { splash, featured } = getAreFeaturedPostsExist(posts);
      return Promise.all([
        posts,
        splash ? unsetFeaturedPosts(true, pool) : null,
        featured ? unsetFeaturedPosts(false, pool) : null,
      ]);
    })
    .then(result => {
      if (!result) {
        return callback();
      }
      return Promise.all([result[0], publishScheduledPosts(now, pool)]);
    })
    .then(result => {
      if (!result) {
        return callback();
      }
      pool.end();
      return Promise.all([
        redisClient.deleteCacheAsync('home::rendered::0'),
        logPublishedPosts(result[0]),
      ]);
    })
    .then(() => {
      return callback();
    })
    .catch(err => {
      pool.end();
      return callback(err);
    });
};

module.exports = {
  publishScheduledPostsIfExist,
};
