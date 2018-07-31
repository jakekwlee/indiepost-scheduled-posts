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
      return posts.map(post => ({
        ...post,
        splash: castBufferToBoolean(post.splash),
        featured: castBufferToBoolean(post.featured),
      }));
    });
  };

  const unsetFeaturedPosts = (splash = false) => {
    return splash ? executeQuery(UNSET_SPLASH_POSTS) : executeQuery(UNSET_FEATURE_POSTS);
  };

  const getAreFeaturedPostsExist = posts => {
    return posts.reduce(
      (result, post) => ({
        splash: result.splash || post.splash,
        featured: result.featured || post.featured,
      }),
      {
        splash: false,
        featured: false,
      }
    );
  };

  const end = () => {
    if (connection && connection.end) {
      return new Promise((resolve, reject) => {
        connection.end(err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  };

  return {
    connect,
    getScheduledPosts,
    castBufferToBoolean,
    unsetFeaturedPosts,
    publishScheduledPosts,
    getAreFeaturedPostsExist,
    end,
  };
})();
