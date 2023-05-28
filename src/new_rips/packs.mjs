import fetch from "node-fetch";

// fill the packs table in the database
export async function updatePackData(connection) {
  // we may need to change this make it an argument for the function
  fetch("https://marvelcdb.com/api/public/packs/")
  .then(response => response.json())
  .then(data => {
    // make empty list of pack results
    const packs = [];

    // grab the pack_code and pack_name
    data.forEach(item => {
      const packCode = item.code;
      const packName = item.name;
      const pack = { packCode, packName };
      packs.push(pack);
    });

    packs.forEach(pack => {
      // IGNORE keyword means we won't try to shove it in again if it's already there
      const sql = `INSERT IGNORE INTO packs (pack_code, pack_name) VALUES (?, ?)`;
      const values = [pack.packCode, pack.packName];
    
      connection.query(sql, values, (error, results) => {
        if (error) {
          console.log(error);
        }
      });
    });

  })
  .catch(error => {
    console.log(error);
  });

  console.log("done with packs");
}