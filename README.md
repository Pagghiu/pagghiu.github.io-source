# pagghiu.github.io source

Astro source for `https://pagghiu.github.io`.

This repository replaces the old Pelican publishing flow. The generated output is still committed to the separate `Pagghiu/pagghiu.github.io` repository.

## Layout

- `content/blog/` contains the migrated blog posts from the old Pelican source.
- `public/images/` preserves the existing blog image URLs.
- `src/pages/SaneCppLibraries/` contains the Sane C++ Libraries website.
- `public/SaneCppLibraries/` contains static assets for the Sane C++ website.

## Local Development

By default the Sane C++ website reads documentation from a sibling checkout named
`SC-website`. Override it when your Sane C++ checkout lives somewhere else:

```bash
SANE_CPP_REPO=/path/to/SaneCppLibraries npm run dev
```

## Commands

```bash
npm install
npm run dev
npm run build
```

`npm run build` builds the Astro site and copies any existing Doxygen output from the selected Sane C++ checkout.

For a full publish build, including Sane C++ Doxygen and coverage generation:

```bash
SANE_CPP_REPO=/path/to/SaneCppLibraries npm run build:publish
```

To copy the generated site into the local published-output repository:

```bash
PUBLISH_REPO=/path/to/pagghiu.github.io npm run publish:local
```
