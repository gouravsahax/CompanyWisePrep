async function main() {
  const res = await fetch('https://emkc.org/api/v2/piston/runtimes');
  const data = await res.json();
  console.log(JSON.stringify(data.filter(r => ['python', 'c++', 'javascript', 'java'].includes(r.language)), null, 2));
}
main();
main();
