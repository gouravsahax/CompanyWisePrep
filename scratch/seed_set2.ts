import { prisma } from '../lib/prisma';

async function main() {
  const company = await prisma.company.findUnique({
    where: { slug: 'amazon' },
    include: { roles: true }
  });

  if (!company) {
    console.error('Amazon company not found in DB');
    return;
  }

  const role = company.roles.find(r => r.name.toLowerCase().includes('front end') || r.name.toLowerCase().includes('frontend'));
  
  if (!role) {
    console.error('Frontend Engineer Intern role not found for Amazon');
    return;
  }

  const q1 = {
    title: "Kth Highest Product Rating",
    description: "You're given an array ratings of product review scores (can repeat, can be negative — e.g. a defective-product penalty score) and an integer k. Return the k-th largest value in the array (1-indexed: k=1 means the maximum, k=len(ratings) means the minimum).\n\nIf ratings is empty, or k is out of the valid range [1, len(ratings)], return None/null.",
    constraints: "0 ≤ ratings.length ≤ 2×10^5\n-10^9 ≤ ratings[i] ≤ 10^9\n1 ≤ k ≤ ratings.length (when array non-empty)\nDuplicates allowed and must be counted individually (not deduplicated)",
    topic: "Sorting",
    dataStructure: "Array",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    timeBudget: "15-20 min",
    examples: [
      { input: "ratings=[3,2,1,5,6,4], k=2", output: "5", explanation: "Sorted desc: [6,5,4,3,2,1] → 2nd largest is 5" },
      { input: "ratings=[3,2,3,1,2,4,5,5,6], k=4", output: "4", explanation: "Sorted desc: [6,5,5,4,3,3,2,2,1] → 4th largest is 4" }
    ],
    runTestCases: [
      { input: "3 2 1 5 6 4\n2", output: "5", execInput: [ [3,2,1,5,6,4], 2 ], execOutput: 5 },
      { input: "3 2 3 1 2 4 5 5 6\n4", output: "4", execInput: [ [3,2,3,1,2,4,5,5,6], 4 ], execOutput: 4 }
    ],
    submitTestCases: [
      { input: "3 2 1 5 6 4\n2", output: "5", execInput: [ [3,2,1,5,6,4], 2 ], execOutput: 5 },
      { input: "3 2 3 1 2 4 5 5 6\n4", output: "4", execInput: [ [3,2,3,1,2,4,5,5,6], 4 ], execOutput: 4 },
      { input: "1 2 3 4 5\n1", output: "5", execInput: [ [1,2,3,4,5], 1 ], execOutput: 5 },
      { input: "1 2 3 4 5\n5", output: "1", execInput: [ [1,2,3,4,5], 5 ], execOutput: 1 },
      { input: "7\n1", output: "7", execInput: [ [7], 1 ], execOutput: 7 },
      { input: "4 4 4 4\n2", output: "4", execInput: [ [4,4,4,4], 2 ], execOutput: 4 },
      { input: "-1 -5 3 0 -2\n3", output: "-1", execInput: [ [-1,-5,3,0,-2], 3 ], execOutput: -1 },
      { input: "\n1", output: "null", execInput: [ [], 1 ], execOutput: null },
      { input: "1 2 3\n0", output: "null", execInput: [ [1,2,3], 0 ], execOutput: null },
      { input: "1 2\n5", output: "null", execInput: [ [1,2], 5 ], execOutput: null },
      { input: "9 8 7 6 5\n3", output: "7", execInput: [ [9,8,7,6,5], 3 ], execOutput: 7 },
      { input: "1 2 3 4 5\n3", output: "3", execInput: [ [1,2,3,4,5], 3 ], execOutput: 3 },
      { input: "5 1\n2", output: "1", execInput: [ [5,1], 2 ], execOutput: 1 }
    ],
    correctSolution: {
      cpp: `class Solution {
public:
    int kthLargest(vector<int> a, int k) {
        if (a.empty() || k < 1 || k > (int)a.size()) return INT_MIN;
        sort(a.begin(), a.end(), greater<int>());
        return a[k - 1];
    }
};`,
      java: `import java.util.*;

public class Solution {
    public static Integer kthLargest(int[] ratings, int k) {
        if (ratings.length == 0 || k < 1 || k > ratings.length) return null;
        Integer[] a = Arrays.stream(ratings).boxed().toArray(Integer[]::new);
        Arrays.sort(a, Collections.reverseOrder());
        return a[k - 1];
    }
}`,
      python: `def kthLargestRating(ratings, k):
    if not ratings or k <= 0 or k > len(ratings):
        return None
    return sorted(ratings, reverse=True)[k - 1]`
    }
  };

  const q2 = {
    title: "Valid Component Nesting",
    description: "On Amazon's product page builder, UI components are represented as a string of nested bracket tokens — ( ) for a <Card>-style container, [ ] for a <Section>, { } for a <Grid>. A layout string is valid if:\n\n1. Every opening token has a matching closing token of the same type.\n2. Opening tokens are closed in the correct (LIFO) order — the most recently opened component must be the next one closed.\n\nGiven a string s containing only these six bracket characters, return true if the layout is valid, false otherwise.",
    constraints: "0 ≤ s.length ≤ 2×10^5\ns contains only ()[]{}\nEmpty string is considered valid",
    topic: "Stack",
    dataStructure: "Stack (LIFO)",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n) worst case",
    timeBudget: "15-20 min",
    examples: [
      { input: 's="({[]})"', output: "true", explanation: "Properly nested: {} inside [] inside (), all closed in correct order" },
      { input: 's="({[}])"', output: "false", explanation: "[ is closed by } — wrong type, and out of LIFO order" }
    ],
    runTestCases: [
      { input: "({[]})", output: "true", execInput: [ "({[]})" ], execOutput: true },
      { input: "({[}])", output: "false", execInput: [ "({[}])" ], execOutput: false }
    ],
    submitTestCases: [
      { input: "({[]})", output: "true", execInput: [ "({[]})" ], execOutput: true },
      { input: "({[}])", output: "false", execInput: [ "({[}])" ], execOutput: false },
      { input: "", output: "true", execInput: [ "" ], execOutput: true },
      { input: "(", output: "false", execInput: [ "(" ], execOutput: false },
      { input: ")", output: "false", execInput: [ ")" ], execOutput: false },
      { input: "(]", output: "false", execInput: [ "(]" ], execOutput: false },
      { input: "()]", output: "false", execInput: [ "()]" ], execOutput: false },
      { input: "(()", output: "false", execInput: [ "(()" ], execOutput: false },
      { input: "((((()))))", output: "true", execInput: [ "((((()))))" ], execOutput: true },
      { input: "()[]{}", output: "true", execInput: [ "()[]{}" ], execOutput: true },
      { input: "([)]", output: "false", execInput: [ "([)]" ], execOutput: false },
      { input: "(((", output: "false", execInput: [ "(((" ], execOutput: false },
      { input: ")))", output: "false", execInput: [ ")))" ], execOutput: false },
      { input: "{[()()]}", output: "true", execInput: [ "{[()()]}" ], execOutput: true },
      { input: "{[(])}", output: "false", execInput: [ "{[(])}" ], execOutput: false }
    ],
    correctSolution: {
      cpp: `class Solution {
public:
    bool isValid(string s) {
        string st;
        unordered_map<char,char> m = {{')','('},{']','['},{'}','{'}};
        for (char c : s) {
            if (c == '(' || c == '[' || c == '{') st.push_back(c);
            else {
                if (st.empty() || st.back() != m[c]) return false;
                st.pop_back();
            }
        }
        return st.empty();
    }
};`,
      java: `import java.util.*;

public class Solution {
    public static boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
            } else {
                if (stack.isEmpty() || stack.pop() != pairs.get(c)) return false;
            }
        }
        return stack.isEmpty();
    }
}`,
      python: `def isValidComponentNesting(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        else:
            if not stack or stack[-1] != pairs[ch]:
                return False
            stack.pop()
    return not stack`
    }
  };

  // Insert questions
  const oaSetNo = 2;

  await prisma.dSAQuestion.create({
    data: {
      ...q1,
      companyId: company.id,
      roleId: role.id,
      oaSetNo
    }
  });

  await prisma.dSAQuestion.create({
    data: {
      ...q2,
      companyId: company.id,
      roleId: role.id,
      oaSetNo
    }
  });

  console.log('Successfully created Set 2 for Amazon Front End Engineer Intern');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
