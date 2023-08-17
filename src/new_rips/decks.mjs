import fetch from "node-fetch";

// export async function ripDeckData(connection,formattedDate) {
//turn these on for day to day
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

    // if there is any data, stop what we're doing
    if (results.length != 0) {
      console.log(`data found for ${formattedDate}`);
      return;
    }
    console.log(`data not found for ${formattedDate}, fetching...`);
      
    fetch(`https://marvelcdb.com/api/public/decklists/by_date/${formattedDate}`)
    .then(response => {
      if (response.status === 404) {
        console.log(`No decklists found for date ${formattedDate}`);
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        return response.json();
      }
    })
    .then(decks => {

      decks.forEach(deck => {
        const { date_creation, investigator_code, slots, meta } = deck;
          
        //pull aspect from meta, if possible
        let aspect = meta && meta !== '' ? JSON.parse(meta).aspect : null;
        if (investigator_code == '21031a') {//Adam Warlock
          aspect = 'none';
        } else if (investigator_code == '04031a') {//Spider-Woman
          let aspect2 = meta && meta !== '' ? JSON.parse(meta).aspect2 : null;
          if ((aspect == null ) || (aspect2 == null)) {
            return;
          }
          const aspectArr = [aspect, aspect2].sort();
          aspect = aspectArr.join('/');
        }
        if (aspect == null) {
          return;
        }

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
          // console.log(results);
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
            // console.log(results);
            decks_id = results.insertId;
            // console.log(`inserted ${decks_id}`);
            
            for (const slot in slots) {
              //pull the card code, ignore the #/copies
              const cardCode = slot.split(':')[0];
              const dlSql = `INSERT INTO decklists (decks_id, code) VALUES (?, ?)`;
              const dlValues = [decks_id, cardCode];
              connection.query(dlSql, dlValues, (error, results) => {
                if (error) {
                  console.log(error);
                }
              });
            }
            // console.log(`inserted ${decks_id} decklist`);
          });
        });
      });
    });
  });
}


// Call this function once per day to update the deck data
export function startRipDeckDataInterval(connection) {
  ripDeckData(connection);
  setInterval(() => ripDeckData(connection), 24 * 60 * 60 * 1000);
}