const mysql = require('mysql2/promise');
const dbConfig = require('./mysql-config');

const pool = mysql.createPool(dbConfig);

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return pool
    .getConnection()
    .then(conn => {
      const result = conn.query(
        'update Posts set status = ? where status = ? and publishedAt > now()',
        ['PUBLISH', 'FUTURE']
      );
      conn.release();
      return result;
    })
    .then(result => {
      callback(null, 'Post(s) published: ' + result[0].affectedRows);
    })
    .catch(err => {
      callback(err);
    });
};
