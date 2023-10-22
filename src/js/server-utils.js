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


export async function queryWithRetry(pool, procedureCall, queryParameters = [], retries = 5) {
  while (retries--) {
    try {
      return await pool.query(procedureCall, queryParameters);
    } catch (err) {
      if (err.code === 'ECONNRESET' && retries > 0) {
        console.error('Connection reset by server, retrying...');
        await delay(3000); // delay for 3 seconds before retrying
        continue;
      }
      throw err; // if it's not ECONNRESET or no retries left, rethrow
    }
  }
}