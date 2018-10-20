const mysql = require('mysql');
const fs = require('fs');
const config = require('../../config.json');

// module.exports = function() {
const connection = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
})


connection.query('SELECT * FROM kyfw12306 WHERE id = 1', function (error, results, fields) {
  if (error) throw error;
  // console.log(results[0].name);
  // connected!
});

// connection.end(function(err) {
//   console.log('')
//   // The connection is terminated now
// });

// }