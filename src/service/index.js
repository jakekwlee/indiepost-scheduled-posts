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
  return connectionPool.getConnection().then(conn => {
    const result = conn.execute(
      `select id, title, status, splash, featured from Posts where status = 'FUTURE' and publishedAt < ?`,
      [now]
    );
    conn.release();
    return result;
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

const getAreFeaturedPostsExist = posts => {
  const isExist = {
    splash: false,
    featured: false,
  };
  posts.forEach(post => {
    if (post.splash) {
      isExist.splash = true;
    }
    if (post.featured) {
      isExist.featured = true;
    }
  });
  return isExist;
};
module.exports = {
  getScheduledPosts,
  unsetFeaturedPosts,
  publishScheduledPosts,
  getAreFeaturedPostsExist,
  logPublishedPosts,
};
