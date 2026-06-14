import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const sourceRoot = process.cwd();
const distDir = path.join(sourceRoot, "dist");
const publishRepo = path.resolve(process.env.PUBLISH_REPO ?? path.join(sourceRoot, "..", "pagghiu.github.io"));

function git(args) {
  return spawnSync("git", args, {
    cwd: publishRepo,
    encoding: "utf8"
  });
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(distDir)) {
  fail(`Build output not found: ${distDir}`);
}

if (!fs.existsSync(path.join(publishRepo, ".git"))) {
  fail(`PUBLISH_REPO is not a git checkout: ${publishRepo}`);
}

const remote = git(["remote", "get-url", "origin"]).stdout.trim();
if (!remote.includes("Pagghiu/pagghiu.github.io")) {
  fail(`Refusing to publish into unexpected repository: ${remote}`);
}

for (const entry of fs.readdirSync(publishRepo)) {
  if (entry === ".git") continue;
  fs.rmSync(path.join(publishRepo, entry), { recursive: true, force: true });
}

fs.cpSync(distDir, publishRepo, { recursive: true });
fs.writeFileSync(path.join(publishRepo, ".nojekyll"), "");

const status = git(["status", "--short"]).stdout.trim();
console.log(status === "" ? "Published output unchanged." : status);
