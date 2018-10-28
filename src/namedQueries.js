module.exports = {
  PUBLISH_SCHEDULED_POSTS:
    "update Posts set status = 'PUBLISH' , modifiedAt = now() where status = 'FUTURE' and publishedAt < now()",
  SELECT_SCHEDULED_POSTS:
    "select id, title, status, isSplash, isFeatured from Posts where status = 'FUTURE' and publishedAt < now()",
  UNSET_SPLASH_POSTS: "update Posts set isSplash = false where isSplash is true and status = 'PUBLISH'",
  UNSET_FEATURE_POSTS:
    "update Posts set isFeatured = false where isFeatured is true and status = 'PUBLISH'",
};
