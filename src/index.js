const publishScheduledPosts = (connectionPool, now) => {
  return connectionPool.getConnection().then(conn => {
    const result = conn.execute(
      `select id, title, status, splash, featured from Posts where status = 'FUTURE' and publishedAt < ?`,
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
        'update Posts set splash = false where splash is true'
      );
    } else {
      result = conn.query(
        'update Posts set featured = false where featured is true'
      );
    }
    conn.release();
    return result;
  });

module.exports = {
  getScheduledPosts,
  unsetFeaturedPosts,
  publishScheduledPosts,
};
