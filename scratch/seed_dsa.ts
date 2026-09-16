import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  let amazon = await prisma.company.findUnique({
    where: { slug: 'amazon' }
  });

  if (!amazon) {
    amazon = await prisma.company.create({
      data: {
        name: 'Amazon',
        slug: 'amazon',
        logo: '/company/amazon.png',
        oas: 10,
        difficulty: 'Medium'
      }
    });
  }

  let role = await prisma.role.findFirst({
    where: { companyId: amazon.id, name: { contains: 'Front End' } }
  });

  if (!role) {
    role = await prisma.role.create({
      data: {
        name: 'Front End Engineer Intern',
        companyId: amazon.id,
        oaCount: 2
      }
    });
  }

  // Delete existing ones to avoid duplicates if re-run
  await prisma.dSAQuestion.deleteMany({});

  const q1 = await prisma.dSAQuestion.create({
    data: {
      companyId: amazon.id,
      roleId: role.id,
      oaSetNo: 1,
      title: 'Top K Frequent Product IDs',
      description: `You are given an array \`arr\` representing product IDs viewed by customers on an e-commerce page, and an integer \`k\`. Return the \`k\` product IDs that occur most frequently in \`arr\`.

If two or more product IDs have the same frequency, order them by product ID in ascending order. The final result must be sorted primarily by frequency (descending), then by product ID (ascending) as a tiebreaker.`,
      topic: 'Hashing + Sorting',
      dataStructure: 'Hash Map + Array',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      timeBudget: '20–25 min',
      correctSolution: {
        python: `from collections import Counter\n\ndef topKFrequentProducts(arr, k):\n    if k <= 0 or not arr:\n        return []\n    freq = Counter(arr)\n    items = sorted(freq.items(), key=lambda x: (-x[1], x[0]))\n    return [product_id for product_id, count in items[:k]]`,
        java: `import java.util.*;\n\npublic class Solution {\n    public static List<Integer> topKFrequentProducts(int[] arr, int k) {\n        List<Integer> result = new ArrayList<>();\n        if (k <= 0 || arr.length == 0) return result;\n\n        Map<Integer, Integer> freq = new HashMap<>();\n        for (int id : arr) freq.merge(id, 1, Integer::sum);\n\n        List<Map.Entry<Integer, Integer>> items = new ArrayList<>(freq.entrySet());\n        items.sort((a, b) -> !a.getValue().equals(b.getValue())\n                ? b.getValue() - a.getValue()\n                : a.getKey() - b.getKey());\n\n        for (int i = 0; i < Math.min(k, items.size()); i++) {\n            result.add(items.get(i).getKey());\n        }\n        return result;\n    }\n}`
      },
      constraints: `- 0 <= arr.length <= 10^5
- -10^9 <= arr[i] <= 10^9
- 0 <= k <= arr.length
- If k exceeds the number of distinct IDs, return all distinct IDs
- If arr is empty or k = 0, return an empty array`,
      examples: [
        {
          input: 'arr=[4,4,1,2,2,2,3], k=2',
          output: '[2, 4]',
          explanation: '2 occurs 3×, 4 occurs 2× — top 2 by frequency'
        },
        {
          input: 'arr=[5,5,5,7,7,9], k=1',
          output: '[5]',
          explanation: '5 has highest frequency (3)'
        }
      ],
      runTestCases: [
        { input: 'arr=[4,4,1,2,2,2,3], k=2', output: '[2, 4]' },
        { input: 'arr=[5,5,5,7,7,9], k=1', output: '[5]' }
      ],
      submitTestCases: [
        { input: 'arr=[4,4,1,2,2,2,3], k=2', output: '[2, 4]' },
        { input: 'arr=[5,5,5,7,7,9], k=1', output: '[5]' },
        { input: 'arr=[1], k=1', output: '[1]' },
        { input: 'arr=[1,2,3,4,5], k=3', output: '[1, 2, 3]' },
        { input: 'arr=[2,2,2,2], k=1', output: '[2]' },
        { input: 'arr=[7,7,8,8,9,9], k=2', output: '[7, 8]' },
        { input: 'arr=[10,10,10,20,20,30], k=5', output: '[10, 20, 30]' },
        { input: 'arr=[], k=3', output: '[]' },
        { input: 'arr=[1,2], k=0', output: '[]' },
        { input: 'arr=[1,2], k=5', output: '[1, 2]' },
        { input: 'arr=[100,100,99,99,98], k=2', output: '[99, 100]' },
        { input: 'arr=[3,3,3,3,3,3,3,3,3,3], k=1', output: '[3]' },
        { input: 'arr=[1,1,2,2,3,3,4,4,5,5], k=5', output: '[1, 2, 3, 4, 5]' },
        { input: 'arr=[-1,-1,-2,-3,-3,-3], k=2', output: '[-3, -1]' },
        { input: 'arr=[1..100000], k=3 (n=10^5)', output: '[1, 2, 3]' }
      ]
    }
  });

  const q2 = await prisma.dSAQuestion.create({
    data: {
      companyId: amazon.id,
      roleId: role.id,
      oaSetNo: 1,
      title: 'Shortest Subarray Meeting Order Threshold',
      description: `You are given an array \`nums\` representing daily order counts, and an integer \`target\`. Find the length of the shortest contiguous subarray whose sum is greater than or equal to \`target\`. If no such subarray exists, return \`0\`.`,
      topic: 'Sliding Window / Two Pointers',
      dataStructure: 'Array',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      timeBudget: '20–25 min',
      correctSolution: {
        python: `def shortestSubarraySum(nums, target):\n    n = len(nums)\n    left = 0\n    curr_sum = 0\n    best = n + 1  # sentinel for "not found"\n\n    for right in range(n):\n        curr_sum += nums[right]\n        while curr_sum >= target:\n            best = min(best, right - left + 1)\n            curr_sum -= nums[left]\n            left += 1\n\n    return 0 if best == n + 1 else best`,
        java: `public class Solution {\n    public static int shortestSubarraySum(int[] nums, int target) {\n        int n = nums.length;\n        int left = 0;\n        long currSum = 0;\n        int best = n + 1;\n\n        for (int right = 0; right < n; right++) {\n            currSum += nums[right];\n            while (currSum >= target) {\n                best = Math.min(best, right - left + 1);\n                currSum -= nums[left];\n                left++;\n            }\n        }\n        return best == n + 1 ? 0 : best;\n    }\n}`
      },
      constraints: `- 0 <= nums.length <= 10^5
- 1 <= nums[i] <= 10^4 (non-negative — required for sliding window validity)
- 1 <= target <= 10^9
- If nums is empty, return 0`,
      examples: [
        {
          input: 'nums=[2,3,1,2,4,3], target=7',
          output: '2',
          explanation: '[4,3] sums to 7, length 2 — shortest'
        },
        {
          input: 'nums=[1,4,4], target=4',
          output: '1',
          explanation: '[4] alone meets target'
        }
      ],
      runTestCases: [
        { input: 'nums=[2,3,1,2,4,3], target=7', output: '2' },
        { input: 'nums=[1,4,4], target=4', output: '1' }
      ],
      submitTestCases: [
        { input: 'nums=[2,3,1,2,4,3], target=7', output: '2' },
        { input: 'nums=[1,4,4], target=4', output: '1' },
        { input: 'nums=[1,1,1,1,1], target=11', output: '0' },
        { input: 'nums=[5], target=5', output: '1' },
        { input: 'nums=[5], target=6', output: '0' },
        { input: 'nums=[1,2,3,4,5], target=15', output: '5' },
        { input: 'nums=[10,2,3], target=1', output: '1' },
        { input: 'nums=[], target=5', output: '0' },
        { input: 'nums=[1]x100000, target=100000 (n=10^5)', output: '100000' },
        { input: 'nums=[100000]x100000, target=100000', output: '1' },
        { input: 'nums=[1..10], target=15', output: '2' },
        { input: 'nums=[2,1,5,2,3,2], target=7', output: '2' },
        { input: 'nums=[2,1,5,2,8,3], target=7', output: '1' },
        { input: 'nums=[3,4,1,1,6], target=8', output: '3' },
        { input: 'nums=[1x19, 100], target=100', output: '1' }
      ]
    }
  });

  console.log('Seeded completely!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
