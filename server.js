// import { updateDeckData } from "./src/data-rips/data-rip.mjs";
import express from "express";
import mysql from "mysql2";
import dotenv from 'dotenv'; dotenv.config();

import { updatePackData } from "./src/new_rips/packs.mjs";
import { updateCardData } from "./src/new_rips/cards.mjs";

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


//here lies the gaggle of junk we need to do as new releases come out

// updatePackData(connection);

// updateCardData(connection, "core");


//do not take this baby out of storage unless we need to repopulat the entire database
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

// async function insertRow() {
//   const sql = 'INSERT INTO aspects (aspect_id, aspect_name) VALUES (?, ?)';
//   const values = ['89', 'hooker'];

//   console.log(sql, values);

//   try {
//     const [result] = await connection.promise().query(sql, values);
//     console.log(`Inserted ${result.affectedRows} row(s) into packs table`);
//   } catch (error) {
//     console.error(error);
//   }
// }

// insertRow()
//   .then(() => {
//     // connection.query('SELECT * FROM packs', (err, results, fields) => {
//     //   if (err) throw err;
//     //   console.log(results);
//     // });
//     connection.close();
//   })
//   .catch((error) => {
//     console.error(error);
//     connection.close();
//   });



/*

SQL - JSON
master_code - code
name - name
subname(can be null) = subname
card_type - type_code
photo


code - code
pack_code - pack_code
master_code - code


card_traits
card_versions
villain_cardlist
modular_cardlist
decks
heroes

ALTER TABLE master_cards MODIFY COLUMN master_code VARCHAR(10);
ALTER TABLE card_traits MODIFY COLUMN master_code VARCHAR(10);
ALTER TABLE card_versions MODIFY COLUMN master_code VARCHAR(10);
ALTER TABLE villain_cardlist MODIFY COLUMN master_code VARCHAR(10);
ALTER TABLE modular_cardlist MODIFY COLUMN master_code VARCHAR(10);
ALTER TABLE decks MODIFY COLUMN master_code VARCHAR(10);
ALTER TABLE heroes MODIFY COLUMN master_code VARCHAR(10);

*/

