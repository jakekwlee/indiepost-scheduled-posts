var mysql = require('mysql');
var dbConfig = require('./mysql-config');

var pool = mysql.createPool(dbConfig);

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  pool.getConnection((err, conn) => {
    if (err) {
      callback(err);
      return;
    }
    var query = mysql.format(
      'update Posts set status = ? where publishedAt > now()',
      'PUBLISH'
    );
    conn.query(query, (err, result, field) => {
      conn.release();
      if (err) {
        callback(err);
        return;
      }
      callback(null, 'Post(s) published: ' + result.affectedRows);
    });
  });
};
