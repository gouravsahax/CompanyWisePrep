async function main() {
  try {
    const res = await fetch('https://godbolt.org/api/compiler/java2301/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        source: `
class Main {
  public static void main(String[] args) {
    System.out.print("[{\\"success\\":true}]");
  }
}
        `,
        options: {
          userArguments: "",
          compilerOptions: { produceAst: false, produceOptInfo: false },
          filters: { execute: true },
          tools: [],
          libraries: []
        },
        lang: "java",
        allowStoreCodeDebug: true
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
