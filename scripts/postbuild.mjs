import fs from "node:fs";
import path from "node:path";
import { legacyRedirects } from "./legacy-routes.mjs";

const defaultSaneCppRepo = path.resolve(process.cwd(), "..", "SC-website");
const projectRoot = path.resolve(process.env.SANE_CPP_REPO ?? defaultSaneCppRepo);
const distDir = path.resolve(process.cwd(), "dist");
const doxygenDir = path.join(projectRoot, "_Build", "_Documentation", "docs");
const saneSectionDir = path.join(distDir, "SaneCppLibraries");
const referenceDir = path.join(saneSectionDir, "reference", "doxygen");
function ensureDir(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function writeRedirect(relativePath, targetPath) {
  const filePath = path.join(distDir, relativePath);
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(
    filePath,
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${targetPath}"><link rel="canonical" href="${targetPath}"></head><body><p>Redirecting to <a href="${targetPath}">${targetPath}</a>...</p></body></html>`
  );
}

function flattenHtmlDirectories(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const entryPath = path.join(directory, entry.name);
    flattenHtmlDirectories(entryPath);

    if (!entry.name.endsWith(".html")) continue;

    const indexPath = path.join(entryPath, "index.html");
    const targetPath = path.join(directory, entry.name);
    const remainingEntries = fs.readdirSync(entryPath);
    if (fs.existsSync(indexPath) && remainingEntries.length === 1) {
      const contents = fs.readFileSync(indexPath);
      fs.rmSync(entryPath, { recursive: true, force: true });
      fs.writeFileSync(targetPath, contents);
    }
  }
}

ensureDir(referenceDir);
if (fs.existsSync(doxygenDir)) {
  fs.cpSync(doxygenDir, referenceDir, { recursive: true });
} else {
  fs.writeFileSync(
    path.join(referenceDir, "index.html"),
    "<!doctype html><html lang=\"en\"><body><h1>Reference not built yet</h1><p>Run the documentation build first to populate the generated Doxygen subtree.</p></body></html>"
  );
}

for (const [file, target] of Object.entries(legacyRedirects)) {
  writeRedirect(path.join("SaneCppLibraries", file), target);
}

writeRedirect(path.join("site", "blog", "blog.html"), "https://pagghiu.github.io");
writeRedirect(path.join("SaneCppLibraries", "guides", "libraries", "index.html"), "/SaneCppLibraries/libraries/");

fs.writeFileSync(
  path.join(saneSectionDir, "build-info.json"),
  `${JSON.stringify(
    {
      saneCppRepo: projectRoot,
      saneCppCommit: process.env.SANE_CPP_COMMIT ?? null,
      websiteSourceCommit: process.env.WEBSITE_SOURCE_COMMIT ?? null,
      generatedAt: new Date().toISOString()
    },
    null,
    2
  )}\n`
);

flattenHtmlDirectories(distDir);
