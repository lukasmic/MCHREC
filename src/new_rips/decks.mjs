import fs from "fs";
import fetch from "node-fetch";
import { DateTime } from "luxon";



export async function ripDeckData(connection) {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const formattedDate = twoDaysAgo.toISOString().slice(0, 10);

  // console.log(twoDaysAgo);
  // console.log(formattedDate);

  const sql = `SELECT * FROM decks WHERE date_creation = ?`;
  const values = [formattedDate];

  connection.query(sql, values, (error, results) => {
    if (error) {
      console.log(error);
      return;
    }

    // const count = results[0].count;
    // if there is any data, stop what we're doing
    if (results.length != 0) {
      console.log(`data found for ${formattedDate}`);
    } else {
      fetch(`https://marvelcdb.com/api/public/decklists/by_date/${formattedDate}`)
      .then(response => response.json())
      .then(decks => {

        decks.forEach(deck => {
          const { date_creation, investigator_code, slots, meta } = deck;
          let aspect = meta && meta !== '' ? JSON.parse(meta).aspect : null;

          if (investigator_code == '21031a') {//Adam Warlock
            aspect = 'none';
          } else if (investigator_code == '04031a') {//Spider-Woman
            let aspect2 = meta && meta !== '' ? JSON.parse(meta).aspect2 : null;


          } 

//spider woman test 2023-05-24

          
          // const parsedMeta = JSON.parse(meta); // parse the meta field as a JSON object
          // console.log(parsedMeta);
          // const aspect = parsedMeta.aspect; // access the aspect property using dot notation
          
          // let aspect = JSON.parse(meta).aspect; // check if the meta field is empty before parsing it as a JSON object
          if (aspect == null) {
            return;
          }
          console.log(aspect); 
          // const parsedDecklist = JSON.parse(slots);
          // console.log(parsedDecklist);
          // console.log(aspect);

          // query the aspects table to get the aspect_id
          const sql = `SELECT aspect_id FROM aspects WHERE aspect_name = ?`;
          const values = [aspect];
          
          let aspect_id;
          connection.query(sql, values, (error, results) => {
            if (error) {
              console.log(error);
              return;
            }
            console.log(results);
            aspect_id = results[0].aspect_id;
            // console.log(aspect_id);
          

            let decks_id;
            // console.log(date_creation, investigator_code, aspect_id);
            const deckSql = `INSERT INTO decks (date_creation, master_code, aspect_id) VALUES (?, ?, ?)`;
            const deckValues = [date_creation, investigator_code, aspect_id];
            connection.query(deckSql, deckValues, (error, results) => {
              if (error) {
                console.log(error);
              }
              console.log(results);
              decks_id = results.insertId;
              console.log(decks_id);
            
              for (const slot in slots) {
                const cardCode = slot.split(':')[0]; // extract the first five characters of the slot property 
                const dlSql = `INSERT INTO decklists (decks_id, code) VALUES (?, ?)`;
                const dlValues = [decks_id, cardCode];
                connection.query(dlSql, dlValues, (error, results) => {
                  if (error) {
                    console.log(error);
                  }
                });
              }
            });
          });
        });
      });
    }
  });
}
  //   const current_date = DateTime.local().minus({ days: day });
  //   const dateString = current_date.toISODate();



  //   const url = `https://marvelcdb.com/api/public/decklists/by_date/${dateString}`;
  //   const response = await fetch(url);
  //   const data = await response.json();

  //   if ("error" in data) {
  //     console.log(`Error fetching data for ${dateString}: ${data.error.message}`);
  //     continue;
  //   }

  //   const filteredData = data.map((deck) => {
  //     const filteredDeck = {
  //       date_creation: deck.date_creation,
  //       investigator_code: deck.investigator_code,
  //       slots: deck.slots,
  //       meta: deck.meta,
  //     };

  //     return filteredDeck;
  //   });

  //   month_data.push(filteredData);
  

  // return month_data.reverse();








// Call this function once per week to update the deck data
// setInterval(updateDeckData, 7 * 24 * 60 * 60 * 1000); // once per week