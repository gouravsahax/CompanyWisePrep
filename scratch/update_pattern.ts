import 'dotenv/config'
import { prisma } from '../lib/prisma'

async function main() {
  const pattern = `Amazon SDE I OA — 2026 pattern:

Structure (HackerRank, proctored, single sitting):

Coding: 2 problems, 70–90 min
Work Style Assessment: 15–20 min, situational judgment tied to Leadership Principles
Some batches add: debugging section, logical-reasoning/MCQ section`;

  const result = await prisma.role.updateMany({
    where: { 
      name: 'Software Development Engineer I',
      company: {
        slug: 'amazon'
      }
    },
    data: { pattern }
  })
  console.log('Updated rows:', result.count)
}

main()
  .catch(console.error)
