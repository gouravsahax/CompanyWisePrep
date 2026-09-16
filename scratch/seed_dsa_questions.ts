import 'dotenv/config'
import { prisma } from '../lib/prisma'

async function main() {
  const company = await prisma.company.findUnique({ where: { slug: 'amazon' } })
  if (!company) throw new Error('Company not found')
  
  const role = await prisma.role.findFirst({
    where: { 
      name: 'Front End Engineer Intern',
      companyId: company.id
    }
  })
  if (!role) throw new Error('Role not found')

  const q1 = {
    title: "Top K Frequent Product IDs",
    description: "You are given an array arr representing product IDs viewed by customers on an e-commerce page, and an integer k. Return the k product IDs that occur most frequently in arr.\n\nIf two or more product IDs have the same frequency, order them by product ID in ascending order. The final result must be sorted primarily by frequency (descending), then by product ID (ascending) as a tiebreaker.",
    constraints: "0 ≤ arr.length ≤ 10^5\n-10^9 ≤ arr[i] ≤ 10^9\n0 ≤ k ≤ arr.length (if k exceeds the number of distinct IDs, return all distinct IDs)\nIf arr is empty or k = 0, return an empty array",
    examples: [
      { input: "arr = [4, 4, 1, 2, 2, 2, 3], k = 2", output: "[2, 4]", explanation: "2 occurs 3 times, 4 occurs 2 times — these are the top 2 by frequency." },
      { input: "arr = [5, 5, 5, 7, 7, 9], k = 1", output: "[5]", explanation: "5 has the highest frequency (3)." }
    ],
    runTestCases: [
      { id: 1, input: "arr=[4,4,1,2,2,2,3], k=2", expected: "[2,4]" },
      { id: 2, input: "arr=[5,5,5,7,7,9], k=1", expected: "[5]" }
    ],
    submitTestCases: [
      { id: 1, input: "[4,4,1,2,2,2,3], k=2", expected: "[2,4]", checks: "base case" },
      { id: 2, input: "[5,5,5,7,7,9], k=1", expected: "[5]", checks: "base case" },
      { id: 3, input: "[1], k=1", expected: "[1]", checks: "single element" },
      { id: 4, input: "[1,2,3,4,5], k=3", expected: "[1,2,3]", checks: "all freq=1, tiebreak by ID" },
      { id: 5, input: "[2,2,2,2], k=1", expected: "[2]", checks: "single distinct value" },
      { id: 6, input: "[7,7,8,8,9,9], k=2", expected: "[7,8]", checks: "multiple ties" },
      { id: 7, input: "[10,10,10,20,20,30], k=5", expected: "[10,20,30]", checks: "k exceeds distinct IDs" },
      { id: 8, input: "[], k=3", expected: "[]", checks: "empty array" },
      { id: 9, input: "[1,2], k=0", expected: "[]", checks: "k=0" },
      { id: 10, input: "[1,2], k=5", expected: "[1,2]", checks: "k > array length" },
      { id: 11, input: "[100,100,99,99,98], k=2", expected: "[99,100]", checks: "tie at top, correct tiebreak order" },
      { id: 12, input: "[3]*10", expected: "[3]", checks: "large repeat of single value" },
      { id: 13, input: "[1,1,2,2,3,3,4,4,5,5], k=5", expected: "[1,2,3,4,5]", checks: "multiple ties, full tiebreak ordering" },
      { id: 14, input: "[-1,-1,-2,-3,-3,-3], k=2", expected: "[-3,-1]", checks: "negative IDs" },
      { id: 15, input: "list(range(1,100001)), k=3", expected: "[1,2,3]", checks: "TLE check — 10^5 elements, all freq=1" }
    ],
    companyId: company.id,
    roleId: role.id,
    oaSetNo: 1
  };

  const q2 = {
    title: "Shortest Subarray Meeting Order Threshold",
    description: "You are given an array nums representing daily order counts, and an integer target. Find the length of the shortest contiguous subarray whose sum is greater than or equal to target. If no such subarray exists, return 0.",
    constraints: "0 ≤ nums.length ≤ 10^5\n1 ≤ nums[i] ≤ 10^4 (all values non-negative — this matters for the sliding-window approach to be valid)\n1 ≤ target ≤ 10^9\nIf nums is empty, return 0",
    examples: [
      { input: "nums = [2, 3, 1, 2, 4, 3], target = 7", output: "2", explanation: "[4, 3] sums to 7 with length 2 — shortest possible." },
      { input: "nums = [1, 4, 4], target = 4", output: "1", explanation: "[4] alone meets the target." }
    ],
    runTestCases: [
      { id: 1, input: "nums=[2,3,1,2,4,3], target=7", expected: "2" },
      { id: 2, input: "nums=[1,4,4], target=4", expected: "1" }
    ],
    submitTestCases: [
      { id: 1, input: "[2,3,1,2,4,3], target=7", expected: "2", checks: "base case" },
      { id: 2, input: "[1,4,4], target=4", expected: "1", checks: "base case" },
      { id: 3, input: "[1,1,1,1,1], target=11", expected: "0", checks: "sum never reaches target" },
      { id: 4, input: "[5], target=5", expected: "1", checks: "single element exactly meets target" },
      { id: 5, input: "[5], target=6", expected: "0", checks: "single element, just short" },
      { id: 6, input: "[1,2,3,4,5], target=15", expected: "5", checks: "entire array required" },
      { id: 7, input: "[10,2,3], target=1", expected: "1", checks: "first element alone already exceeds target" },
      { id: 8, input: "[], target=5", expected: "0", checks: "empty array" },
      { id: 9, input: "[1]*100000, target=100000", expected: "100000", checks: "TLE check — large n, forces O(n) sliding window, not O(n²) brute force" },
      { id: 10, input: "[100000]*100000, target=100000", expected: "1", checks: "large n, early exit per window, still must run fast" },
      { id: 11, input: "[1,2,3,4,5,6,7,8,9,10], target=15", expected: "2", checks: "mid-array optimal window ([7,8])" },
      { id: 12, input: "[2,1,5,2,3,2], target=7", expected: "2", checks: "window shrink logic ([5,2])" },
      { id: 13, input: "[2,1,5,2,8,3], target=7", expected: "1", checks: "single large value mid-array" },
      { id: 14, input: "[3,4,1,1,6], target=8", expected: "3", checks: "window must grow past a dip before shrinking" },
      { id: 15, input: "[1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,100], target=100", expected: "1", checks: "last element alone satisfies; tests window doesn't get stuck expanding from start" }
    ],
    companyId: company.id,
    roleId: role.id,
    oaSetNo: 1
  };

  await prisma.dSAQuestion.createMany({
    data: [q1, q2]
  });

  console.log("Seeded DSA questions successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
