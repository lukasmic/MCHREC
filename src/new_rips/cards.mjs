import fetch from "node-fetch";

// fill the packs table in the database
export async function updateCardData(pool, pack) {
  
  // we may need to change this make it an argument for the function
  const response = await fetch(`https://marvelcdb.com/api/public/cards/${pack}`);
  const cards = await response.json();
 
  for (let card of cards) {
    const { code, pack_code, name, subname = null, type_code, imagesrc = null, text, faction_code, card_set_type_name_code = null, duplicate_of_code = null, url } = card;
    
    // query the aspects table to get the aspect_id
    const sql = `SELECT aspect_id FROM aspects WHERE aspect_name = ?`;
    const values = [faction_code];
    
    const [results] = await pool.query(sql, values);


        // faction code might be 'encounter' which is actually a red herring for either villain or modular - in which case ther will also be a card_set_type_name_code that will give us the truth

        let aspect_id;
        if (card_set_type_name_code != 'villain'  && card_set_type_name_code !== 'modular') {
          aspect_id = results[0].aspect_id;
        // } else if (card_set_type_name_code == 'modular') {
        //   aspect_id = 9;
        // } else if (card_set_type_name_code == 'villain') {
        //   aspect_id = 8;
        } else {
          // console.log(`I'm an idiot code ${code}`);
          continue;
        }
      
        // console.log(aspect_id);

        if(!duplicate_of_code) {
          console.log(`${code} is unique`);
                  // insert the card into the master_cards table
          const insertSql = `INSERT IGNORE INTO master_cards (master_code, name, subname, card_type, photo_url, text_box, aspect_id, card_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
          const insertValues = [code, name, subname, type_code, imagesrc, text, aspect_id, url];
            
          pool.query(insertSql, insertValues, (error, results) => {
            if (error) {
              console.log(error);
            }
          }).then(console.log(`inserted ${code} into master`))
            .then(insertCardVersion(pool, code, pack_code, code));
          
        } else {
          console.log(`${code} is a dupe of ${duplicate_of_code}`);
          
          const checkDuplicateSql = `
          SELECT EXISTS (
              SELECT 1
              FROM master_cards
              WHERE master_code = ?
          )`;

          const checkDuplicateValues = [duplicate_of_code];

          const [checkDuplicateResult] = await pool.query(checkDuplicateSql, checkDuplicateValues);
          // console.log(checkDuplicateResult[0]); 
          const resultValue = Object.values(checkDuplicateResult[0])[0];
          // console.log(resultValue);

          if (resultValue === 1) {
            //we are referencing the master_code as expected and may proceed
            console.log(`our dupe ${code} does in fact have a master_code ${duplicate_of_code}`);
            insertCardVersion(pool, code, pack_code, duplicate_of_code);
          } else if (resultValue === 0) {
            //this card is a duplicate of a duplicate and thus we must find the TRUE master_code
            console.log(`Our dupe ${code} references a dupe ${duplicate_of_code}, how fun!`);
            const findMasterSql = `SELECT master_code FROM card_versions WHERE code = ?`;
            const findMasterValues = [duplicate_of_code];
            const [masterResults] = await pool.query(findMasterSql, findMasterValues);
            console.log([masterResults]);
            const master_code = masterResults[0].master_code;
            insertCardVersion(pool, code, pack_code, master_code);
          } else {
            console.log(`Somehow we failed to find the true master_code for code ${code} duplicate of ${duplicate_of_code}`);
          }
        }
  }
}


async function insertCardVersion(pool, version_code, pack_code, master_code) {
          // insert the card into the card_versions table
          const versionSql = `INSERT IGNORE INTO card_versions (code, pack_code, master_code) VALUES (?, ?, ?)`;
          const versionValues = [version_code, pack_code, master_code];
      
          pool.query(versionSql, versionValues, (error, results) => {
            if (error) {
              console.log(error);
            }
          }).then(console.log(`inserted ${version_code} into card_versions`));
}


export async function updateCardUrl(pool, pack) {
  fetch(`https://marvelcdb.com/api/public/cards/${pack}`)
    .then(response => response.json())
    .then(cards => {
      cards.forEach(card => {
        const { code, url, duplicate_of_code } = card;

        if (!duplicate_of_code) {
          // Update the master_cards table with the card_url
          const updateSql = `UPDATE master_cards SET card_url = ? WHERE master_code = ?`;
          const updateValues = [url, code];

          pool.query(updateSql, updateValues, (error, results) => {
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