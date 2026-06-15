import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { legacyRedirects } from "./scripts/legacy-routes.mjs";

const base = "/SaneCppLibraries";
const websiteRoot = path.dirname(fileURLToPath(import.meta.url));
const defaultSaneCppRepo = path.resolve(websiteRoot, "..", "SC-website");
const saneCppRepo = path.resolve(process.env.SANE_CPP_REPO ?? defaultSaneCppRepo);
const doxygenDir = path.join(saneCppRepo, "_Build", "_Documentation", "docs");
const pagefindDir = path.join(websiteRoot, "dist", "pagefind");

function contentTypeFor(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".css") return "text/css";
  if (extension === ".html") return "text/html";
  if (extension === ".js") return "text/javascript";
  if (extension === ".json") return "application/json";
  if (extension === ".svg") return "image/svg+xml";
  if (extension === ".png") return "image/png";
  return "application/octet-stream";
}

function serveDoxygenInDev() {
  const routePrefixes = [`${base}/reference/doxygen/`, "/reference/doxygen/"];
  return {
    name: "serve-doxygen-in-dev",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (!request.url) {
          next();
          return;
        }

        const requestPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
        const routePrefix = routePrefixes.find((prefix) => requestPath.startsWith(prefix));
        if (!routePrefix) {
          next();
          return;
        }

        const relativePath = requestPath.slice(routePrefix.length) || "index.html";
        const safePath = path.normalize(relativePath).replace(/^(\.\.[/\\])+/, "");
        const filePath = path.join(doxygenDir, safePath);
        if (!filePath.startsWith(doxygenDir) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
          next();
          return;
        }

        response.setHeader("Content-Type", contentTypeFor(filePath));
        fs.createReadStream(filePath).pipe(response);
      });
    }
  };
}

function servePagefindInDev() {
  const routePrefix = "/pagefind/";
  return {
    name: "serve-pagefind-in-dev",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (!request.url) {
          next();
          return;
        }

        const requestPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
        if (!requestPath.startsWith(routePrefix)) {
          next();
          return;
        }

        const relativePath = requestPath.slice(routePrefix.length);
        const safePath = path.normalize(relativePath).replace(/^(\.\.[/\\])+/, "");
        const filePath = path.join(pagefindDir, safePath);
        if (!filePath.startsWith(pagefindDir) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
          next();
          return;
        }

        response.setHeader("Content-Type", contentTypeFor(filePath));
        fs.createReadStream(filePath).pipe(response);
      });
    }
  };
}

function legacyRedirectFor(requestPath) {
  const withoutLeadingSlash = requestPath.replace(/^\/+/, "");
  const withoutBase = requestPath.startsWith(`${base}/`)
    ? requestPath.slice(base.length + 1)
    : withoutLeadingSlash;
  return legacyRedirects[withoutBase] ?? legacyRedirects[withoutLeadingSlash] ?? null;
}

function serveLegacyRedirectsInDev() {
  return {
    name: "serve-legacy-redirects-in-dev",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (!request.url) {
          next();
          return;
        }

        const requestPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
        const targetPath = legacyRedirectFor(requestPath);
        if (!targetPath) {
          next();
          return;
        }

        response.statusCode = 302;
        response.setHeader("Location", targetPath);
        response.setHeader("Content-Type", "text/html");
        response.end(
          `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${targetPath}"></head><body><p>Redirecting to <a href="${targetPath}">${targetPath}</a>...</p></body></html>`
        );
      });
    }
  };
}

export default defineConfig({
  site: "https://pagghiu.github.io",
  output: "static",
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [serveLegacyRedirectsInDev(), serveDoxygenInDev(), servePagefindInDev()]
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark"
    }
  }
});
