import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const sourceRoot = process.cwd();
const defaultSaneCppRepo = path.resolve(sourceRoot, "..", "SC-website");
const repoRoot = path.resolve(process.env.SANE_CPP_REPO ?? defaultSaneCppRepo);
const pagesDir = path.join(repoRoot, "Documentation", "Pages");
const librariesDir = path.join(repoRoot, "Documentation", "Libraries");
const skillsDir = path.join(repoRoot, "Skills");
const blogDir = path.join(sourceRoot, "content", "blog");
const siteBase = "/SaneCppLibraries";
const docsDir = path.join(repoRoot, "_Build", "_Documentation", "docs");
const repoGitHubRoot = "https://github.com/Pagghiu/SaneCppLibraries/blob/main";

marked.setOptions({
  gfm: true,
  breaks: false
});

export type Guide = {
  slug: string;
  title: string;
  summary: string;
  pageId: string;
  oldPath: string;
  sourcePath: string;
};

export type Library = {
  slug: string;
  title: string;
  summary: string;
  pageId: string;
  oldPath: string;
  sourcePath: string;
  maturity: string;
  dependencyGraph: string | null;
  singleFileDownload: string | null;
  dependencies: string[];
  relatedBlogs: string[];
  maturityLabel: string;
  maturityTone: "draft" | "mvp" | "usable" | "complete" | "unknown";
};

export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  legacySlug: string;
  externalUrl: string;
  sourcePath: string;
};

export type SkillCard = {
  slug: string;
  title: string;
  description: string;
  category: string;
  sourcePath: string;
  sourceUrl: string;
};

let docsHtmlCache: Array<{ relativePath: string; contents: string }> | null = null;
const symbolLinkCache = new Map<string, string | null>();

function readFiles(directory: string) {
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => path.join(directory, file));
}

function readNestedSkillFiles(directory: string) {
  return fs
    .readdirSync(directory)
    .map((entry) => path.join(directory, entry, "SKILL.md"))
    .filter((file) => fs.existsSync(file))
    .sort((a, b) => a.localeCompare(b));
}

function firstMeaningfulLine(body: string) {
  const lines = body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => {
      return (
        line !== "" &&
        line !== "[TOC]" &&
        !line.startsWith("@page ") &&
        !line.startsWith("@brief") &&
        !line.startsWith("# ")
      );
    });
  return lines[0] ?? "";
}

function normalizeSlug(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/^library_/, "")
    .replace(/^page_/, "")
    .replace(/[()]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/_/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function extractPageHeader(source: string) {
  const pageMatch = source.match(/^@page\s+(\S+)\s+(.+)$/m);
  const briefMatch = source.match(/^@brief\s+(.+)$/m);
  return {
    pageId: pageMatch?.[1] ?? "",
    title: pageMatch?.[2]?.trim() ?? "",
    brief: briefMatch?.[1]?.trim() ?? ""
  };
}

function extractLinks(source: string) {
  return [...source.matchAll(/https:\/\/pagghiu\.github\.io\/site\/blog\/([A-Za-z0-9-]+)\.html/g)].map(
    (match) => match[1]
  );
}

function parsePelicanArticle(source: string) {
  const lines = source.split("\n");
  const data: Record<string, string> = {};
  let index = 0;
  for (; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() === "") {
      index += 1;
      break;
    }
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (!match) break;
    data[match[1]] = match[2];
  }
  return {
    data,
    content: lines.slice(index).join("\n")
  };
}

function parseMaturity(raw: string) {
  const trimmed = raw.trim();
  const label = trimmed.replace(/^[🟥🟨🟩🟦]\s*/u, "").trim();
  if (trimmed.startsWith("🟥")) return { label, tone: "draft" as const };
  if (trimmed.startsWith("🟨")) return { label, tone: "mvp" as const };
  if (trimmed.startsWith("🟩")) return { label, tone: "usable" as const };
  if (trimmed.startsWith("🟦")) return { label, tone: "complete" as const };
  return { label, tone: "unknown" as const };
}

export function getGuides(): Guide[] {
  return readFiles(pagesDir)
    .filter((file) => path.basename(file) !== "Index.md")
    .map((file) => {
      const raw = fs.readFileSync(file, "utf8");
      const header = extractPageHeader(raw);
      const slug = normalizeSlug(header.pageId || path.basename(file, ".md"));
      const summary = cleanInlineText(header.brief || firstMeaningfulLine(raw));
      return {
        slug,
        title: header.title || path.basename(file, ".md"),
        summary,
        pageId: header.pageId,
        oldPath: `${header.pageId}.html`,
        sourcePath: file
      };
    });
}

