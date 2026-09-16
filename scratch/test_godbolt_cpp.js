async function testGodbolt() {
  const res = await fetch('https://godbolt.org/api/compiler/g141/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      source: `#include <iostream>\nint main() { std::cout << "[{\\"success\\":true}]\\n"; return 0; }`,
      options: {
        userArguments: "",
        compilerOptions: { produceAst: false, produceOptInfo: false },
        filters: { execute: true },
        tools: [],
        libraries: []
      },
      lang: "c++",
      allowStoreCodeDebug: true
    })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
testGodbolt();
