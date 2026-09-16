async function testPiston() {
  const res = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: "c++",
      version: "*",
      files: [{ content: "#include <iostream>\nint main() { std::cout << \"[{\\\"success\\\":true}]\" << std::endl; return 0; }" }]
    })
  });
  const data = await res.json();
  console.log(data);
}
testPiston();
