const { Pool } = require('pg');
require('dotenv').config({ path: 'd:/companywiseprep/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  const res = await pool.query('SELECT id, title, "runTestCases", "submitTestCases" FROM "DSAQuestion"');
  
  for (const row of res.rows) {
    let changed = false;
    
    for (const field of ['runTestCases', 'submitTestCases']) {
      if (!row[field]) continue;
      
      let testCases = typeof row[field] === 'string' ? JSON.parse(row[field]) : row[field];
      if (!Array.isArray(testCases)) continue;
      
      for (let i = 0; i < testCases.length; i++) {
        let tc = testCases[i];
        if (!tc.execArgs && !tc.execInput) {
          console.log(`Fixing ${row.title} - ${field} - Index ${i}`);
          console.log(`Input: ${tc.input}`);
          console.log(`Output: ${tc.output}`);
          
          // attempt to parse
          try {
             let args = [];
             let inputStr = tc.input;
             
             // special case for Shortest Subarray Meeting Order Threshold
             if (row.title === 'Shortest Subarray Meeting Order Threshold') {
                if (inputStr.includes('nums=[1]x100000')) {
                   args.push(Array(100000).fill(1));
                   args.push(100000);
                } else if (inputStr.includes('nums=[100000]x100000')) {
                   args.push(Array(100000).fill(100000));
                   args.push(100000);
                } else if (inputStr.includes('nums=[1..10]')) {
                   args.push([1,2,3,4,5,6,7,8,9,10]);
                   args.push(15);
                } else {
                   const match = inputStr.match(/nums=\[(.*?)\],\s*target=(\d+)/);
                   if (match) {
                     args.push(match[1] ? match[1].split(',').map(Number) : []);
                     args.push(Number(match[2]));
                   }
                }
             } else {
                console.log("NEEDS MANUAL PARSING");
             }
             
             if (args.length > 0) {
               tc.execArgs = args;
               tc.execOutput = Number(tc.output) || (tc.output === '0' ? 0 : (tc.output === 'false' ? false : tc.output === 'true' ? true : tc.output));
               if (typeof tc.execOutput === 'string' && tc.execOutput.startsWith('[')) {
                 try { tc.execOutput = JSON.parse(tc.execOutput); } catch(e){}
               }
               changed = true;
               console.log("Fixed!");
             }
          } catch(e) {
             console.error(e);
          }
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
