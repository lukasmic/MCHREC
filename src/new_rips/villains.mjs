export async function updateVillainSets(connection, pack) {
  fetch(`https://marvelcdb.com/api/public/cards/${pack}`)
      .then(response => response.json())
      .then(cards => {
          cards.forEach(card => {
              const { pack_code, card_set_code, card_set_name, card_set_type_name_code, code } = card;
              let insertSql, cardListInsertSql;
              console.log(pack_code, card_set_code, card_set_name, card_set_type_name_code, code);

              if (card_set_type_name_code === 'modular') {
                  // Insert into 'modulars' table
                  insertSql = `INSERT IGNORE INTO modulars (card_set_code, card_set_name, pack_code) VALUES (?, ?, ?)`;
                  // Insert into 'modular_cardlist' table
                  cardListInsertSql = `INSERT IGNORE INTO modular_cardlist (card_set_code, master_code) VALUES (?, ?)`;

                  
              } else if (card_set_type_name_code === 'villain') {
                  // Insert into 'villains' table
                  insertSql = `INSERT IGNORE INTO villains (card_set_code, card_set_name, pack_code) VALUES (?, ?, ?)`;
                  // Insert into 'villain_cardlist' table
                  cardListInsertSql = `INSERT IGNORE INTO villain_cardlist (card_set_code, master_code) VALUES (?, ?)`;
              }

              if (insertSql && cardListInsertSql) {
                  const insertValues = [card_set_code, card_set_name, pack_code];
                  const cardListInsertValues = [card_set_code, code];

                  // Insert into either 'modulars' or 'villains' table
                  connection.query(insertSql, insertValues, (error, results) => {
                      if (error) {
                          console.log(error);
                      } else {
                          console.log(`Inserted into table`);
                      }
                  });

                  // Insert into either 'modular_cardlist' or 'villain_cardlist' table
                  connection.query(cardListInsertSql, cardListInsertValues, (error, results) => {
                      if (error) {
                          console.log(error);
                      } else {
                          console.log(`Inserted into cardlist table`);
                      }
                  });
              }
          });
      });
}

