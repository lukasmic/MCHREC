import fs from "fs";
import fetch from "node-fetch";
import { DateTime } from "luxon";



export async function ripDeckData(connection) {
  


  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const formattedDate = twoDaysAgo.toISOString().slice(0, 10);

  console.log(twoDaysAgo);
  console.log(formattedDate);

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
        const parsedMeta = JSON.parse(meta); // parse the meta field as a JSON object
        const aspect = parsedMeta.aspect; // access the aspect property using dot notation
        console.log(aspect);
  

        
        });
      });

    }

  
  });

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
}







// Call this function once per week to update the deck data
// setInterval(updateDeckData, 7 * 24 * 60 * 60 * 1000); // once per week