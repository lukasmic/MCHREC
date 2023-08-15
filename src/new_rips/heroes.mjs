import fs from "fs";


//for ease of use this will be the 
export async function updateHeroData(connection) {
  const heroFile = JSON.parse(fs.readFileSync("src/json/hero_names.json"));
  console.log("beginning to fill heroes table");
  for (const hero of heroFile) {
      const { code, heroname, alter_ego } = hero;
      const sql = `INSERT IGNORE INTO heroes (master_code, hero_name, alter_ego_name) VALUES (?, ?, ?)`;
      const values = [code, heroname, alter_ego];

      connection.query(sql, values, (error, results) => {
        if (error) {
          console.log(error); 
        }
        
      });

    }
    console.log("finished with hero table")

}