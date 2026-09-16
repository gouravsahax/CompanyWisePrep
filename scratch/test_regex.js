const cpp1 = "vector<int> topKFrequentProducts(vector<int>& a, int k) {";
const cpp2 = "bool isValid(string s) {";
const cpp3 = "int findKthHighest(vector<int>& ratings, int k) {";
const java1 = "public static List<Integer> topKFrequentProducts(int[] arr, int k)";
const java2 = "public static boolean isValid(String s)";
const java3 = "public int shortestSubarraySum(int[] nums, int target)";

const cppRegex = /(?:int|long|float|double|bool|string|vector\s*<[^>]+>)\s+([a-zA-Z0-9_]+)\s*\(/;
const javaRegex = /public\s+(?:static\s+)?[a-zA-Z0-9_<>\[\]]+\s+([a-zA-Z0-9_]+)\s*\(/;

console.log("C++:", cpp1.match(cppRegex)?.[1]);
console.log("C++:", cpp2.match(cppRegex)?.[1]);
console.log("C++:", cpp3.match(cppRegex)?.[1]);
console.log("Java:", java1.match(javaRegex)?.[1]);
console.log("Java:", java2.match(javaRegex)?.[1]);
console.log("Java:", java3.match(javaRegex)?.[1]);
