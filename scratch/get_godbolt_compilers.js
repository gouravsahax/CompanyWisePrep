async function testGodbolt() {
  const res = await fetch('https://godbolt.org/api/compilers/', {
    headers: { 'Accept': 'application/json' }
  });
  const data = await res.json();
  const cpps = data.filter(c => c.lang === 'c++' && c.id.match(/^g\d+$/)).map(c => c.id);
  console.log('C++:', cpps);
}
testGodbolt();
