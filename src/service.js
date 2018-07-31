const redisClient = require('./redisClient');
const repository = require('./mysqlRepository');

const log = posts => {
  posts.forEach(post => {
    const { id, title } = post;
    console.log(`Publish posts: [${id}] ${title}`);
  });
};

const publishScheduledPostsIfExist = callback => {
  repository.initialize();

  return repository
    .getScheduledPosts()
    .then(posts => {
      if (posts.length === 0) {
        // End process immediately
        repository.terminate();
        return callback();
      }
      const { splash, featured } = repository.getAreFeaturedPostsExist(posts);
      return Promise.all([
        posts,
        splash ? repository.unsetFeaturedPosts(true) : null,
        featured ? repository.unsetFeaturedPosts(false) : null,
      ]);
    })
    .then(results => {
      const posts = results[0];
      if (posts.length) {
        posts.forEach(post => {
          const { id, title } = post;
          console.log(`Publish posts: [${id}] ${title}`);
        });
      }
      log(results[0]);
      return repository.publishScheduledPosts();
    })
    .then(() => redisClient.deleteCacheAsync('home::rendered::0'))
    .then(() => {
      repository.terminate();
      return callback();
    })
    .catch(err => {
      repository.terminate();
      return callback(err);
    });
};

module.exports = {
  publishScheduledPostsIfExist,
};