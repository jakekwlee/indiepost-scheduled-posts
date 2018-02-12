const mysql = require('mysql2/promise');
const moment = require('moment-timezone');
const dbConfig = require('./src/config/mysql-config');
const services = require('./src/service');

const pool = mysql.createPool(dbConfig);

const {
  getScheduledPosts,
  unsetFeaturedPosts,
  publishScheduledPosts,
  getAreFeaturedPostsExist,
  logPublishedPosts,
} = services;

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const now = moment()
    .tz('Asia/Seoul')
    .format('YYYY/MM/DD HH:mm:ss');
  return getScheduledPosts(pool, now)
    .then(posts => {
      if (posts.length === 0) {
        // End process immediately
        callback();
        return;
      }
      const { splash, featured } = getAreFeaturedPostsExist(posts);
      return Promise.all([
        posts,
        splash ? unsetFeaturedPosts(pool, true) : null,
        featured ? unsetFeaturedPosts(pool) : null,
      ]);
    })
    .then(result => {
      if (!result) {
        return;
      }
      return Promise.all([result[0], publishScheduledPosts(pool, now)]);
    })
    .then(result => {
      if (!result) {
        return;
      }
      logPublishedPosts(result[0]);
      callback();
    })
    .catch(err => {
      console.error(err);
    });
};
