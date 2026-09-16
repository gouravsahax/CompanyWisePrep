async function testGodbolt() {
  const res = await fetch('https://godbolt.org/api/compiler/python311/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      source: `import json
results = [{"success": True}]
print(json.dumps(results))`,
      options: {
        userArguments: "",
        compilerOptions: { produceAst: false, produceOptInfo: false },
        filters: { execute: true },
        tools: [],
        libraries: []
      },
      lang: "python",
      allowStoreCodeDebug: true
    })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
testGodbolt();
