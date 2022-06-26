const pg = require('pg');
require("dotenv").config();

const sql = new pg.Pool({
  user: process.env.PG_USER,
  database: process.env.PG_DBNAME,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT
});

sql.query('SELECT NOW()', (err, res) => {
  console.log(err, res.rows[0].now);
});

module.exports = sql;