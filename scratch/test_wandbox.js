async function main() {
  try {
    const res = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler: 'nodejs-head', // Node.js
        code: `console.log(JSON.stringify([{success: true, result: 42}]));`
      })
    });
    const text = await res.text();
    console.log(res.status, text);
  } catch (e) {
    console.error(e);
  }
}
main();
main();
