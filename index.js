const mysql = require('mysql2/promise');
const moment = require('moment-timezone');
const dbConfig = require('./src/config/mysql-config');
const services = require('./src');

const pool = mysql.createPool(dbConfig);

const {
  getScheduledPosts,
  unsetFeaturedPosts,
  publishScheduledPosts,
} = services;

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const now = moment()
    .tz('Asia/Seoul')
    .format();
  return getScheduledPosts(pool, now)
    .then(result => {
      const posts = result[0];
      if (posts.length === 0) {
        // End process immediately
        callback();
        return;
      }
      const isExists = {};
      posts.forEach(post => {
        if (post.splash) {
          isExists.splash = true;
        }
        if (post.featured) {
          isExists.featured = true;
        }
      });
      return Promise.all([
        posts,
        isExists,
        isExists.splash ? unsetFeaturedPosts(pool, true) : null,
        isExists.featured ? unsetFeaturedPosts(pool) : null,
      ]);
    })
    .then(result => {
      if (!result) {
        return;
      }
      const posts = result[0];
      return Promise.all([posts, publishScheduledPosts(pool, now)]);
    })
    .then(result => {
      if (!result) {
        return;
      }
      const posts = result[0];
      posts.forEach(post => {
        const { id, title } = post;
        console.log(`Post is published: [${id}] ${title}`);
      });
      callback();
    })
    .catch(err => {
      console.error(err);
    });
};
