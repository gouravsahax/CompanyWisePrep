import 'dotenv/config'
import { prisma } from '../lib/prisma'

async function main() {
  const pattern = `Amazon Front End Engineer Intern OA — 2026 pattern (from recent candidate reports):

Format: 90–120 min, HackerRank-hosted, no autocomplete/docs allowed.

Section 1 — Vanilla JS UI build (dominant pattern)
Not React. Raw JS + HTML/CSS DOM manipulation. Two recurring variants:

Form + table: build a form, validate fields (client-side), on valid submit append row to a table/list. Handle invalid states.
Wishlist/list app: render supplied list, add/remove items, search/filter, pagination, mark/unmark toggle.

Graders check: correct DOM updates, edge-case handling (empty input, duplicate entries, invalid data), no framework crutch.

Section 2 — DSA (2 problems)
Standard LeetCode easy-medium. Arrays, strings, hashmaps, trees. Same bar as SDE intern OA, not frontend-specific.

Section 3 — React debugging (some variants instead of/added to section 1)
Given a broken React component/task, find the bug, fix it, tests must pass. Tests DOM/behavior, not visual polish.

Section 4 — Work Style / Leadership Principles survey
Situational judgment questions mapped to Amazon's 16 LPs, paired statements to catch inconsistency. Not coding — behavioral self-report.`;

  const result = await prisma.role.updateMany({
    where: { 
      name: 'Front End Engineer Intern',
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
