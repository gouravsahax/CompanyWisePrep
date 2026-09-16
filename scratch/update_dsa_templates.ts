import { prisma } from "../lib/prisma";

async function main() {
  const templates = {
    cmu2lswdw00008ku9y25e8j0q: {
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> topKFrequentProducts(vector<int>& a, int k) {\n        // Your code here\n    }\n};`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static List<Integer> topKFrequentProducts(int[] arr, int k) {\n        // Your code here\n    }\n}`,
      python: `from collections import Counter\n\ndef topKFrequentProducts(arr, k):\n    # Your code here\n    pass`,
      javascript: `function topKFrequentProducts(arr, k) {\n    // Your code here\n}`
    },
    cmu33jmo20001kgu9f0hr8omj: {
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        // Your code here\n    }\n};`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static boolean isValid(String s) {\n        // Your code here\n    }\n}`,
      python: `def isValidComponentNesting(s):\n    # Your code here\n    pass`,
      javascript: `function isValidComponentNesting(s) {\n    // Your code here\n}`
    },
    cmu33jmfu0000kgu9n58xu9wm: {
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findKthHighest(vector<int>& ratings, int k) {\n        // Your code here\n    }\n};`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static int findKthHighest(int[] ratings, int k) {\n        // Your code here\n    }\n}`,
      python: `def findKthHighest(ratings, k):\n    # Your code here\n    pass`,
      javascript: `function findKthHighest(ratings, k) {\n    // Your code here\n}`
    },
    cmu2lswkv00018ku94ve7qpva: {
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    int shortestSubarraySum(vector<int>& a, int target) {\n        // Your code here\n    }\n};`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static int shortestSubarraySum(int[] nums, int target) {\n        // Your code here\n    }\n}`,
      python: `def shortestSubarraySum(nums, target):\n    # Your code here\n    pass`,
      javascript: `function shortestSubarraySum(nums, target) {\n    // Your code here\n}`
    }
  };

  for (const [id, templateObj] of Object.entries(templates)) {
    await prisma.dSAQuestion.update({
      where: { id },
      data: { templates: templateObj }
    });
    console.log(`Updated templates for question ${id}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
