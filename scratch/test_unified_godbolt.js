export async function testUnifiedGodbolt() {
  const parseOutput = (rawOutput) => {
    try {
      const jsonStart = rawOutput.indexOf('[');
      const jsonEnd = rawOutput.lastIndexOf(']');
      if (jsonStart === -1 || jsonEnd === -1) throw new Error("Invalid output format");
      const parsedResults = JSON.parse(rawOutput.substring(jsonStart, jsonEnd + 1));
      return { success: true, results: parsedResults, stdout: rawOutput };
    } catch (e) {
      return { success: false, type: 'runtime_error', error: rawOutput };
    }
  };

  async function execLang(language, compilerId, langId, wrapper, filename) {
    console.log(`Executing ${language}...`);
    const response = await fetch(`https://godbolt.org/api/compiler/${compilerId}/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        source: wrapper,
        options: {
          userArguments: "",
          compilerOptions: { produceAst: false, produceOptInfo: false },
          filters: { execute: true },
          tools: [],
          libraries: []
        },
        lang: langId,
        allowStoreCodeDebug: true
      })
    });
    const data = await response.json();
    if (data.code !== 0) {
      const compileErr = data.stderr ? data.stderr.map((s) => s.text).join('\\n') : 'Unknown compilation error';
      return { success: false, type: 'compile_error', error: compileErr };
    }
    if (data.execResult && data.execResult.code !== 0) {
      const runtimeErr = data.execResult.stderr ? data.execResult.stderr.map((s) => s.text).join('\\n') : 'Runtime error';
      return { success: false, type: 'runtime_error', error: runtimeErr };
    }
    const rawOutput = data.execResult && data.execResult.stdout ? data.execResult.stdout.map((s) => s.text).join('\\n') : '';
    return parseOutput(rawOutput);
  }

  const pyCode = `import json\nprint(json.dumps([{"success": True}]))`;
  const jsCode = `console.log(JSON.stringify([{"success": true}]));`;
  const cppCode = `#include <iostream>\nint main() { std::cout << "[{\\"success\\":true}]\\n"; return 0; }`;
  const javaCode = `class Main { public static void main(String[] args) { System.out.println("[{\\"success\\":true}]"); } }`;

  console.log(await execLang('python', 'python311', 'python', pyCode, 'example.py'));
  console.log(await execLang('javascript', 'v8trunk', 'javascript', jsCode, 'example.js'));
  console.log(await execLang('cpp', 'g127', 'c++', cppCode, 'example.cpp'));
  console.log(await execLang('java', 'java2301', 'java', javaCode, 'example.java'));
}
testUnifiedGodbolt();
