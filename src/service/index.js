const logPublishedPosts = posts => {
  posts.forEach(post => {
    const { id, title } = post;
    console.log(`Post is published: [${id}] ${title}`);
  });
};

const publishScheduledPosts = (connectionPool, now) => {
  return connectionPool.getConnection().then(conn => {
    const result = conn.execute(
      `update Posts set status = 'PUBLISH' where status = 'FUTURE' and publishedAt < ?`,
      [now]
    );
    conn.release();
    return result;
  });
};

const getScheduledPosts = (connectionPool, now) => {
  return connectionPool
    .getConnection()
    .then(conn => {
      const result = conn.execute(
        `select id, title, status, splash, featured from Posts where status = 'FUTURE' and publishedAt < ?`,
        [now]
      );
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
    });
};

const unsetFeaturedPosts = (connectionPool, splash = false) =>
  connectionPool.getConnection().then(conn => {
    let result;
    if (splash) {
      result = conn.query(
        `update Posts set splash = false where splash is true and status = 'PUBLISH'`
      );
    } else {
      result = conn.query(
        `update Posts set featured = false where featured is true and status = 'PUBLISH'`
      );
    }
    conn.release();
    return result;
  });

const castBufferToBoolean = buf => buf.readUInt8(0) === 0x1;

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
