import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const sourceRoot = process.cwd();
const saneCppRepo = path.resolve(process.env.SANE_CPP_REPO ?? path.join(sourceRoot, "..", "SC-website"));

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: saneCppRepo,
    stdio: "inherit",
    env: process.env
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!fs.existsSync(path.join(saneCppRepo, "SC.sh"))) {
  console.error(`SANE_CPP_REPO does not look like a Sane C++ checkout: ${saneCppRepo}`);
  process.exit(1);
}

run("python3", ["Support/SingleFileLibs/python/amalgamate_single_file_libs.py"]);
run("node", ["Support/SingleFileLibs/javascript/cli.js", "--repo-root", ".", "--ref", "HEAD", "--all", "--out", "_Build/_SingleFileLibrariesJS"]);
run("python3", ["Support/Dependencies/update_dependencies.py", "--check"]);
run("python3", ["Support/Dependencies/update_dependencies.py"]);
run("python3", ["Support/SingleFileLibs/check_if_equal.py", "_Build/_SingleFileLibraries", "_Build/_SingleFileLibrariesJS"]);
run("./SC.sh", ["build", "documentation"]);
run("./SC.sh", ["build", "configure", "SCTest"]);
run("./SC.sh", ["build", "compile", "SCTest", "DebugCoverage"]);
run("./SC.sh", ["build", "run", "SCTest", "DebugCoverage", "--", "--all-tests"]);
run("./SC.sh", ["build", "coverage", "SCTest", "DebugCoverage"]);

const coverageSource = path.join(saneCppRepo, "_Build", "_Coverage", "coverage");
const coverageTarget = path.join(saneCppRepo, "_Build", "_Documentation", "docs", "coverage");
if (fs.existsSync(coverageSource)) {
  fs.rmSync(coverageTarget, { recursive: true, force: true });
  fs.cpSync(coverageSource, coverageTarget, { recursive: true });
}
