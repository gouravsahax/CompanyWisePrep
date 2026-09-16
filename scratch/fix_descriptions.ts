import { prisma } from '../lib/prisma';

async function main() {
  const qId = 'cmu33jmfu0000kgu9n58xu9wm';
  const q = await prisma.dSAQuestion.findUnique({
    where: { id: qId }
  });
  
  if (!q) {
    console.error("Question not found");
    return;
  }

  // 1. Update Description
  const newDescription = `You're given an array ratings of product review scores (can repeat, can be negative — e.g. a defective-product penalty score) and an integer k. Return the k-th largest value in the array (1-indexed: k=1 means the maximum, k=len(ratings) means the minimum).`;
  
  // 2. Update Constraints
  const newConstraints = `1 <= ratings.length <= 2×10^5
-10^9 <= ratings[i] <= 10^9
1 <= k <= ratings.length
Duplicates allowed and must be counted individually`;

  // 3. Filter Test Cases
  let runTestCases: any[] = typeof q.runTestCases === 'string' ? JSON.parse(q.runTestCases) : (q.runTestCases as any[]);
  let submitTestCases: any[] = typeof q.submitTestCases === 'string' ? JSON.parse(q.submitTestCases) : (q.submitTestCases as any[]);
  
  const filterValid = (tc: any) => {
    const arr = tc.execInput[0];
    const k = tc.execInput[1];
    return arr.length >= 1 && k >= 1 && k <= arr.length;
  };
  
  runTestCases = runTestCases.filter(filterValid);
  submitTestCases = submitTestCases.filter(filterValid);
  
  // 4. Update Solutions
  const solsStr = q.correctSolution || "{}";
  let sols: any = {};
  try {
    sols = JSON.parse(solsStr);
  } catch (e) {
    console.error("Error parsing solutions", e);
  }
  
  if (sols["cpp"]) {
    sols["cpp"] = `class Solution {
public:
    int solve(vector<int>& ratings, int k) {
        priority_queue<int, vector<int>, greater<int>> minHeap;
        for (int rating : ratings) {
            minHeap.push(rating);
            if (minHeap.size() > k) {
                minHeap.pop();
            }
        }
        return minHeap.top();
    }
};`;
  }
  
  if (sols["java"]) {
    sols["java"] = `class Solution {
    public int solve(int[] ratings, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        for (int rating : ratings) {
            minHeap.offer(rating);
            if (minHeap.size() > k) {
                minHeap.poll();
            }
        }
        return minHeap.peek();
    }
}`;
  }
  
  if (sols["python"]) {
    sols["python"] = `import heapq

def solve(ratings, k):
    return heapq.nlargest(k, ratings)[-1]
`;
  }

  // 5. Save back to DB
  await prisma.dSAQuestion.update({
    where: { id: qId },
    data: {
      description: newDescription,
      constraints: newConstraints,
      runTestCases,
      submitTestCases,
      correctSolution: JSON.stringify(sols)
    }
  });
  
  console.log("Successfully updated question!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
