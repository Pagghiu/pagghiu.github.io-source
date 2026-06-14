Title: 🌸 Sane C++ May 26
Date: 2026-05-31
Category: SaneCppLibraries
Image: 2026-05-31-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2026-05-31-SaneCppLibrariesUpdate
Summary: Welcome to the May 2026 update!<br> This month introduces the new `Await` coroutine library, expands `Http` into something much more practical, and keeps pushing `SC-package` and standard C++ integration forward.
TOC:    #section-0,May Updates
        #await,Await
        #http-and-httpclient,Http and HttpClient
        #build-and-sc-package,Build and SC-package
        #standard-library-integration,Standard Library Integration
        #async,Async
        #others,Others

# Await

The biggest addition of the month is definitely <a href="https://pagghiu.github.io/SaneCppLibraries/library_await.html">`Await`</a>.
It is a new C++20 coroutine layer on top of <a href="https://pagghiu.github.io/SaneCppLibraries/library_async.html">`SC::Async`</a>, so the point is not replacing the existing async model, but letting the compiler write the callback state machine instead.

What I like here is that it is still very clearly shaped like Sane C++ code.
Tasks return `Result`, memory is still explicit through `AwaitAllocator`, buffers are caller-owned, and the underlying event loop remains the same one used by callback-style `Async`.
So the style changes a lot, but the project principles do not.

May has basically been about taking `Await` from "new experiment" to something that feels real enough to be tried on more than toy examples.
There are now awaiters for sockets, files, filesystem operations, signals, process exits, background work, wake-ups, task groups, detached registries, and timeouts, plus a pretty large set of examples to show how all these pieces fit together.

Development speed has also gone up a lot thanks to heavier AI usage.
I think this month already shows that pretty clearly, and next months will probably show even more of it, so...be prepared!

Even the very end of the month kept pushing `Await` further, with more stress coverage around teardown/cancellation, a `spawnAll` helper for task groups and even a no-stdlib coroutine shim.

**Detailed list of commits:**

