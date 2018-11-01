const mysql = require('mysql');
const config = require('./config');
const {
  SELECT_SCHEDULED_POSTS,
  UNSET_FEATURE_POSTS,
  UNSET_SPLASH_POSTS,
  PUBLISH_SCHEDULED_POSTS,
} = require('./namedQueries');

module.exports = (() => {
  let connection = null;

  const connect = () => {
    if (!connection) {
      connection = mysql.createConnection(config.mysql);
    }
  };

  const castBufferToBoolean = buf => buf.readUInt8(0) === 1;

  const executeQuery = (sqlQuery, args = null) => {
    return new Promise((resolve, reject) => {
      connection.query(sqlQuery, args, (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
    });
  };

  const publishScheduledPosts = () => executeQuery(PUBLISH_SCHEDULED_POSTS);

  const getScheduledPosts = () => {
    return executeQuery(SELECT_SCHEDULED_POSTS).then(posts => {
      return posts.map(post => {
        const { isFeatured, isSplash } = post;
        return {
          ...post,
          isSplash,
          isFeatured,
        };
      });
    });
  };

  const unsetFeaturedPosts = (isSplash = false) => {
    return isSplash ? executeQuery(UNSET_SPLASH_POSTS) : executeQuery(UNSET_FEATURE_POSTS);
  };

  const getAreFeaturedPostsExist = posts => {
    return posts.reduce(
      (result, post) => ({
        isSplash: result.isSplash || post.isSplash,
        isFeatured: result.isFeatured || post.isFeatured,
      }),
      {
        isSplash: false,
        isFeatured: false,
      }
    );
  };

  const destroy = () => {
    if (connection && connection.destroy) {
      connection.destroy();
    }
  };

  return {
    connect,
    getScheduledPosts,
    castBufferToBoolean,
    unsetFeaturedPosts,
    publishScheduledPosts,
    getAreFeaturedPostsExist,
    destroy,
  };
})();
