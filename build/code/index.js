// src/index.ts
import { spawn } from "child_process";
var dependencies = {
  spawn
};
async function spawnProcess(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const process = dependencies.spawn(command, args, options);
    const stdout = [];
    if (process.stdout) {
      process.stdout.on("data", (chunk) => stdout.push(chunk));
    }
    const stderr = [];
    if (process.stderr) {
      process.stderr.on("data", (chunk) => stderr.push(chunk));
    }
    process.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(Buffer.concat(stderr).toString()));
      }
      resolve(Buffer.concat(stdout).toString());
    });
    process.on("error", reject);
  });
}
export {
  spawnProcess as default,
  dependencies
};
