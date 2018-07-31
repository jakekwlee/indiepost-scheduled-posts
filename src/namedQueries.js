module.exports = {
  PUBLISH_SCHEDULED_POSTS:
    "update Posts set status = 'PUBLISH' , modifiedAt = now() where status = 'FUTURE' and publishedAt < now()",
  SELECT_SCHEDULED_POSTS:
    "select id, title, status, splash, featured from Posts where status = 'FUTURE' and publishedAt < now()",
  UNSET_SPLASH_POSTS: "update Posts set splash = false where splash is true and status = 'PUBLISH'",
  UNSET_FEATURE_POSTS:
    "update Posts set featured = false where featured is true and status = 'PUBLISH'",
};
