// server-utils.js
import mysql from "mysql2/promise";

export function createDatabasePool () {

  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    waitForConnections: true,
    connectionLimit: 10,  // Adjust as needed 
    queueLimit: 0,
  });

  return pool;
}
