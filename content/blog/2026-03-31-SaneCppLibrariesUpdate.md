Title: ☔️ Sane C++ March 26
Date: 2026-03-31
Category: SaneCppLibraries
Image: 2026-03-31-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2026-03-31-SaneCppLibrariesUpdate
Summary: Welcome to the March 2026 update!<br> This month focuses on a much more capable native backend in `SC::Build`, plus faster `Http` parsing and the first standalone `HttpClient` library.
TOC:    #section-0,March Updates
        #build-native-backend,Build
        #http-and-httpclient,Http and HttpClient
        #platform-and-runtime,Platform and Runtime
        #asyncstreams-and-tooling,AsyncStreams and Tooling

# Build

March has been a big month for <a href="https://pagghiu.github.io/SaneCppLibraries/page_build.html">`SC::Build`</a>.
Introducing the standalone native backend to build executables directly!
It now supports static libraries, shared libraries, direct host builds on Windows, binary stripping and more control over exported symbols.

Parallel compile jobs and scheduling of independent projects are already in in this first draft, but more features will be coming!

**Detailed list of commits:**

- [Build: Add a standalone build backend and support for static libraries](https://github.com/Pagghiu/SaneCppLibraries/commit/c238ce6f)
- [Build: Parallelize compile jobs in standalone native backend](https://github.com/Pagghiu/SaneCppLibraries/commit/f2791292)
- [Build: Add Windows implementation to native backend](https://github.com/Pagghiu/SaneCppLibraries/commit/be4de377)
- [Build: Parallel scheduling of independent projects](https://github.com/Pagghiu/SaneCppLibraries/commit/0513465f)
- [Build: Add support for binaries stripping](https://github.com/Pagghiu/SaneCppLibraries/commit/d93081d0)
- [Build: Add support for shared libraries](https://github.com/Pagghiu/SaneCppLibraries/commit/39a290ad)
- [Build: Enable preserving export symbols for given libraries and directories](https://github.com/Pagghiu/SaneCppLibraries/commit/23ce2ebe)
- [Everywhere: Make it possible to export symbols per library](https://github.com/Pagghiu/SaneCppLibraries/commit/a545cae5)
- [Documentation: Add information about the new Build native backend](https://github.com/Pagghiu/SaneCppLibraries/commit/e2707a82)
- [Documentation: Improve Build documentation](https://github.com/Pagghiu/SaneCppLibraries/commit/4310bc1c)

# Http and HttpClient

The `Http` work this month has been improving the hot path while cleaning up the internal API surface.
A parser benchmark has been added, the parser itself gained a specialized fast path, and both request parsing and response header emission have been tightened up.

On the server side, `Http` also gained chunked encoding support and better `AsyncFileServer` `PUT` handling.
These are the kind of features that slowly move a draft implementation away from toy examples and toward something that can be stress-tested more seriously.

The biggest user-facing addition is probably the new <a href="https://pagghiu.github.io/SaneCppLibraries/library_http_client.html">`HttpClient`</a> library.
It is a separate streaming-first HTTP client built on native OS backends (`NSURLSession` on Apple, `WinHTTP` on Windows and `libcurl` on Linux), while keeping the same caller-owned memory style used by the rest of the project.

**Detailed list of commits:**

- [Http: Add parser benchmark](https://github.com/Pagghiu/SaneCppLibraries/commit/e96bc33f)
- [Http: Add a specialized fast path to HttpParser](https://github.com/Pagghiu/SaneCppLibraries/commit/6c1067a7)
- [Http: Optimize request headers parsing and response headers emission](https://github.com/Pagghiu/SaneCppLibraries/commit/1c5edfcd)
- [Http: Improve AsyncFileServer PUT support](https://github.com/Pagghiu/SaneCppLibraries/commit/899dbaee)
- [Http: Extract common Request/Response code into Incoming/Outgoing](https://github.com/Pagghiu/SaneCppLibraries/commit/6eb6a893)
- [Http: Improve headers parser](https://github.com/Pagghiu/SaneCppLibraries/commit/c598b30b)
- [Http: Add server side chunked encoding and draft http client](https://github.com/Pagghiu/SaneCppLibraries/commit/57c720f2)
- [HttpClient: Add standalone http(s) client library based on OS API](https://github.com/Pagghiu/SaneCppLibraries/commit/127a0dbc)

# Platform and Runtime

Another major theme of the month has been widening the platform surface exposed by the lower level libraries.
`FileSystem` and `File` received a proper batch of metadata, permission and descriptor APIs, including link metadata, `stat` / `lstat`, path permissions, descriptor `stat` / `sync` / permissions, and reading stored symlink targets on Windows.

These are not especially flashy additions, but they matter because they reduce the amount of platform-specific glue needed by applications built on top of Sane C++.
The libraries become more useful precisely when they cover this boring but essential operating-system surface in a clean and cross-platform way.

At the same time `Socket` and `Async` keep filling in some gaps with `TCP_NODELAY`, multicast, `AsyncSignal`, clearer `io_uring` diagnostics, explicit wake-up coalescing, easier OS-handle association helpers and a fix to make offset-zero writes use `pwrite` / `pwritev` instead of silently falling back to `write` / `writev`.

**Detailed list of commits:**

- [Socket: Expose TCP_NODELAY](https://github.com/Pagghiu/SaneCppLibraries/commit/baf72d67)
- [Socket: Add multicast support](https://github.com/Pagghiu/SaneCppLibraries/commit/0773d746)
- [Async: Add AsyncSignal](https://github.com/Pagghiu/SaneCppLibraries/commit/491b4137)
- [Async: Explicit offset 0 now uses pwrite/pwritev instead of falling back to write/writev](https://github.com/Pagghiu/SaneCppLibraries/commit/52feb0ba)
- [Async: When stopping flag async with NeedsTeardown on poll‑based backends](https://github.com/Pagghiu/SaneCppLibraries/commit/5c8f9941)
- [FileSystem: Add link metadata operations and cross-platform tests](https://github.com/Pagghiu/SaneCppLibraries/commit/4c87243a)
- [FileSystem: Add stat and lstat metadata APIs](https://github.com/Pagghiu/SaneCppLibraries/commit/d07715c2)
- [FileSystem: Add path permission operations](https://github.com/Pagghiu/SaneCppLibraries/commit/1926000d)
- [File: Add descriptor stat/sync/permission APIs](https://github.com/Pagghiu/SaneCppLibraries/commit/633959ce)
- [FileSystem: Read stored symlink targets on Windows](https://github.com/Pagghiu/SaneCppLibraries/commit/ed4bdc66)
- [Async: Add an explicit coalesce option to AsyncLoopWakeUp](https://github.com/Pagghiu/SaneCppLibraries/commit/a5c9834d)
- [Async: Add handy overloads for associating / removing os handles](https://github.com/Pagghiu/SaneCppLibraries/commit/cdb7f904)
- [Async: Print errno value on io_uring failures](https://github.com/Pagghiu/SaneCppLibraries/commit/71cdf34b)

# AsyncStreams and Tooling

`AsyncStreams` can now reason about backpressure more precisely inside `AsyncPipeline`, slice buffers more conveniently, check whether a readable stream can be started, and most importantly it has dropped an internal dependency on `Async`.

That same dependency cleanup extends to `FileSystemWatcher`, which now uses a template-based approach to avoid depending directly on `Async`, while Linux relative-path storage has been improved too.
These changes are useful because they keep the dependency graph tighter and make the individual libraries easier to reuse in isolation.

The month also brought a few practical tooling improvements: a command line parser in `Strings`, a more reliable bootstrap timestamp check, updated tool dependencies, and repository skills for the various libraries and workflows.

**Detailed list of commits:**

- [AsyncStreams: Handle backpressure more precisely inside AsyncPipeline](https://github.com/Pagghiu/SaneCppLibraries/commit/0a6517c5)
- [AsyncStream: Allow slicing buffer in equal parts up to number of available buffers](https://github.com/Pagghiu/SaneCppLibraries/commit/d43e2512)
- [FileSystemWatcher: Increment relative path storage for Linux](https://github.com/Pagghiu/SaneCppLibraries/commit/657d4d04)
- [FileSystemWatcher: Use a template to break dependency from Async](https://github.com/Pagghiu/SaneCppLibraries/commit/b25f3f3a)
- [AsyncStreams: Get rid of internal dependency on Async](https://github.com/Pagghiu/SaneCppLibraries/commit/d5007725)
- [Strings: Add command line parser](https://github.com/Pagghiu/SaneCppLibraries/commit/4c458e87)
- [Tools: Use high resolution modification time in bootstrap](https://github.com/Pagghiu/SaneCppLibraries/commit/e7bb106f)
- [AsyncStreams: Add method to check if a readable stream can be started](https://github.com/Pagghiu/SaneCppLibraries/commit/5f0716b1)
- [Tools: Remove 7zip and update clang to 20.1.8](https://github.com/Pagghiu/SaneCppLibraries/commit/c31c7f39)
- [Skills: Add skills for all libraries and some additional workflows](https://github.com/Pagghiu/SaneCppLibraries/commit/d206291e)

See you next month!
