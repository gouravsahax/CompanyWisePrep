type TestCase = {
  input: string;
  output: string;
  execArgs?: any[];
  execInput?: any[];
  execOutput: any;
};

function generateJSWrapper(userCode: string, testCases: TestCase[]) {
  const funcMatch = userCode.match(/function\s+([a-zA-Z0-9_]+)\s*\(/);
  const funcName = funcMatch ? funcMatch[1] : 'solve';
  
  const testCasesJSON = JSON.stringify(testCases.map(tc => tc.execArgs || tc.execInput || null));
  return `
${userCode}

const testCases = ${testCasesJSON};
const results = [];
for (let i = 0; i < testCases.length; i++) {
  if (testCases[i] === null) {
    results.push({ success: false, error: "Missing execution arguments in DB" });
    continue;
  }
  try {
    const fn = typeof ${funcName} !== 'undefined' ? ${funcName} : solve;
    const result = fn(...testCases[i]);
    results.push({ success: true, result });
  } catch (e) {
    results.push({ success: false, error: e.toString() });
  }
}
console.log(JSON.stringify(results));
  `;
}

function generatePythonWrapper(userCode: string, testCases: TestCase[]) {
  const testCasesJSON = JSON.stringify(testCases.map(tc => tc.execArgs || tc.execInput || null));
  return `
import json, sys, types
${userCode}

func = None
for name, val in list(globals().items()):
    if isinstance(val, types.FunctionType) and name not in ['Counter']:
        func = val
        break

if not func:
    print(json.dumps([{"success": False, "error": "No function defined"}]))
    sys.exit(0)

test_cases = json.loads('${testCasesJSON}')
results = []
for tc in test_cases:
    if tc is None:
        results.append({"success": False, "error": "Missing execution arguments in DB"})
        continue
    try:
        res = func(*tc)
        results.append({"success": True, "result": res})
    except Exception as e:
        results.append({"success": False, "error": str(e)})

print(json.dumps(results))
  `;
}

function toCppValue(val: any): string {
  if (Array.isArray(val)) {
    if (val.length > 0 && typeof val[0] === 'string') {
      const elements = val.map(v => `std::string("${v.replace(/"/g, '\\"')}")`).join(',');
      return `std::vector<std::string>{${elements}}`;
    }
    if (val.length > 0 && Array.isArray(val[0])) {
      const elements = val.map(v => toCppValue(v)).join(',');
      return `std::vector<std::vector<int>>{${elements}}`;
    }
    return `std::vector<int>{${val.join(',')}}`;
  }
  if (typeof val === 'string') {
    return `std::string("${val.replace(/"/g, '\\"')}")`;
  }
  if (typeof val === 'boolean') {
    return val ? 'true' : 'false';
  }
  return val === null ? '0' : val.toString();
}

function generateCppWrapper(userCode: string, testCases: TestCase[]) {
  const funcMatch = userCode.match(/(?:int|long|float|double|bool|string|vector\s*<[^>]+>)\s+([a-zA-Z0-9_]+)\s*\(/);
  const funcName = funcMatch ? funcMatch[1] : 'solve';

  let mainContent = `int main() { std::cout << "["; `;
  for (let i = 0; i < testCases.length; i++) {
    const argsArray = testCases[i].execArgs || testCases[i].execInput;
    if (!argsArray) {
      mainContent += `std::cout << "{\\"success\\":false,\\"error\\":\\"Missing execution arguments in DB\\"}";`;
    } else {
      const argsDecls = argsArray.map((val, idx) => `auto arg${idx} = ${toCppValue(val)};`).join(' ');
      const argsCalls = argsArray.map((_, idx) => `arg${idx}`).join(', ');
      mainContent += `
        try {
          Solution sol;
          ${argsDecls}
          auto res = sol.${funcName}(${argsCalls});
          std::cout << "{\\"success\\":true,\\"result\\":" << toJson(res) << "}";
        } catch(...) {
          std::cout << "{\\"success\\":false,\\"error\\":\\"Runtime error\\"}";
        }
      `;
    }
    if (i < testCases.length - 1) mainContent += `std::cout << ",";`;
  }
  mainContent += `std::cout << "]" << std::endl; return 0; }`;
  console.log("C++ Main Content:", mainContent);
  return `
#include <iostream>
#include <vector>
#include <string>

${userCode}

std::string toJson(int val) { return std::to_string(val); }
std::string toJson(bool val) { return val ? "true" : "false"; }
std::string toJson(const std::string& val) { return "\\"" + val + "\\""; }
std::string toJson(const std::vector<int>& val) {
  std::string s = "[";
  for(size_t i=0; i<val.size(); ++i) {
    s += std::to_string(val[i]);
    if(i != val.size()-1) s += ",";
  }
  s += "]";
  return s;
}
std::string toJson(const std::vector<std::string>& val) {
  std::string s = "[";
  for(size_t i=0; i<val.size(); ++i) {
    s += "\\"" + val[i] + "\\"";
    if(i != val.size()-1) s += ",";
  }
  s += "]";
  return s;
}
std::string toJson(const std::vector<std::vector<int>>& val) {
  std::string s = "[";
  for(size_t i=0; i<val.size(); ++i) {
    s += toJson(val[i]);
    if(i != val.size()-1) s += ",";
  }
  s += "]";
  return s;
}

${mainContent}
  `;
}

function toJavaValue(val: any): string {
  if (Array.isArray(val)) {
    if (val.length > 0 && typeof val[0] === 'string') {
      const elements = val.map(v => `"${v.replace(/"/g, '\\"')}"`).join(',');
      return `new String[]{${elements}}`;
    }
    if (val.length > 0 && Array.isArray(val[0])) {
      const elements = val.map(v => toJavaValue(v)).join(',');
      return `new int[][]{${elements}}`;
    }
    return `new int[]{${val.join(',')}}`;
  }
  if (typeof val === 'string') {
    return `"${val.replace(/"/g, '\\"')}"`;
  }
  if (typeof val === 'boolean') {
    return val ? 'true' : 'false';
  }
  return val === null ? 'null' : val.toString();
}

function generateJavaWrapper(userCode: string, testCases: TestCase[]) {
  const funcMatch = userCode.match(/public\s+(?:static\s+)?[a-zA-Z0-9_<>\[\]]+\s+([a-zA-Z0-9_]+)\s*\(/);
  const funcName = funcMatch ? funcMatch[1] : 'solve';

  let mainContent = `public static void main(String[] args) { System.out.print("["); `;
  for (let i = 0; i < testCases.length; i++) {
    const argsArray = testCases[i].execArgs || testCases[i].execInput;
    if (!argsArray) {
      mainContent += `System.out.print("{\\"success\\":false,\\"error\\":\\"Missing execution arguments in DB\\"}");`;
    } else {
      const args = argsArray.map(toJavaValue).join(', ');
      mainContent += `
        try {
          Solution sol = new Solution();
          Object res = sol.${funcName}(${args});
          if (res instanceof int[]) {
              System.out.print("{\\"success\\":true,\\"result\\":" + toJson((int[])res) + "}");
          } else if (res instanceof String[]) {
              System.out.print("{\\"success\\":true,\\"result\\":" + toJson((String[])res) + "}");
          } else if (res instanceof int[][]) {
              System.out.print("{\\"success\\":true,\\"result\\":" + toJson((int[][])res) + "}");
          } else if (res instanceof java.util.List) {
              System.out.print("{\\"success\\":true,\\"result\\":" + toJson((java.util.List<?>)res) + "}");
          } else if (res instanceof String) {
              System.out.print("{\\"success\\":true,\\"result\\":\\"" + res + "\\"}");
          } else {
              System.out.print("{\\"success\\":true,\\"result\\":" + res + "}");
          }
        } catch(Exception e) {
          System.out.print("{\\"success\\":false,\\"error\\":\\"Runtime error\\"}");
        }
      `;
    }
    if (i < testCases.length - 1) mainContent += `System.out.print(",");`;
  }
  mainContent += `System.out.print("]"); }`;

  return `
import java.util.*;

${userCode.replace(/public\s+class\s+Solution/g, 'class Solution')}

class Main {
  public static String toJson(int[] val) {
    StringBuilder sb = new StringBuilder("[");
    for(int i=0; i<val.length; ++i) {
      sb.append(val[i]);
      if(i != val.length-1) sb.append(",");
    }
    sb.append("]");
    return sb.toString();
  }
  public static String toJson(String[] val) {
    StringBuilder sb = new StringBuilder("[");
    for(int i=0; i<val.length; ++i) {
      sb.append("\\"").append(val[i]).append("\\"");
      if(i != val.length-1) sb.append(",");
    }
    sb.append("]");
    return sb.toString();
  }
  public static String toJson(int[][] val) {
    StringBuilder sb = new StringBuilder("[");
    for(int i=0; i<val.length; ++i) {
      sb.append(toJson(val[i]));
      if(i != val.length-1) sb.append(",");
    }
    sb.append("]");
    return sb.toString();
  }
  public static String toJson(java.util.List<?> val) {
    StringBuilder sb = new StringBuilder("[");
    for(int i=0; i<val.size(); ++i) {
      Object item = val.get(i);
      if (item instanceof Integer) {
          sb.append(item);
      } else if (item instanceof String) {
          sb.append("\\"").append(item).append("\\"");
      } else if (item instanceof java.util.List) {
          sb.append(toJson((java.util.List<?>)item));
      } else {
          sb.append(item);
      }
      if(i != val.size()-1) sb.append(",");
    }
    sb.append("]");
    return sb.toString();
  }
  
  ${mainContent}
}
  `;
}

import fs from 'fs';
import path from 'path';
import { exec, execFile } from 'child_process';
import util from 'util';
import os from 'os';

const execAsync = util.promisify(exec);
const execFileAsync = util.promisify(execFile);

function cleanError(error: string, file: string) {
  if (!error) return "Unknown error occurred";
  
  if (error.startsWith("Command failed:")) {
    const lines = error.split('\\n');
    lines.shift();
    error = lines.join('\\n').trim();
  }

  const basename = path.basename(file);
  const dirPattern = file.replace(/\\/g, '\\\\');
  let cleaned = error.replace(new RegExp(dirPattern, 'g'), 'Solution');
  cleaned = cleaned.replace(new RegExp(basename, 'g'), 'Solution');
  
  cleaned = cleaned.replace(/out_[a-zA-Z0-9]+\\.exe/g, 'out.exe');
  cleaned = cleaned.replace(/script_[a-zA-Z0-9]+\\.[a-z]+/g, 'Solution');
  cleaned = cleaned.replace(/C:\\\\[^\\s]+\\\\.exe/g, 'out.exe');
  
  return cleaned.trim() || "Execution failed with no error message.";
}

export async function executeCode(userCode: string, language: string, testCases: TestCase[]) {
  let wrapper = '';
  let compilerId = '';
  let filename = '';
  let langId = '';

  if (language === 'javascript') {
    wrapper = generateJSWrapper(userCode, testCases);
    compilerId = 'v8trunk';
    langId = 'javascript';
    filename = 'example.js';
  } else if (language === 'python') {
    wrapper = generatePythonWrapper(userCode, testCases);
    compilerId = 'python311';
    langId = 'python';
    filename = 'example.py';
  } else if (language === 'cpp') {
    wrapper = generateCppWrapper(userCode, testCases);
    compilerId = 'g141';
    langId = 'c++';
    filename = 'example.cpp';
  } else if (language === 'java') {
    wrapper = generateJavaWrapper(userCode, testCases);
    compilerId = 'java2301';
    langId = 'java';
    filename = 'example.java';
  } else {
    throw new Error('Unsupported language');
  }

  const parseOutput = (rawOutput: string) => {
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
  
  if (!response.ok) {
     return { success: false, type: 'compile_error', error: "Execution API error: " + response.status };
  }
  
  const data = await response.json();
  if (data.code !== 0) {
    const compileErr = data.stderr ? data.stderr.map((s: any) => s.text).join('\\n') : 'Unknown compilation error';
    return { success: false, type: 'compile_error', error: cleanError(compileErr, filename) };
  }
  
  if (data.execResult && data.execResult.code !== 0) {
    if (data.execResult.timedOut) return { success: false, type: 'runtime_error', error: 'Time Limit Exceeded' };
    const runtimeErr = data.execResult.stderr ? data.execResult.stderr.map((s: any) => s.text).join('\\n') : 'Runtime error';
    return { success: false, type: 'runtime_error', error: cleanError(runtimeErr, filename) };
  }
  
  const rawOutput = data.execResult && data.execResult.stdout ? data.execResult.stdout.map((s: any) => s.text).join('\\n') : '';
  return parseOutput(rawOutput);
}
