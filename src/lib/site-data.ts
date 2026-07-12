import fs from "node:fs";
import path from "node:path";
import { decodeHTML } from "entities";
import matter from "gray-matter";
import { marked } from "marked";
import { createHighlighter } from "shiki";

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
const cppHighlighter = await createHighlighter({
  themes: ["github-light", "catppuccin-mocha"],
  langs: ["cpp"]
});

marked.setOptions({
  gfm: true,
  breaks: false
});

export type Guide = {
  slug: string;
  title: string;
  summary: string;
  icon: string;
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

export type GeneratedLibraryDocument = {
  tocHtml: string;
  contentHtml: string;
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

export type SkillStructure = {
  rootRelative: string;
  guideCount: number;
  referenceFileCount: number;
  groups: Array<{
    title: string;
    icon: string;
    items: string[];
  }>;
};

let docsHtmlCache: Array<{ relativePath: string; contents: string }> | null = null;
const symbolLinkCache = new Map<string, string | null>();

const guideMetadata: Record<string, { summary: string; icon: string; intro?: string; fallback?: string }> = {
  page_build: {
    icon: "construction",
    summary: "Describe builds in C++ and use SC::Build to generate projects or build directly through the native backend."
  },
  page_build_external: {
    icon: "hub",
    summary: "Use SC-build launchers from an external project with a vendored, shared-checkout, or cached Sane C++ layout."
  },
  page_building_contributor: {
    icon: "engineering",
    summary: "Build the repository locally, run focused tests, reproduce issues, and validate contribution branches."
  },
  page_building_user: {
    icon: "add_box",
    summary: "Add the libraries to an existing project without adopting the repository test suite or project-generation workflow."
  },
  page_coding_style: {
    icon: "format_align_left",
    summary: "Formatting, naming, error-handling, and API rules for code that should remain readable to humans and agents."
  },
  page_examples: {
    icon: "terminal",
    summary: "Run the example programs and use them as practical references for SC::Build, Async, Http, Plugin, and other libraries."
  },
  page_faq: {
    icon: "help",
    summary: "Answers for standard-library mode, exceptions, RTTI, STL integration, debug visualizers, and compatibility questions."
  },
  libraries: {
    icon: "table_rows",
    summary: "Browse the generated library list, dependency graph, LOC summary, and C binding groups.",
    fallback:
      "The library catalog is now presented as a dedicated website section with cards, maturity badges, dependencies, downloads, and reference links.\n\nOpen the [Library catalog](/SaneCppLibraries/libraries/) for the current list."
  },
  page_platforms: {
    icon: "devices",
    summary: "Supported, planned, and intentionally unsupported operating-system targets."
  },
  page_principles: {
    icon: "rule",
    summary: "The constraints behind the libraries: readable code, explicit ownership, fast builds, strict errors, and controlled dependencies.",
    intro:
      "These principles describe the shape of Sane C++ Libraries. They keep the code small, explicit, portable, and predictable enough for agents to modify without silently changing the project model."
  },
  page_single_file_libs: {
    icon: "inventory_2",
    summary: "Open the generated amalgamation tool for standalone single-file headers.",
    fallback:
      "The in-browser amalgamation tool is still served from the generated reference pages because it depends on the repository's bundled JavaScript tool.\n\nOpen the [legacy generated amalgamation tool](/SaneCppLibraries/reference/doxygen/page_single_file_libs.html) to pick a library and download its standalone header."
  },
  page_tests: {
    icon: "fact_check",
    summary: "Understand where tests live, how they double as examples, and how coverage is published."
  },
  page_tools: {
    icon: "build",
    summary: "Understand the self-contained C++ tools compiled on demand through the repository bootstrap scripts."
  },
  page_package: {
    icon: "deployed_code",
    summary: "Install and inspect pinned development tools, cross toolchains, sysroots, and runners with SC::Package."
  },
  page_format: {
    icon: "format_indent_increase",
    summary: "Format the repository or check formatting in CI with SC::Format."
  }
};

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

function guideMeta(pageId: string, slug: string) {
  return guideMetadata[pageId] ?? guideMetadata[slug] ?? { summary: "", icon: "article" };
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
  const briefMatch = source.match(/^@brief[^\S\r\n]+(.+)$/m);
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
  const guides = readFiles(pagesDir)
    .filter((file) => !["Index.md", "Libraries.md"].includes(path.basename(file)))
    .map((file) => {
      const raw = fs.readFileSync(file, "utf8");
      const header = extractPageHeader(raw);
      const slug = normalizeSlug(header.pageId || path.basename(file, ".md"));
      const metadata = guideMeta(header.pageId, slug);
      const summary = metadata.summary || cleanInlineText(header.brief || firstMeaningfulLine(raw));
      return {
        slug,
        title: header.title || path.basename(file, ".md"),
        summary,
        icon: metadata.icon,
        pageId: header.pageId,
        oldPath: `${header.pageId}.html`,
        sourcePath: file
      };
    });

  const toolsSource = path.join(pagesDir, "Tools.md");
  for (const synthetic of [
    { slug: "package", title: "SC::Package", pageId: "page_package", oldPath: "page_tools.html" },
    { slug: "format", title: "SC::Format", pageId: "page_format", oldPath: "page_tools.html" }
  ]) {
    const metadata = guideMeta(synthetic.pageId, synthetic.slug);
    guides.push({
      ...synthetic,
      summary: metadata.summary,
      icon: metadata.icon,
      sourcePath: toolsSource
    });
  }

  return guides;
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

export function getSkillStructure(): SkillStructure | null {
  const [skillFile] = readNestedSkillFiles(skillsDir);
  if (!skillFile) return null;

  const skillRoot = path.dirname(skillFile);
  const referencesRoot = path.join(skillRoot, "references");
  const referenceFiles = fs.existsSync(referencesRoot) ? readNestedMarkdownFiles(referencesRoot) : [];
  const raw = fs.readFileSync(skillFile, "utf8");
  const topicSection = raw.split("## Topic Guides")[1]?.split(/\n##\s+/)[0] ?? "";
  const groupIcons: Record<string, string> = {
    "Onboarding And Navigation": "travel_explore",
    "Core Types And Data Structures": "category",
    "I/O, Async, And Platforms": "sync_alt",
    "Reflection, Serialization, And Plugins": "extension"
  };
  const groups: SkillStructure["groups"] = [];
  let currentGroup: SkillStructure["groups"][number] | null = null;

  for (const line of topicSection.split("\n")) {
    const groupMatch = line.match(/^###\s+(.+)$/);
    if (groupMatch) {
      const title = groupMatch[1].trim();
      currentGroup = {
        title,
        icon: groupIcons[title] ?? "topic",
        items: []
      };
      groups.push(currentGroup);
      continue;
    }

    const itemMatch = line.match(/^-\s+(.+?):\s+\[[^\]]+\]\([^)]+\)/);
    if (itemMatch && currentGroup) {
      currentGroup.items.push(cleanInlineText(itemMatch[1]));
    }
  }

  return {
    rootRelative: path.relative(repoRoot, skillRoot).replaceAll(path.sep, "/"),
    guideCount: referenceFiles.filter((file) => path.basename(file) === "guide.md").length,
    referenceFileCount: referenceFiles.length,
    groups
  };
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

function readNestedMarkdownFiles(directory: string): string[] {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return readNestedMarkdownFiles(fullPath);
      return entry.isFile() && entry.name.endsWith(".md") ? [fullPath] : [];
    })
    .sort((a, b) => a.localeCompare(b));
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
    .replace(/^[-*]\s+/, "")
    .replace(/^#+\s+/, "")
    .replace(/^\\[A-Za-z]+\s+.*$/, "")
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
  output = output.replace(/^\\htmlonly[\s\S]*?^\\endhtmlonly\s*$/gm, "");
  output = output.replace(/^@page\s+.+$/gm, "");
  output = output.replace(/^@brief(?:[^\S\r\n].*)?$/gm, "");
  output = output.replace(/^\[TOC\]\s*$/gm, "");
  output = output.replace(/^\\htmlinclude.+$/gm, "");
  output = output.replace(/^@copy(details|brief|doc)\s+.+$/gm, "");
  output = output.replace(/@copy(?:details|brief|doc)\s+([A-Za-z0-9_:]+)/g, "$1");
  output = output.replace(/^\\snippet.+$/gm, "");
  output = output.replace(/^@note[^\S\r\n]+(.+)$/gm, (_match, note) => `> Note: ${note.trim()}`);
  output = output.replace(/^@note[^\S\r\n]*$/gm, "> Note:");
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

function normalizeComparableText(text: string) {
  return cleanInlineText(text).toLowerCase();
}

function removeLeadingTitle(markdown: string, title: string) {
  const lines = markdown.trimStart().split("\n");
  const firstLine = lines[0]?.trim() ?? "";
  const match = firstLine.match(/^#\s+(.+)$/);
  if (match && normalizeComparableText(match[1]) === normalizeComparableText(title)) {
    return lines.slice(1).join("\n").trimStart();
  }
  return markdown;
}

function removeLeadingIntro(markdown: string, summary: string) {
  const trimmed = markdown.trimStart();
  if (
    trimmed.startsWith("#") ||
    trimmed.startsWith("-") ||
    trimmed.startsWith("*") ||
    trimmed.startsWith(">") ||
    trimmed.startsWith("```")
  ) {
    return markdown;
  }

  const parts = trimmed.split(/\n\s*\n/);
  const [firstBlock, ...rest] = parts;
  if (firstBlock && rest.length > 0 && normalizeComparableText(firstBlock) === normalizeComparableText(summary)) {
    return rest.join("\n\n").trimStart();
  }
  return markdown;
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

function rewriteGeneratedDoxygenLinks(html: string, routeMap: Map<string, string>) {
  return html.replace(/\b(href|src)="([^"]+)"/g, (_match, attribute, value) => {
    if (
      value.startsWith("#") ||
      value.startsWith("/") ||
      value.startsWith("//") ||
      value.startsWith("http:") ||
      value.startsWith("https:") ||
      value.startsWith("mailto:") ||
      value.startsWith("data:") ||
      value.startsWith("javascript:")
    ) {
      return `${attribute}="${value}"`;
    }

    const hashIndex = value.indexOf("#");
    const target = hashIndex >= 0 ? value.slice(0, hashIndex) : value;
    const fragment = hashIndex >= 0 ? value.slice(hashIndex) : "";
    const pageId = path.posix.basename(target, ".html");
    const siteRoute = routeMap.get(pageId);
    if (siteRoute) return `${attribute}="${siteRoute}${fragment}"`;

    const normalizedTarget = path.posix.normalize(path.posix.join("/reference/doxygen", target));
    return `${attribute}="${withSiteBase(`${normalizedTarget}${fragment}`)}"`;
  });
}

function highlightDoxygenCppFragments(html: string) {
  return html.replace(/<div class="fragment">([\s\S]*?)<\/div><!-- fragment -->/g, (_fragment, content) => {
    const lines = Array.from(content.matchAll(/<div class="line">([\s\S]*?)<\/div>/g));
    if (lines.length === 0) return _fragment;

    const code = lines.map((line) => {
      const withoutTags = line[1].replace(/<[^>]+>/g, "");
      return decodeHTML(withoutTags);
    }).join("\n");

    return cppHighlighter.codeToHtml(code, {
      lang: "cpp",
      themes: {
        light: "github-light",
        dark: "catppuccin-mocha"
      }
    }).replace('<pre class="shiki ', '<pre class="fragment shiki ');
  });
}

export function getGeneratedLibraryDocument(library: Library): GeneratedLibraryDocument | null {
  const generatedPath = path.join(docsDir, library.oldPath);
  if (!fs.existsSync(generatedPath)) return null;

  const source = fs.readFileSync(generatedPath, "utf8");
  const contentsStart = source.indexOf('<div class="contents">');
  const contentsEnd = source.indexOf("</div></div><!-- contents -->", contentsStart);
  if (contentsStart < 0 || contentsEnd < 0) return null;

  const contents = source.slice(contentsStart + '<div class="contents">'.length, contentsEnd);
  const textBlockStart = contents.indexOf('<div class="textblock">');
  if (textBlockStart < 0) return null;

  const tocHtml = contents.slice(0, textBlockStart).replace(/^\s+|\s+$/g, "");
  const contentHtml = highlightDoxygenCppFragments(
    rewriteGeneratedDoxygenLinks(contents.slice(textBlockStart).trim(), getRouteMap())
  );
  return { tocHtml, contentHtml };
}

export function renderGuideMarkdown(guide: Guide) {
  let source = fs.readFileSync(guide.sourcePath, "utf8");
  if (guide.slug === "package") {
    source = `@page page_package SC::Package\n\n${source.slice(
      source.indexOf("# SC-package.cpp") + "# SC-package.cpp".length,
      source.indexOf("# SC-format.cpp")
    ).trim()}`;
  } else if (guide.slug === "format") {
    source = `@page page_format SC::Format\n\n${source.slice(
      source.indexOf("# SC-format.cpp") + "# SC-format.cpp".length,
      source.indexOf("# How does it work")
    ).trim()}`;
  } else if (guide.slug === "tools") {
    const overviewEnd = source.indexOf("# SC-build.cpp");
    const implementationStart = source.indexOf("# How does it work");
    source = `${source.slice(0, overviewEnd).trim()}\n\n${source.slice(implementationStart).trim()}`;
  }

  let markdown = preprocessMarkdown(source, getRouteMap(), "guide");
  markdown = removeLeadingTitle(markdown, guide.title);
  markdown = removeLeadingIntro(markdown, guide.summary);

  const metadata = guideMeta(guide.pageId, guide.slug);
  if (metadata.intro) {
    markdown = `${metadata.intro}\n\n${markdown}`.trim();
  }
  if (metadata.fallback && (markdown.trim() === "" || guide.pageId === "libraries")) {
    markdown = metadata.fallback;
  }

  return marked.parse(markdown);
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
