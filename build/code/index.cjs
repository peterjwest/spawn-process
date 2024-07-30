"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => spawnProcess,
  dependencies: () => dependencies
});
module.exports = __toCommonJS(src_exports);
var import_child_process = require("child_process");
var dependencies = {
  spawn: import_child_process.spawn
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  dependencies
});
