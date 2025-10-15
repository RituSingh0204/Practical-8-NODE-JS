
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";


const SANDBOX_DIR = path.resolve("./sandbox");
const PACKAGE_NAME = "lodash";
const PACKAGE_VERSION = "4.17.21";
const FULL_PACKAGE = `${PACKAGE_NAME}@${PACKAGE_VERSION}`;


if (!existsSync(SANDBOX_DIR)) {
  console.log(" Creating sandbox folder...");
  mkdirSync(SANDBOX_DIR, { recursive: true });
} else {
  console.log(" Sandbox already exists. Continuing...");
}


console.log(" Initializing sandbox package.json...");
execSync("npm init -y", { cwd: SANDBOX_DIR, stdio: "inherit" });


console.log(`⬇ Installing ${FULL_PACKAGE}...`);
execSync(`npm install ${FULL_PACKAGE} --no-save`, { cwd: SANDBOX_DIR, stdio: "inherit" });


const lockfilePath = path.join(SANDBOX_DIR, "package-lock.json");
if (existsSync(lockfilePath)) {
  console.log(" package-lock.json created successfully!");
  const lockData = JSON.parse(readFileSync(lockfilePath, "utf8"));
  console.log(" Installed dependencies:", Object.keys(lockData.packages));
} else {
  console.error(" No package-lock.json found!");
  process.exit(1);
}


const modulePath = path.join(SANDBOX_DIR, "node_modules", PACKAGE_NAME);
const mainFile = path.join(modulePath, "lodash.js"); 
if (existsSync(mainFile)) {
  const fileData = readFileSync(mainFile);
  const checksum = crypto.createHash("sha256").update(fileData).digest("hex");
  console.log(` Checksum of ${PACKAGE_NAME}:`, checksum);
} else {
  console.error(" Installed package main file not found!");
  process.exit(1);
}

console.log(" Installed dependency tree:");
execSync("npm ls --json", { cwd: SANDBOX_DIR, stdio: "inherit" });

console.log(" Practical 8 complete — sandboxed package installed and verified!");
