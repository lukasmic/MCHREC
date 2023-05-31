import fs from "fs";
import fetch from "node-fetch";
import { getJSON } from "../js/utils.js";


//for ease of use this will be the 
export async function updateHeroData(connection) {
  const heroFile = JSON.parse(fs.readFileSync("src/json/hero_names.json"));

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


}