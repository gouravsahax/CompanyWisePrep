const { Pool } = require('pg');
require('dotenv').config({ path: 'd:/companywiseprep/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  const res = await pool.query('SELECT id, title, "runTestCases", "submitTestCases" FROM "DSAQuestion" WHERE title = \'Shortest Subarray Meeting Order Threshold\'');
  
  for (const row of res.rows) {
    let changed = false;
    
    for (const field of ['submitTestCases']) {
      let testCases = typeof row[field] === 'string' ? JSON.parse(row[field]) : row[field];
      
      for (let i = 0; i < testCases.length; i++) {
        let tc = testCases[i];
        if (tc.input.includes('1x19')) {
           tc.execArgs = [ [...Array(19).fill(1), 100], 100 ];
           tc.execOutput = 1;
           changed = true;
           console.log("Fixed 1x19 case!");
        }
      }
      
      if (changed) {
         await pool.query(`UPDATE "DSAQuestion" SET "${field}" = $1 WHERE id = $2`, [JSON.stringify(testCases), row.id]);
         console.log(`Saved ${row.title}`);
      }
    }
  }
  pool.end();
}

run();
