// import { updatePackData } from "./src/new_rips/packs.mjs";
// import { updateCardData } from "./src/new_rips/cards.mjs";
import { ripDeckData } from "./src/new_rips/decks.mjs";
import express from "express";
import mysql from "mysql2";
import dotenv from 'dotenv'; dotenv.config();



const app = express();

app.use(express.static("src"));

app.listen(3000, function() {
  console.log("Server listening on port 3000");
});

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT 
});

app.get('/test', (req, res) => {
  connection.query('SELECT * FROM aspects', (err, results, fields) => {
    if (err) throw err;
    res.json(results);
  });
});

ripDeckData(connection)


//here lies the gaggle of junk we need to do as new releases come out

// updatePackData(connection);

// updateCardData(connection, "core");


//do not take this baby out of storage unless we need to repopulate the entire database
//this will grab every card from every pack in the game and take several minutes
//2463 worth of entries

// updatePackData(connection)
// .then(() => {
//   const query = 'SELECT pack_code FROM packs';
//   connection.query(query, (error, results) => {
//     if (error) throw error;
//     // Loop through results and call function for each pack code
//     results.forEach((result) => {
//       const packCode = result.pack_code;
//       updateCardData(connection, packCode);
//     });
//   });
// });




/*



*/

