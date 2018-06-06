const {
  SELECT_SCHEDULED_POSTS,
  UNSET_FEATURE_POSTS,
  UNSET_SPLASH_POSTS,
  PUBLISH_SCHEDULED_POSTS,
} = require('./namedQueries');

const logPublishedPosts = posts => {
  posts.forEach(post => {
    const { id, title } = post;
    console.log(`Post is published: [${id}] ${title}`);
  });
};

const publishScheduledPosts = (now, pool) => {
  return pool.getConnection().then(conn => {
    const result = conn.execute(PUBLISH_SCHEDULED_POSTS, [now, now]);
    conn.release();
    return result;
  });
};

const getScheduledPosts = (now, pool) => {
  return pool
    .getConnection()
    .then(conn => {
      const result = conn.execute(SELECT_SCHEDULED_POSTS, [now]);
      conn.release();
      return result;
    })
    .then(result => {
      const posts = result[0];
      return posts && posts.length
        ? posts.map(post =>
            Object.assign({}, post, {
              splash: castBufferToBoolean(post.splash),
              featured: castBufferToBoolean(post.featured),
            })
          )
        : posts;
    })
    .catch(console.log);
};

const unsetFeaturedPosts = (splash = false, pool) =>
  pool.getConnection().then(conn => {
    let result;
    if (splash) {
      result = conn.query(UNSET_SPLASH_POSTS);
    } else {
      result = conn.query(UNSET_FEATURE_POSTS);
    }
    conn.release();
    return result;
  });

const castBufferToBoolean = buf => buf.readUInt8(0) === 1;

const getAreFeaturedPostsExist = posts =>
  posts.reduce(
    (result, post) => ({
      splash: result.splash || post.splash,
      featured: result.featured || post.featured,
    }),
    {
      splash: false,
      featured: false,
    }
  );

module.exports = {
  getScheduledPosts,
  castBufferToBoolean,
  unsetFeaturedPosts,
  publishScheduledPosts,
  getAreFeaturedPostsExist,
  logPublishedPosts,
};
