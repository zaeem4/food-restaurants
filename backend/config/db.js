const Pool = require("pg").Pool;
const Logger = require("../utils/logger");

try {
  const pool = new Pool({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port,
    multipleStatements: true,
  });

  pool.connect((err) => {
    if (err) {
      console.log("Error occured while connecting to postgresql");
    } else {
      console.log("connection created with postgresql successfully");
    }
  });
  module.exports = pool;
} catch (error) {
  console.log(`400 || pool || ${JSON.stringify(error)}`);
}
