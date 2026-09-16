const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_1gw7aVBrfEAo@ep-royal-block-a5ga414p-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function main() {
  const res = await pool.query('SELECT "title", "runTestCases", "submitTestCases" FROM "DSAQuestion" WHERE "title" LIKE \'%Highest%\'');
  console.log(JSON.stringify(res.rows[0], null, 2));
  await pool.end();
}

main().catch(console.error);
