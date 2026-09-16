import { prisma } from '../lib/prisma';

const q1Solutions = {
  cpp: `class Solution {
public:
    vector<int> topKFrequentProducts(vector<int>& a, int k) {
        if (k <= 0 || a.empty()) return {};
        unordered_map<int,int> f;
        for (int x : a) f[x]++;
        vector<pair<int,int>> v(f.begin(), f.end());
        sort(v.begin(), v.end(), [](auto& p, auto& q) {
            return p.second != q.second ? p.second > q.second : p.first < q.first;
        });
        vector<int> r;
        for (int i = 0; i < min((int)v.size(), k); i++) r.push_back(v[i].first);
        return r;
    }
};`,
  java: `import java.util.*;

public class Solution {
    public static List<Integer> topKFrequentProducts(int[] arr, int k) {
        List<Integer> result = new ArrayList<>();
        if (k <= 0 || arr.length == 0) return result;

        Map<Integer, Integer> freq = new HashMap<>();
        for (int id : arr) freq.merge(id, 1, Integer::sum);

        List<Map.Entry<Integer, Integer>> items = new ArrayList<>(freq.entrySet());
        items.sort((x, y) -> !x.getValue().equals(y.getValue())
                ? y.getValue() - x.getValue()
                : x.getKey() - y.getKey());

        for (int i = 0; i < Math.min(k, items.size()); i++) {
            result.add(items.get(i).getKey());
        }
        return result;
    }
}`,
  python: `from collections import Counter

def topKFrequentProducts(arr, k):
    if k <= 0 or not arr:
        return []
    freq = Counter(arr)
    items = sorted(freq.items(), key=lambda x: (-x[1], x[0]))
    return [pid for pid, cnt in items[:k]]`
};

const q2Solutions = {
  cpp: `class Solution {
public:
    int shortestSubarraySum(vector<int>& a, int target) {
        int n = a.size(), l = 0, best = n + 1;
        long long s = 0;
        for (int r = 0; r < n; r++) {
            s += a[r];
            while (s >= target) {
                best = min(best, r - l + 1);
                s -= a[l++];
            }
        }
        return best == n + 1 ? 0 : best;
    }
};`,
  java: `public class Solution {
    public static int shortestSubarraySum(int[] nums, int target) {
        int n = nums.length;
        int left = 0;
        long currSum = 0;
        int best = n + 1;

        for (int right = 0; right < n; right++) {
            currSum += nums[right];
            while (currSum >= target) {
                best = Math.min(best, right - left + 1);
                currSum -= nums[left];
                left++;
            }
        }
        return best == n + 1 ? 0 : best;
    }
}`,
  python: `def shortestSubarraySum(nums, target):
    n = len(nums)
    left = curr_sum = 0
    best = n + 1

    for right in range(n):
        curr_sum += nums[right]
        while curr_sum >= target:
            best = min(best, right - left + 1)
            curr_sum -= nums[left]
            left += 1

    return 0 if best == n + 1 else best`
};

async function main() {
  const questions = await prisma.dSAQuestion.findMany({
    select: {
      id: true,
      title: true
    }
  });

  for (const q of questions) {
    if (q.title.includes('Frequent Product IDs')) {
      await prisma.dSAQuestion.update({
        where: { id: q.id },
        data: { correctSolution: q1Solutions }
      });
      console.log('Updated Q1');
    } else if (q.title.includes('Shortest Subarray')) {
      await prisma.dSAQuestion.update({
        where: { id: q.id },
        data: { correctSolution: q2Solutions }
      });
      console.log('Updated Q2');
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
