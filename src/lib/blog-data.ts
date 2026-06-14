import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

const sourceRoot = process.cwd();
const blogDir = path.join(sourceRoot, "content", "blog");
const siteUrl = "https://pagghiu.github.io";

marked.setOptions({
  gfm: true,
  breaks: false
});

export type BlogPost = {
  slug: string;
  legacySlug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  summary: string;
  image: string | null;
  sourcePath: string;
  html: string;
  url: string;
};

function readBlogFiles() {
  return fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith(".md"))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => path.join(blogDir, file));
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

function cleanSummary(summary: string) {
  return summary
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function tagSlug(tag: string) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/\+\+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeContent(markdown: string) {
  return markdown
    .replaceAll("{attach}/", "/")
    .replaceAll("{static}/", "/")
    .replace(/https:\/\/pagghiu\.github\.io\/SaneCppLibraries\/page_principles\.html/g, "/SaneCppLibraries/guides/principles/")
    .replace(/https:\/\/pagghiu\.github\.io\/SaneCppLibraries\/libraries\.html/g, "/SaneCppLibraries/libraries/");
}

export function getBlogPosts(): BlogPost[] {
  return readBlogFiles()
    .map((file) => {
      const raw = fs.readFileSync(file, "utf8");
      const parsed = parsePelicanArticle(raw);
      const legacySlug = String(parsed.data.Slug ?? `site/blog/${path.basename(file, ".md")}`);
      const slug = legacySlug.split("/").pop() ?? path.basename(file, ".md");
      const category = String(parsed.data.Category ?? "Blog");
      const tags = [
        category,
        ...String(parsed.data.Tags ?? "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      ];
      const image = parsed.data.Image ? `/images/${String(parsed.data.Image)}` : null;
      const content = normalizeContent(parsed.content);
      return {
        slug,
        legacySlug,
        title: String(parsed.data.Title ?? slug),
        date: String(parsed.data.Date ?? ""),
        category,
        tags,
        summary: cleanSummary(String(parsed.data.Summary ?? "")),
        image,
        sourcePath: file,
        html: marked.parse(content) as string,
        url: `${siteUrl}/${legacySlug}.html`
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostsForTag(slug: string) {
  return getBlogPosts().filter((post) => post.tags.some((tag) => tagSlug(tag) === slug));
}

export function getAllTags() {
  const tags = new Map<string, string>();
  for (const post of getBlogPosts()) {
    for (const tag of post.tags) {
      const slug = tagSlug(tag);
      if (slug) tags.set(slug, tag);
    }
  }
  return [...tags.entries()]
    .map(([slug, label]) => ({ slug, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function atomFeed(posts: BlogPost[], title = "Sane Coding Blog") {
  const updated = posts[0]?.date ? `${posts[0].date}T00:00:00Z` : new Date().toISOString();
  const entries = posts
    .map((post) => {
      return `<entry>
  <title>${escapeXml(post.title)}</title>
  <link href="${escapeXml(post.url)}"/>
  <id>${escapeXml(post.url)}</id>
  <updated>${escapeXml(post.date)}T00:00:00Z</updated>
  <summary>${escapeXml(post.summary)}</summary>
</entry>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(title)}</title>
  <link href="${siteUrl}/feeds/all.atom.xml" rel="self"/>
  <link href="${siteUrl}/"/>
  <id>${siteUrl}/</id>
  <updated>${escapeXml(updated)}</updated>
${entries}
</feed>`;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