- [Await: Add a new library wrapping Async primitives with C++ 20 coroutines](https://github.com/Pagghiu/SaneCppLibraries/commit/b925529d)
- [Await: Add cancellations, arena and socket accept / sendAll](https://github.com/Pagghiu/SaneCppLibraries/commit/46c5c649)
- [Await: Add documentation draft page and skill guide](https://github.com/Pagghiu/SaneCppLibraries/commit/d38818e2)
- [Await: Add socket connect and UDP awaiters](https://github.com/Pagghiu/SaneCppLibraries/commit/088ba977)
- [Await: Add file read and write awaiters](https://github.com/Pagghiu/SaneCppLibraries/commit/d5aa3200)
- [Await: Add loop work awaiter](https://github.com/Pagghiu/SaneCppLibraries/commit/7a37c241)
- [Await: Add file send awaiter](https://github.com/Pagghiu/SaneCppLibraries/commit/d584bc7b)
- [Await: Mark Await as draft library](https://github.com/Pagghiu/SaneCppLibraries/commit/69a40a27)
- [Await: Support waitFor cancellation](https://github.com/Pagghiu/SaneCppLibraries/commit/765b8320)
- [Await: Extend filesystem operations](https://github.com/Pagghiu/SaneCppLibraries/commit/03deac51)
- [Await: Add process signal and spawn helpers](https://github.com/Pagghiu/SaneCppLibraries/commit/e80a9b9c)
- [Await: Extend filesystem and task APIs](https://github.com/Pagghiu/SaneCppLibraries/commit/a6ed3801)
- [Await: Add wakeUp and waitAny support](https://github.com/Pagghiu/SaneCppLibraries/commit/ce1df487)
- [Await: Add scatter gather wrappers and echo example](https://github.com/Pagghiu/SaneCppLibraries/commit/061ebffa)
- [Await: Harden cancellation and arena policy](https://github.com/Pagghiu/SaneCppLibraries/commit/42c7f26b)
- [Await: Add read helpers (receiveLine / receiveExact / readUntilEOF)](https://github.com/Pagghiu/SaneCppLibraries/commit/663e3a0b)
- [Await: Add task group example](https://github.com/Pagghiu/SaneCppLibraries/commit/c8ebb4e0)
- [Await: Add arena diagnostics](https://github.com/Pagghiu/SaneCppLibraries/commit/89899727)
- [Await: Harden task lifetime guards](https://github.com/Pagghiu/SaneCppLibraries/commit/b757fec2)
- [Await: Add callback bridge example](https://github.com/Pagghiu/SaneCppLibraries/commit/849b4f56)
- [Await: Add file courier example](https://github.com/Pagghiu/SaneCppLibraries/commit/f9a2fd10)
- [Await: Defer child task teardown during callbacks](https://github.com/Pagghiu/SaneCppLibraries/commit/377194ed)
- [Await: Promote docs to MVP status](https://github.com/Pagghiu/SaneCppLibraries/commit/111f82ea)
- [Await: Add line protocol example](https://github.com/Pagghiu/SaneCppLibraries/commit/a099e793)
- [Await: Add background digest example](https://github.com/Pagghiu/SaneCppLibraries/commit/c13f6f0c)
- [Await: Add process exit example](https://github.com/Pagghiu/SaneCppLibraries/commit/ee3ed9fc)
- [Await: Add thread wake-up example](https://github.com/Pagghiu/SaneCppLibraries/commit/c5f818d9)
- [Await: Add deadline example](https://github.com/Pagghiu/SaneCppLibraries/commit/06e94915)
- [Await: Add file patch example](https://github.com/Pagghiu/SaneCppLibraries/commit/5a7cee44)
- [Await: Add config reload example](https://github.com/Pagghiu/SaneCppLibraries/commit/c9d628dd)
- [Await: Add manifest preview example](https://github.com/Pagghiu/SaneCppLibraries/commit/e40b1b05)
- [Await: Require explicit allocator](https://github.com/Pagghiu/SaneCppLibraries/commit/7e4a26ae)
- [Await: Add fixed task registry](https://github.com/Pagghiu/SaneCppLibraries/commit/b83a382f)
- [Await: Add task registry wait all](https://github.com/Pagghiu/SaneCppLibraries/commit/9fa7ce6d)
- [Await: Add task registry wait any](https://github.com/Pagghiu/SaneCppLibraries/commit/b3ebf670)
- [Await: Add first response example](https://github.com/Pagghiu/SaneCppLibraries/commit/0c78efd1)
- [Await: Guard cross-loop cancellation](https://github.com/Pagghiu/SaneCppLibraries/commit/a12a41af)
- [Await: Add service probe example](https://github.com/Pagghiu/SaneCppLibraries/commit/28df50be)
- [Await: Polish task ergonomics and allocator diagnostics](https://github.com/Pagghiu/SaneCppLibraries/commit/c0d10515)
- [Await: Add task group spawnAll helper](https://github.com/Pagghiu/SaneCppLibraries/commit/61b15966)
- [Await: Stress child teardown callback test](https://github.com/Pagghiu/SaneCppLibraries/commit/fcf25c94)
- [Await: Stress cancellation teardown](https://github.com/Pagghiu/SaneCppLibraries/commit/24263c8c)
- [Await: Add no-stdlib coroutine shim](https://github.com/Pagghiu/SaneCppLibraries/commit/219aa635)

# Http and HttpClient

The other huge theme of the month has been <a href="https://pagghiu.github.io/SaneCppLibraries/library_http.html">`Http`</a>.
This is still a `Draft` library, but it has become much more practical for real examples instead of just being a parser plus a few low-level building blocks.

The most visible part is that the server side now has a small router, API server examples, better file-server behavior, and a more complete WebSocket path.
Things like SPA fallback, byte ranges, validators, `If-Range`, `HEAD`, `OPTIONS`, asset types, safer multipart filenames, cookies, authorization helpers, and URL query parsing are all the kind of boring HTTP details that make the difference between a demo and something actually pleasant to use.

The async client side has also been tightened up a lot, and the separate <a href="https://pagghiu.github.io/SaneCppLibraries/library_http_client.html">`HttpClient`</a> keeps moving toward a more stable allocation-free transport layer.
There is now a better request API, transport metadata, TLS options, compression support, stronger validation, and examples for both the native-backend client and the async transport integration.

The TLS work is for now just preliminary, do not expert https support (for now).

**Detailed list of commits:**

- [HttpClient: Improve request API and add redirect/TLS transport metadata](https://github.com/Pagghiu/SaneCppLibraries/commit/ad7e13cc)
- [Http: Add WebSocket frame core and tests](https://github.com/Pagghiu/SaneCppLibraries/commit/76112da6)
- [Http: Add WebSocket upgrade handshake](https://github.com/Pagghiu/SaneCppLibraries/commit/ec83d8ee)
- [Http: Add WebSocket lifecycle helpers](https://github.com/Pagghiu/SaneCppLibraries/commit/4c650db9)
- [Http: Add WebSocket small hub](https://github.com/Pagghiu/SaneCppLibraries/commit/9687f308)
- [Http: Add WebSocket canvas example](https://github.com/Pagghiu/SaneCppLibraries/commit/e8c1a047)
- [Http: Add client compression](https://github.com/Pagghiu/SaneCppLibraries/commit/b207909b)
- [Http: Add WebSocket client connect](https://github.com/Pagghiu/SaneCppLibraries/commit/1bb6edf1)
- [Http: Add API server example](https://github.com/Pagghiu/SaneCppLibraries/commit/4cdaa76c)
- [Http: Add URL query parser](https://github.com/Pagghiu/SaneCppLibraries/commit/30895c90)
- [Http: Add SCExample canvas demo](https://github.com/Pagghiu/SaneCppLibraries/commit/d8d5c9a0)
- [Http: Harden file server paths](https://github.com/Pagghiu/SaneCppLibraries/commit/f2f5ebfc)
- [Http: Add file server asset types](https://github.com/Pagghiu/SaneCppLibraries/commit/abd7070c)
- [Http: Add HEAD request support](https://github.com/Pagghiu/SaneCppLibraries/commit/b02b3dc8)
- [Http: Reject unsafe multipart filenames](https://github.com/Pagghiu/SaneCppLibraries/commit/620a795d)
- [Http: Add async client HEAD helper](https://github.com/Pagghiu/SaneCppLibraries/commit/70f0c9fd)
- [Http: Add common method parsing](https://github.com/Pagghiu/SaneCppLibraries/commit/41e072d4)
- [Http: Add file server OPTIONS](https://github.com/Pagghiu/SaneCppLibraries/commit/efcd3420)
- [Http: Add common response statuses](https://github.com/Pagghiu/SaneCppLibraries/commit/2a4ccf5d)
- [Http: Surface async server errors](https://github.com/Pagghiu/SaneCppLibraries/commit/affc6507)
- [Http: Add file validator responses](https://github.com/Pagghiu/SaneCppLibraries/commit/09697736)
- [Http: Expose server header limit](https://github.com/Pagghiu/SaneCppLibraries/commit/7b355e7b)
- [Http: Add request target accessors](https://github.com/Pagghiu/SaneCppLibraries/commit/2047b4f2)
- [Http: Add content length helper](https://github.com/Pagghiu/SaneCppLibraries/commit/24dce05d)
- [Http: Fix streamed file uploads](https://github.com/Pagghiu/SaneCppLibraries/commit/49e35523)
- [Http: Add file server validators](https://github.com/Pagghiu/SaneCppLibraries/commit/3b4a4020)
- [Http: Add file server byte ranges](https://github.com/Pagghiu/SaneCppLibraries/commit/2ef75ba8)
- [Http: Add file server SPA fallback](https://github.com/Pagghiu/SaneCppLibraries/commit/4025deaa)
- [Http: Match listed file server ETags](https://github.com/Pagghiu/SaneCppLibraries/commit/64559618)
- [Http: Honor If-Range for file ranges](https://github.com/Pagghiu/SaneCppLibraries/commit/bd96df93)
- [Http: Add cookie header iterator](https://github.com/Pagghiu/SaneCppLibraries/commit/ba9a1bb5)
- [Http: Add authorization header helpers](https://github.com/Pagghiu/SaneCppLibraries/commit/205b92d7)
- [Http: Add Set-Cookie helpers](https://github.com/Pagghiu/SaneCppLibraries/commit/6a706d4a)
- [Http: Export header helpers](https://github.com/Pagghiu/SaneCppLibraries/commit/031ece2a)
- [Http: Add minimal router helper](https://github.com/Pagghiu/SaneCppLibraries/commit/0c343930)
- [Http: Route API server example](https://github.com/Pagghiu/SaneCppLibraries/commit/58ef1d7f)
- [Http: Add urlencoded form helpers](https://github.com/Pagghiu/SaneCppLibraries/commit/9fce1b8a)
- [Http: Harden async HTTP APIs and WebSocket support](https://github.com/Pagghiu/SaneCppLibraries/commit/d2056e9c)
- [HttpClient: Stabilize allocation-free transport API](https://github.com/Pagghiu/SaneCppLibraries/commit/c4100e4e)
- [HttpClient: Add async example and harden buffer validation](https://github.com/Pagghiu/SaneCppLibraries/commit/67e7842b)
- [Http: Add active transport streams](https://github.com/Pagghiu/SaneCppLibraries/commit/e1aaec93)
- [Http: Add TLS options](https://github.com/Pagghiu/SaneCppLibraries/commit/348ea73b)
- [Http: Add async transport setup hook](https://github.com/Pagghiu/SaneCppLibraries/commit/a5ca2338)
- [Http: Polish HTTP helpers and example ergonomics](https://github.com/Pagghiu/SaneCppLibraries/commit/710945e4)
- [Http: Add multipart part predicates](https://github.com/Pagghiu/SaneCppLibraries/commit/88bf48f2)
- [Http: Stress chunked request decoding](https://github.com/Pagghiu/SaneCppLibraries/commit/f7999679)
- [Http: Simplify canvas WebSocket](https://github.com/Pagghiu/SaneCppLibraries/commit/2c7a97e5)
- [Http: HTTPS transport hook dispatch](https://github.com/Pagghiu/SaneCppLibraries/commit/ffa22ad9)
- [HttpClient: Validate request URLs](https://github.com/Pagghiu/SaneCppLibraries/commit/42a8d4ac)
- [HttpClient: Fail on response header overflow](https://github.com/Pagghiu/SaneCppLibraries/commit/fd69550b)

# Build and SC-package

After April being the big `SC::Build` month, May has been more specifically about `SC-package`.
The package manager got a fairly serious internal redesign to become more declarative, with structured receipts, exports, capabilities, recipes, locks, verification, and repair/doctor flows.

There is also more validation around cross support, more CI cache work, direct running of native translated Linux targets, and a `Fil-C` zlib package plus CI coverage for that toolchain.

**Detailed list of commits:**

- [Build: Add clarifications for the version pragma](https://github.com/Pagghiu/SaneCppLibraries/commit/05297ef6)
- [Build: Fix Windows build tool stale dependency detection](https://github.com/Pagghiu/SaneCppLibraries/commit/d2f4fe9d)
- [Build: Add package phase registry](https://github.com/Pagghiu/SaneCppLibraries/commit/fe6ccbdd)
- [Build: Expose package recipe descriptors](https://github.com/Pagghiu/SaneCppLibraries/commit/95ab29b1)
- [Build: Add package doctor command](https://github.com/Pagghiu/SaneCppLibraries/commit/4ebdd318)
- [Build: Validate package receipt contracts](https://github.com/Pagghiu/SaneCppLibraries/commit/ec8a9dc1)
- [Build: Add package lock metadata](https://github.com/Pagghiu/SaneCppLibraries/commit/d20e8540)
- [Build: Add package capability constants](https://github.com/Pagghiu/SaneCppLibraries/commit/91691aa6)
- [Build: Run Fil-C SCTest in CI](https://github.com/Pagghiu/SaneCppLibraries/commit/fb602246)
- [Build: Prewarm package caches](https://github.com/Pagghiu/SaneCppLibraries/commit/43c4c09c)
- [Build: Cache macOS cross package installs](https://github.com/Pagghiu/SaneCppLibraries/commit/7cf88418)
- [Build: Run Linux native translated targets directly](https://github.com/Pagghiu/SaneCppLibraries/commit/810b6863)
- [Build: Transform SC-Package to become more declarative](https://github.com/Pagghiu/SaneCppLibraries/commit/66412b4f)
- [Build: Add package repair command](https://github.com/Pagghiu/SaneCppLibraries/commit/c9490ee5)
- [Build: Split package manager headers](https://github.com/Pagghiu/SaneCppLibraries/commit/57af5ac3)
- [Build: Split built-in package catalog](https://github.com/Pagghiu/SaneCppLibraries/commit/8eec625f)
- [Build: Split package recipe engine](https://github.com/Pagghiu/SaneCppLibraries/commit/168ff2a6)
- [Build: Split package receipt engine](https://github.com/Pagghiu/SaneCppLibraries/commit/dc56c53b)
- [Build: Split package health engine](https://github.com/Pagghiu/SaneCppLibraries/commit/5652f7ef)
- [Build: Split package CLI engine](https://github.com/Pagghiu/SaneCppLibraries/commit/5323f177)
- [Build: Split built-in package installers](https://github.com/Pagghiu/SaneCppLibraries/commit/b0107dc6)
- [Build: Structure package registry exports](https://github.com/Pagghiu/SaneCppLibraries/commit/41c99632)
- [Build: Use typed package export kinds](https://github.com/Pagghiu/SaneCppLibraries/commit/792003fd)
- [Build: Add package kind constants](https://github.com/Pagghiu/SaneCppLibraries/commit/8efe6270)
- [Build: Use typed capability export lookup](https://github.com/Pagghiu/SaneCppLibraries/commit/70e5ba5d)
- [Build: Stabilize cross support validation](https://github.com/Pagghiu/SaneCppLibraries/commit/c53cde4c)
- [Build: Fix package receipt validation](https://github.com/Pagghiu/SaneCppLibraries/commit/859810b8)
- [Build: Normalize package receipt JSON](https://github.com/Pagghiu/SaneCppLibraries/commit/8ec096c3)
- [Build: Add package lock verification](https://github.com/Pagghiu/SaneCppLibraries/commit/518458ae)
- [Build: Add Fil-C zlib package](https://github.com/Pagghiu/SaneCppLibraries/commit/a988e8c1)

# Standard Library Integration

Another notable theme of the month has been making Sane C++ easier to consume from normal C++ projects.
Standard C++ headers are now allowed by default, while the stricter no-stdlib mode is still available when one actually wants to push in that direction.

I think this is the right tradeoff.
The libraries still try hard to avoid hidden allocations and broad runtime dependencies, but making integration easier by default removes friction for external users and also makes features like `Await` much easier to justify.

The follow-up cleanup here is also nice: `LibC.h` is gone, public include coverage has been tightened up, and some no-stdlib edge cases in GCC / plugin builds have been corrected.

**Detailed list of commits:**

- [Everywhere: Add some missing public includes](https://github.com/Pagghiu/SaneCppLibraries/commit/f6626198)
- [Everywhere: Allow using C++ stdlib by default](https://github.com/Pagghiu/SaneCppLibraries/commit/06e49ee7)
- [Foundation: Get rid of LibC.h](https://github.com/Pagghiu/SaneCppLibraries/commit/7e790e4f)
- [Plugin: Do not use nostdinc++ on plugins](https://github.com/Pagghiu/SaneCppLibraries/commit/c7d68f54)
- [Build: Avoid unsupported GCC no-stdlib flag](https://github.com/Pagghiu/SaneCppLibraries/commit/50717f21)

# Async

`Async` also deserves its own section this month.
The main point here is getting rid of the dynamic `liburing` loading and using `io_uring` directly instead, which makes the Linux backend story cleaner and more self-contained.

There are also a few useful follow-up fixes around filesystem handles, dispatched kernel events and Ubuntu 22.04 headers.
Not a huge flashy section, but definitely a nice set of improvements on its own.

**Detailed list of commits:**

- [Async: Preserve filesystem operation handles](https://github.com/Pagghiu/SaneCppLibraries/commit/4540c768)
- [Async: Add AsyncFileSystemOperation::stop](https://github.com/Pagghiu/SaneCppLibraries/commit/8b1a343c)
- [Async: Use io_uring directly](https://github.com/Pagghiu/SaneCppLibraries/commit/28f00ce1)
- [Async: Clear dispatched kernel events](https://github.com/Pagghiu/SaneCppLibraries/commit/27892f4b)
- [Async: Fix io_uring headers for Ubuntu 22.04](https://github.com/Pagghiu/SaneCppLibraries/commit/f8ab066e)

# Others

The rest of the month is a mix of practical lower-level improvements.
There are a few platform fixes around shutdown and plugin cleanup, and the single-file generation tooling can now emit standalone amalgamations.

There are also a couple of nice quality-of-life fixes around development tooling and examples.
These are still the sort of changes that make the project easier to build, test, and use across different setups.

**Detailed list of commits:**

- [File: Keep POSIX pipe descriptors out of the stdio range](https://github.com/Pagghiu/SaneCppLibraries/commit/1b9e045a)
- [FileSystemWatcher: Avoid Linux shutdown fd race](https://github.com/Pagghiu/SaneCppLibraries/commit/a6b779b8)
- [Plugin: Skip debugger file cleanup on registry close](https://github.com/Pagghiu/SaneCppLibraries/commit/2d1c27e9)
- [SCExample: Close plugins before event loop shutdown](https://github.com/Pagghiu/SaneCppLibraries/commit/f58835dd)
- [SingleFileLibs/Python: Emit standalone amalgamations](https://github.com/Pagghiu/SaneCppLibraries/commit/43b9fc3e)
- [SCExample: Restore using GLES3 backend on Linux](https://github.com/Pagghiu/SaneCppLibraries/commit/9cd93b6b)
- [VSCode: Start executable from native build folders](https://github.com/Pagghiu/SaneCppLibraries/commit/e7461761)

See you next month!