export function getLibraries(): Library[] {
  return readFiles(librariesDir).map((file) => {
    const raw = fs.readFileSync(file, "utf8");
    const header = extractPageHeader(raw);
    const slug = normalizeSlug(header.pageId || path.basename(file, ".md"));
    const maturityMatch = raw.match(/# Status[\s\S]*?\n([^\n]+)/m);
    const downloadMatch = raw.match(/\[SaneCpp[^\]]+\]\((https:\/\/github\.com\/[^\)]+)\)/);
    const dependencyGraphMatch = raw.match(/!\[Dependency Graph\]\(([^)]+)\)/);
    const dependencyLine = raw.match(/- Dependencies:\s+(.+)$/m)?.[1] ?? "";
    const dependencies = [...dependencyLine.matchAll(/\[([^\]]+)\]\(@ref [^)]+\)/g)].map((match) => match[1]);
    const maturity = parseMaturity(maturityMatch?.[1] ?? "Unknown");
    return {
      slug,
      title: header.title || path.basename(file, ".md"),
      summary: cleanInlineText(stripLeadingMaturity(header.brief || firstMeaningfulLine(raw))),
      pageId: header.pageId,
      oldPath: `${header.pageId}.html`,
      sourcePath: file,
      maturity: (maturityMatch?.[1] ?? "Unknown").trim(),
      dependencyGraph: dependencyGraphMatch?.[1] ?? null,
      singleFileDownload: downloadMatch?.[1] ?? null,
      dependencies,
      relatedBlogs: extractLinks(raw),
      maturityLabel: maturity.label,
      maturityTone: maturity.tone
    };
  });
}

export function getSkills(): SkillCard[] {
  return readNestedSkillFiles(skillsDir).map((file) => {
    const raw = fs.readFileSync(file, "utf8");
    const parsed = matter(raw);
    const slug = path.basename(path.dirname(file));
    const heading = raw.match(/^#\s+(.+)$/m)?.[1]?.trim();
    const description = cleanInlineText(String(parsed.data.description ?? ""));
    return {
      slug,
      title: heading || String(parsed.data.name ?? slug),
      description,
      category: categorizeSkill(slug),
      sourcePath: file,
      sourceUrl: `${repoGitHubRoot}/${path.relative(repoRoot, file).replaceAll(path.sep, "/")}`
    };
  });
}

export function getBlogPosts(): BlogPost[] {
  return readFiles(blogDir)
    .map((file) => {
      const raw = fs.readFileSync(file, "utf8");
      const parsed = parsePelicanArticle(raw);
      const legacySlug = String(parsed.data.Slug ?? path.basename(file, ".md"));
      const normalizedLegacySlug = legacySlug.split("/").pop() ?? path.basename(file, ".md");
      return {
        slug: normalizedLegacySlug,
        title: String(parsed.data.Title ?? path.basename(file, ".md")),
        summary: cleanInlineText(String(parsed.data.Summary ?? "")),
        date: String(parsed.data.Date ?? ""),
        legacySlug: normalizedLegacySlug,
        externalUrl: `https://pagghiu.github.io/${legacySlug}.html`,
        sourcePath: file,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

function cleanInlineText(text: string) {
  return text
    .replace(/^[🟥🟨🟩🟦]\s*/u, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\(@ref [^)]+\)/g, "$1")
    .replace(/@ref\s+[A-Za-z0-9_:]+/g, "")
    .replace(/<br\s*\/?>/g, " ")
    .replace(/`/g, "")
    .replace(/^>\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripLeadingMaturity(text: string) {
  return text.replace(/^[🟥🟨🟩🟦]\s*/u, "").trim();
}

function categorizeSkill(slug: string) {
  if (/(adoption|core-patterns|example-finder)/.test(slug)) return "Adoption & navigation";
  if (/(build|tools|plugin)/.test(slug)) return "Tooling & plugins";
  if (/(async|http|socket|process|file|serial-port)/.test(slug)) return "Runtime & I/O";
  if (/(reflection|serialization|containers)/.test(slug)) return "Data & reflection";
  return "Core libraries";
}

function withSiteBase(pathname: string) {
  return `${siteBase}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

function preprocessMarkdown(
  source: string,
  routeMap: Map<string, string>,
  currentKind: "guide" | "library"
) {
  let output = source;
  output = output.replace(/^@page\s+.+$/gm, "");
  output = output.replace(/^@brief\s+.+$/gm, "");
  output = output.replace(/^\[TOC\]\s*$/gm, "");
  output = output.replace(/^\\htmlinclude.+$/gm, "");
  output = output.replace(/^@copy(details|brief|doc)\s+.+$/gm, "");
  output = output.replace(/^\\snippet.+$/gm, "");
  output = output.replace(/^@note\s*(.*)$/gm, (_match, note) => `> Note: ${note.trim()}`);
  output = output.replace(/^([🟥🟨🟩🟦])\s+(.+)$/gmu, (_match, _emoji, label) => label.trim());
  output = output.replace(/!\[Dependency Graph\]\(([^)]+)\)/g, (_match, assetPath) => {
    return `![Dependency Graph](${withSiteBase(`/reference/doxygen/${assetPath}`)})`;
  });
  output = output.replace(/\[([^\]]+)\]\(@ref\s+([^)]+)\)/g, (_match, label, refId) => {
    return routeMap.has(refId) ? `[${label}](${routeMap.get(refId)})` : label;
  });
  output = output.replace(/@ref\s+([A-Za-z0-9_:]+)/g, (_match, refId) => {
    return routeMap.has(refId) ? `[${refId}](${routeMap.get(refId)})` : refId;
  });
  output = output.replace(/https:\/\/pagghiu\.github\.io\/SaneCppLibraries\/(page_[a-z_]+|library_[a-z_]+)\.html/g, (_match, refId) => {
    const mapped = routeMap.get(refId);
    return mapped ?? _match;
  });
  if (currentKind === "guide") {
    output = output.replace(/https:\/\/pagghiu\.github\.io\/SaneCppLibraries\/libraries\.html/g, withSiteBase("/libraries/"));
  }
  output = replaceSymbolMentions(output);
  return output.trim();
}

function getRouteMap() {
  const map = new Map<string, string>();
  for (const guide of getGuides()) {
    map.set(guide.pageId, withSiteBase(`/guides/${guide.slug}/`));
  }
  for (const library of getLibraries()) {
    map.set(library.pageId, withSiteBase(`/libraries/${library.slug}/`));
  }
  map.set("libraries", withSiteBase("/libraries/"));
  return map;
}

export function renderRepoMarkdown(sourcePath: string, kind: "guide" | "library") {
  const source = fs.readFileSync(sourcePath, "utf8");
  return marked.parse(preprocessMarkdown(source, getRouteMap(), kind));
}

export function getHomeMetrics() {
  const libraries = getLibraries();
  const skills = getSkills();
  return [
    { label: "GitHub stars", value: "600+", hint: "Still growing" },
    { label: "Libraries", value: String(libraries.length), hint: "Cross-platform building blocks" },
    { label: skills.length === 1 ? "Skill" : "Skills", value: String(skills.length), hint: "Repo skill available now" },
    { label: "Platforms", value: "3", hint: "macOS, Windows, Linux" }
  ];
}

export function getFeaturedLibraries() {
  const slugs = ["foundation", "async", "plugin", "http", "process", "reflection"];
  const libraries = getLibraries();
  return slugs
    .map((slug) => libraries.find((library) => library.slug === slug))
    .filter((library): library is Library => Boolean(library));
}

function getDocsHtmlFiles() {
  if (docsHtmlCache) return docsHtmlCache;
  if (!fs.existsSync(docsDir)) {
    docsHtmlCache = [];
    return docsHtmlCache;
  }

  const files: Array<{ relativePath: string; contents: string }> = [];
  const stack = [docsDir];
  while (stack.length > 0) {
    const directory = stack.pop();
    if (!directory) continue;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".html")) {
        files.push({
          relativePath: path.relative(docsDir, fullPath).replaceAll(path.sep, "/"),
          contents: fs.readFileSync(fullPath, "utf8")
        });
      }
    }
  }
  docsHtmlCache = files;
  return docsHtmlCache;
}

