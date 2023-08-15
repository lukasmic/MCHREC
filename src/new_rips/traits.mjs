export async function updateTraits(connection, pack) {
  fetch(`https://marvelcdb.com/api/public/cards/${pack}`)
    .then(response => response.json())
    .then(cards => {
      cards.forEach(card => {
        const { code, traits } = card;

        if (traits && typeof traits === 'string') {
          // Split the traits string into an array of traits
          const traitsArray = traits.split('. ').map(trait => {
            // Remove leading and trailing whitespace
            trait = trait.trim();
          
            // If the trait ends with '.', remove it
            if (trait.endsWith('.') && trait !== 'S.H.I.E.L.D.') {
              trait = trait.slice(0, -1);
            }
          
            return trait;
          });

          traitsArray.forEach(trait => {
            // Check if the trait already exists in the table
            const selectSql = `SELECT * FROM traits WHERE trait_name = ?`;
            const selectValues = [trait];
          
            connection.query(selectSql, selectValues, async (error, results) => {
              if (error) {
                console.log(error);
              } else {
                // If the trait does not exist, insert it
                if (results.length === 0) {
                  const insertSql = `INSERT INTO traits (trait_name) VALUES (?)`;
                  const insertValues = [trait];
          
                  connection.query(insertSql, insertValues, (error, results) => {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log(`Inserted ${trait} into traits`);
                    }
                  });
                }
                // If the card has a matching master_code in the master_cards table,
                // insert the associated traits_id and master_code into the card_traits table

                const traitIdSql = `SELECT traits_id FROM traits WHERE trait_name = ?`;
const traitIdValues = [trait];

                connection.query(traitIdSql, traitIdValues, (error, results) => {
                  if (error) {
                    console.log(error);
                  } else {
                    // Check if results is not empty
                    if (results.length > 0) {
                      const traitsId = results[0].traits_id;
                      
                
                      // Check if the record already exists in the 'card_traits' table
                      const checkSql = `
                        SELECT * FROM card_traits 
                        WHERE master_code = ? AND traits_id = ?
                      `;
                      const checkValues = [code, traitsId];
                
                      connection.query(checkSql, checkValues, (error, results) => {
                        if (error) {
                          console.log(error);
                        } else if (results.length === 0) { // If the record does not exist, insert it
                          const insertCardTraitSql = `
                            INSERT INTO card_traits (master_code, traits_id) 
                            VALUES (?, ?)
                          `;
                          const insertCardTraitValues = [code, traitsId];
                
                          connection.query(insertCardTraitSql, insertCardTraitValues, (error, results) => {
                            if (error) {
                              console.log(error);
                            } else {
                              console.log(`Inserted ${code} and ${traitsId} into card_traits`);
                            }
                          });
                        } else {
                          console.log(`Record with ${code} and ${traitsId} already exists in card_traits`);
                        }
                      });
                    } else {
                      console.log(`No trait found with name ${trait}`);
                    }
                  }
                });
                
              }
            });
          });
        } else {
          // console.log('Unexpected card object:', card);
        }
      });
    });
}