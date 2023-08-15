import { updatePackData } from "./src/new_rips/packs.mjs";
import { updateCardData, updateCardUrl } from "./src/new_rips/cards.mjs";
import { updateHeroData } from "./src/new_rips/heroes.mjs";
import { updateTraits } from "./src/new_rips/traits.mjs";
import { updateVillainSets } from "./src/new_rips/villains.mjs";
import { ripDeckData } from "./src/new_rips/decks.mjs";
// import {sqlConnect} from "./src/js/utils.js";
import { sqlConnect } from "./src/js/server-utils.js";
import express from "express";
import dotenv from 'dotenv'; dotenv.config();

const app = express();
app.use(express.static("src"));

app.listen(3000, function() {
  console.log("Server listening on port 3000");
});

let connection;

// Add the handleDisconnect function here
// function handleDisconnect() {
//   connection = sqlConnect();
//   connection.connect(function(err) {
//     if(err) {
//       console.log('error when connecting to db:', err);
//       setTimeout(handleDisconnect, 2000);
//     }
//   });

  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      // handleDisconnect();
    } else {
      throw err;
    }
  });
}

// Call handleDisconnect once when the server starts
// handleDisconnect();



app.get('/api/calculate-synergy', async (req, res) => {
  const { herocode, heroAspect, percentageType, history, packs } = req.query;
  const isSynergy = percentageType == "synergy";
  const synPerc = isSynergy ? true : false;
  let procedureCall;

    if (herocode == "21031a") {
      procedureCall = `CALL CalculateAdamWarlockSynergy(${synPerc}, ${history}, '${packs}')`; 
      // console.log(procedureCall); 
    } else if (herocode == "33001a" || herocode == "18001a") {
      procedureCall = `CALL CalculateCyclopsSynergy('${herocode}', ${heroAspect}, ${synPerc}, ${history}, '${packs}')`;
    } else if (herocode == "04031a") {
      procedureCall = `CALL CalculateSpiderWomanSynergy(${heroAspect}, ${synPerc}, ${history}, '${packs}')`;
      // console.log(procedureCall); 
    } else {
      procedureCall = `CALL CalculateSynergy('${herocode}', ${heroAspect}, ${synPerc}, ${history}, '${packs}')`;
      // console.log(procedureCall);
    }
  
  connection.query(procedureCall, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results[0]);
    }
  });
});

app.get('/api/aspect-name', async (req, res) => {
  // console.log("here I am");
  // console.log(req.query);
  const aspect = req.query.aspect;
  // const connection = sqlConnect();
  const procedureCall = `SELECT aspect_name FROM aspects WHERE aspect_id = ${aspect}`;

  
  connection.query(procedureCall, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results[0]);
    }
  });
});

app.get('/api/get-packs', async (req, res) => {
  // const connection = sqlConnect();
  const procedureCall = `SELECT * from packs`;

  
  connection.query(procedureCall, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

app.get('/api/staples', async (req, res) => {
  const { aspect, history } = req.query;
  const procedureCall = `CALL StapleCounts(${aspect}, ${history})`;

  
  connection.query(procedureCall, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results[0]);
    }
  });
});


ripDeckData(connection)

setInterval(() => {
  connection.query('SELECT 1', (err) => {
    if (err) {
      console.error('Error pinging database:', err);
    } else {
      console.log('Pinged database successfully.');
    }
  });
}, 15 * 60 * 1000);  // Ping every 15 minutes, for example


// const twoDaysAgo = new Date();
// twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
// const formattedDate = twoDaysAgo.toISOString().slice(0, 10);



// const query = 'SELECT pack_code FROM packs';
// connection.query(query, (error, results) => {
//   if (error) throw error;
//   // Loop through results and call function for each pack code
//   results.forEach((result, index) => {
//     const packCode = result.pack_code;
//     // Set a timeout for each call to updateTraits
//     setTimeout(() => {
//       updateTraits(connection, packCode);
//     }, index * 30000); // Delay each call by 60 seconds
//   });
// });


// const query = 'SELECT pack_code FROM packs';
// connection.query(query, (error, results) => {
//   if (error) throw error;
//   // Loop through results and call function for each pack code
//   results.forEach((result, index) => {
//     const packCode = result.pack_code;
//     // Set a timeout for each call to updateTraits
//     setTimeout(() => {
//       updateVillainSets(connection, packCode);
//     }, index * 15000); // Delay each call by 60 seconds
//   });
// });









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







// const startDate = new Date();
// startDate.setDate(startDate.getDate() - 60); // Set the start date 1000 days back

// //last date 2022-07-30
// //2021-12-17
// //310
// let currentDate = new Date(); // Start from the present day
// currentDate.setDate(currentDate.getDate() - 1); //except let's actually start with yesterday

// function task() {
//   if (currentDate >= startDate) {
//     const formattedDate = currentDate.toISOString().slice(0, 10);
//     ripDeckData(connection, formattedDate);
//     console.log(currentDate);

//     // Roll the date one day back
//     currentDate.setDate(currentDate.getDate() - 1); 

//     // Set a 60-second delay before the next iteration
//     //keep at 60000, 30000 was not enough
//     setTimeout(task, 6000);
//   }
// }

// // Start the loop
// task();




