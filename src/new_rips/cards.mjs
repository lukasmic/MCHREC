import fetch from "node-fetch";

// fill the packs table in the database
export async function updateCardData(connection, pack) {
  
  // we may need to change this make it an argument for the function
  fetch(`https://marvelcdb.com/api/public/cards/${pack}`)
  .then(response => response.json())
  .then(cards => {

    cards.forEach(card => {
      const { code, pack_code, name, subname = null, type_code, imagesrc = null, text, faction_code, card_set_type_name_code = null, duplicate_of_code = null, url } = card;
    
      // query the aspects table to get the aspect_id
      const sql = `SELECT aspect_id FROM aspects WHERE aspect_name = ?`;
      const values = [faction_code];
    
      connection.query(sql, values, (error, results) => {
        if (error) {
          console.log(error);
          return;
        }

        // faction code might be 'encounter' which is actually a red herring for either villain or modular - in which case ther will also be a card_set_type_name_code that will give us the truth

        let aspect_id;
        if (card_set_type_name_code != 'villain'  && card_set_type_name_code !== 'modular') {
          aspect_id = results[0].aspect_id;
        } else if (card_set_type_name_code == 'modular') {
          aspect_id = 9;
        } else if (card_set_type_name_code == 'villain') {
          aspect_id = 8;
        } else {
          console.log(`I'm an idiot code ${code}`);
        }
        

        // console.log(aspect_id);

        if(!duplicate_of_code) {
                  // insert the card into the master_cards table
          const insertSql = `INSERT IGNORE INTO master_cards (master_code, name, subname, card_type, photo_url, text_box, aspect_id, card_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
          const insertValues = [code, name, subname, type_code, imagesrc, text, aspect_id, url];
            
          connection.query(insertSql, insertValues, (error, results) => {
            if (error) {
              console.log(error);
            }
          });
          console.log(`inserted ${code} into master`);
        } else {
          console.log(`${code} is a dupe`);
        }
    
        // insert the card into the card_versions table
        const versionSql = `INSERT IGNORE INTO card_versions (code, pack_code, master_code) VALUES (?, ?, ?)`;
        const versionValues = [code, pack_code, duplicate_of_code || code];
    
        connection.query(versionSql, versionValues, (error, results) => {
          if (error) {
            console.log(error);
          }
        });

      });
      return;
    });
    
  });
}

export async function updateCardUrl(connection, pack) {
  fetch(`https://marvelcdb.com/api/public/cards/${pack}`)
    .then(response => response.json())
    .then(cards => {
      cards.forEach(card => {
        const { code, url, duplicate_of_code } = card;

        if (!duplicate_of_code) {
          // Update the master_cards table with the card_url
          const updateSql = `UPDATE master_cards SET card_url = ? WHERE master_code = ?`;
          const updateValues = [url, code];

          connection.query(updateSql, updateValues, (error, results) => {
            if (error) {
              console.log(error);
            } else {
              console.log(`Updated card_url for ${code}`);
            }
          });
        } else {
          console.log(`${code} is a dupe`);
        }
      });
    });
}