function resolveSymbolLink(symbol: string) {
  if (symbolLinkCache.has(symbol)) return symbolLinkCache.get(symbol);
  const docsFiles = getDocsHtmlFiles();
  if (docsFiles.length === 0) {
    symbolLinkCache.set(symbol, null);
    return null;
  }

  const matches = docsFiles.filter((file) => file.contents.includes(symbol));
  const preferredMatches = matches.filter((file) => {
    const basename = path.basename(file.relativePath);
    return !basename.startsWith("library_") && !basename.startsWith("page_") && basename !== "index.html";
  });

  const chosen = preferredMatches.length === 1 ? preferredMatches[0] : matches.length === 1 ? matches[0] : null;
  const resolved = chosen ? withSiteBase(`/reference/doxygen/${chosen.relativePath}`) : null;
  symbolLinkCache.set(symbol, resolved);
  return resolved;
}

function replaceOutsideCodeFences(source: string, transform: (input: string) => string) {
  const segments = source.split(/(```[\s\S]*?```)/g);
  return segments
    .map((segment) => {
      if (segment.startsWith("```")) return segment;
      return transform(segment);
    })
    .join("");
}

function replaceSymbolMentions(source: string) {
  return replaceOutsideCodeFences(source, (segment) => {
    let output = segment.replace(/`(SC::[A-Za-z_][A-Za-z0-9_:]*)`/g, (match, symbol) => {
      const link = resolveSymbolLink(symbol);
      return link ? `[\`${symbol}\`](${link})` : match;
    });
    output = output.replace(/(^|[^`\[])(SC::[A-Za-z_][A-Za-z0-9_:]*)/gm, (match, prefix, symbol) => {
      const link = resolveSymbolLink(symbol);
      return link ? `${prefix}[${symbol}](${link})` : match;
    });
    return output;
  });
}
