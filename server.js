import { updatePackData } from "./src/new_rips/packs.mjs";
import { updateCardData, updateCardUrl } from "./src/new_rips/cards.mjs";
import { updateHeroData } from "./src/new_rips/heroes.mjs";
import { ripDeckData } from "./src/new_rips/decks.mjs";
import {sqlConnect} from "./src/js/utils.js";
import express from "express";
import mysql from "mysql2";
import dotenv from 'dotenv'; dotenv.config();



const app = express();

app.use(express.static("src"));

app.listen(3000, function() {
  console.log("Server listening on port 3000");
});

const connection = sqlConnect()

// const connection = mysql.createConnection({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   port: process.env.MYSQL_PORT 
// });

// app.get('/test', (req, res) => {
//   connection.query('SELECT * FROM aspects', (err, results, fields) => {
//     if (err) throw err;
//     res.json(results);
//   });
// });


ripDeckData(connection)


// const twoDaysAgo = new Date();
// twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
// const formattedDate = twoDaysAgo.toISOString().slice(0, 10);









//here lies the gaggle of junk we need to do as new releases come out

// updatePackData(connection);

// updateCardData(connection, "nebu");

//also will have to manually insert new heroes into hero_names.json (probably the only JSON we're keeping)
// updateHeroData(connection);


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

// updatePackData(connection)
// .then(() => {
//   const query = 'SELECT pack_code FROM packs';
//   connection.query(query, (error, results) => {
//     if (error) throw error;
//     // Loop through results and call function for each pack code
//     results.forEach((result) => {
//       const packCode = result.pack_code;
//       updateCardUrl(connection, packCode);
//     });
//   });
// });




/*


const startDate = new Date();
startDate.setDate(startDate.getDate() - 7); // Set the start date 1000 days back

//last date 2022-07-30
//2021-12-17
//310
let currentDate = new Date(); // Start from the present day
currentDate.setDate(currentDate.getDate() - 1); //except let's actually start with yesterday

function task() {
  if (currentDate >= startDate) {
    const formattedDate = currentDate.toISOString().slice(0, 10);
    ripDeckData(connection, formattedDate);
    console.log(currentDate);

    // Roll the date one day back
    currentDate.setDate(currentDate.getDate() - 1);

    // Set a 60-second delay before the next iteration
    //keep at 60000, 30000 was not enough
    setTimeout(task, 6000);
  }
}

// Start the loop
task();


*/

