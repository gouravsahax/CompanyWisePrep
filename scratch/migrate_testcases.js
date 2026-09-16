const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Hardcoded explicit machine-readable testcases for the 2 DB questions
const mappings = {
  "Top K Frequent Product IDs": {
    "run": [
      { execArgs: [[4,4,1,2,2,2,3], 2], execOutput: [2,4] },
      { execArgs: [[5,5,5,7,7,9], 1], execOutput: [5] }
    ],
    "submit": [
      { execArgs: [[4,4,1,2,2,2,3], 2], execOutput: [2,4] },
      { execArgs: [[5,5,5,7,7,9], 1], execOutput: [5] },
      { execArgs: [[1], 1], execOutput: [1] },
      { execArgs: [[1,2,3,4,5], 3], execOutput: [1,2,3] },
      { execArgs: [[2,2,2,2], 1], execOutput: [2] },
      { execArgs: [[7,7,8,8,9,9], 2], execOutput: [7,8] },
      { execArgs: [[10,10,10,20,20,30], 5], execOutput: [10,20,30] },
      { execArgs: [[], 3], execOutput: [] },
      { execArgs: [[1,2], 0], execOutput: [] },
      { execArgs: [[1,2], 5], execOutput: [1,2] },
      { execArgs: [[100,100,99,99,98], 2], execOutput: [99,100] },
      { execArgs: [[3,3,3,3,3,3,3,3,3,3], 1], execOutput: [3] },
      { execArgs: [[1,1,2,2,3,3,4,4,5,5], 5], execOutput: [1,2,3,4,5] },
      { execArgs: [[-1,-1,-2,-3,-3,-3], 2], execOutput: [-3,-1] },
      { execArgs: [Array.from({length: 100000}, (_, i) => i+1), 3], execOutput: [1,2,3] }
    ]
  },
  "Shortest Subarray Meeting Order Threshold": {
    "run": [
      { execArgs: [[2,3,1,2,4,3], 7], execOutput: 2 },
      { execArgs: [[1,4,4], 4], execOutput: 1 }
    ],
    "submit": [
      { execArgs: [[2,3,1,2,4,3], 7], execOutput: 2 },
      { execArgs: [[1,4,4], 4], execOutput: 1 },
      { execArgs: [[1,1,1,1,1,1,1,1], 11], execOutput: 0 },
      { execArgs: [[1,2,3,4,5], 11], execOutput: 3 },
      { execArgs: [[1,2,3,4,5], 15], execOutput: 5 },
      { execArgs: [[1,2,3,4,5], 16], execOutput: 0 }
    ]
  }
};

async function main() {
  const questions = await prisma.dSAQuestion.findMany();
  for (const q of questions) {
    if (!mappings[q.title]) {
      console.log(`Skipping unknown question: ${q.title}`);
      continue;
    }
    
    const runData = mappings[q.title].run;
    const submitData = mappings[q.title].submit;

    // Inject execArgs and execOutput into the existing JSON
    const newRunTestCases = q.runTestCases.map((tc, idx) => {
      const data = runData[idx];
      if (!data) return tc;
      return { ...tc, execArgs: data.execArgs, execOutput: data.execOutput };
    });

    const newSubmitTestCases = q.submitTestCases.map((tc, idx) => {
      const data = submitData[idx];
      if (!data) return tc;
      return { ...tc, execArgs: data.execArgs, execOutput: data.execOutput };
    });

    await prisma.dSAQuestion.update({
      where: { id: q.id },
      data: {
        runTestCases: newRunTestCases,
        submitTestCases: newSubmitTestCases
      }
    });
    console.log(`Updated testcases for: ${q.title}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
