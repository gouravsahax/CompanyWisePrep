async function testGodbolt() {
  const res = await fetch('https://godbolt.org/api/compiler/v8113/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      source: `const testCases = [[4, 2]];
const results = [];
results.push({success: true});
console.log(JSON.stringify(results));`,
      options: {
        userArguments: "",
        compilerOptions: { produceAst: false, produceOptInfo: false },
        filters: { execute: true },
        tools: [],
        libraries: []
      },
      lang: "javascript",
      allowStoreCodeDebug: true
    })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
testGodbolt();
