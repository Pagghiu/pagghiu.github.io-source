Title: 🌫️ Sane C++ November 25
Date: 2025-11-30
Category: SaneCppLibraries
Image: 2025-11-30-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2025-11-30-SaneCppLibrariesUpdate
Summary: Welcome to the November 2025 update!<br> This month, focus is bringing the long neglected `Http` library out of its initial `Draft` state!
TOC:    #section-0,November Updates
        #http,Http
        #asyncstreams,AsyncStreams
        #async,Async
        #tools,Tools
        #build,Build
        #others,Others

# Http

The `Http` library was initially put together in a hurry for the first release of Sane C++ Libraries almost two years ago. Since then, it has remained largely unchanged, a simple `Draft` that was just enough to demonstrate a basic asynchronous web server.

While useful, its minimal implementation and lack of comprehensive tests meant it was often fragile, breaking as other parts of the ecosystem evolved. The time has come to give `Http` the attention it deserves and begin the long process of elevating it to a more robust state.

The first steps on this journey involve reducing its footprint by removing now-unnecessary dependencies on `Containers` and `Time`. Concurrently, `Http` is being refactored to leverage the `AsyncStreams` abstraction instead of dealing with raw socket operations. The next step is to remove the `Memory` dependency, leaving `AsyncStreams` as its sole dependency and solidifying its foundation.

<a href="https://pagghiu.github.io/SaneCppLibraries/page_dependencies.html" target="_blank">
<img src="{attach}/images/2025-11-30-SaneCppLibrariesUpdate/2025-11-Dependencies.svg">
</a>

**Detailed list of commits:**

- [Http: Fix issues introduced when removing dependency from String](https://github.com/Pagghiu/SaneCppLibraries/commit/8f188bae)
- [Http: Fix using HttpServerClient across Plugin boundaries](https://github.com/Pagghiu/SaneCppLibraries/commit/ac94af4f)
- [Http: Move HttpServer::parse to HttpRequest](https://github.com/Pagghiu/SaneCppLibraries/commit/3c7c3359)
- [Http: Remove dependency on Containers library](https://github.com/Pagghiu/SaneCppLibraries/commit/81bc9234)
- [Http: Remove dependency on Time library](https://github.com/Pagghiu/SaneCppLibraries/commit/82315df1)
- [Http: Split HttpAsyncServer out of HttpServer](https://github.com/Pagghiu/SaneCppLibraries/commit/a320715e)
- [Http: Start integrating AsyncStreams](https://github.com/Pagghiu/SaneCppLibraries/commit/cd423d17)
- [Http: Stop reading data from socket stream before sending response](https://github.com/Pagghiu/SaneCppLibraries/commit/31f38dd5)
- [Http: Write request headers to user provided region of memory](https://github.com/Pagghiu/SaneCppLibraries/commit/b1ce27d2)

# AsyncStreams

As is often the case, improvements in one library drive the evolution of another. The work on `Http` exposed some limitations in `AsyncStreams`.

Previously, `AsyncStreams` was strict, only allowing data from its own pre-allocated buffers. This is great for managing memory with a fixed budget, but `Http` needed more flexibility. It required the ability to handle data from other subsystems without forcing a copy.

To accommodate this, the buffer system in `AsyncStreams` is now a hybrid model. It now supports read-only buffers and `IGrowableBuffer`-based views, where the memory lifetime is managed by the caller. This change, along with several bug fixes to the stream's state machine, makes `AsyncStreams` more powerful and flexible, ready for the more complex scenarios that the evolving `Http` library will demand.

**Detailed list of commits:**

- [AsyncStreams: Add read only AsyncBufferView](https://github.com/Pagghiu/SaneCppLibraries/commit/690750c3)
- [AsyncStreams: Allow re-using streams after they've been stopped, ended or destroyed](https://github.com/Pagghiu/SaneCppLibraries/commit/22feff4a)
- [AsyncStreams: Avoid buffer leak when stopping async streams on close / finish](https://github.com/Pagghiu/SaneCppLibraries/commit/2a422952)
- [AsyncStreams: Free Readable and Growable buffer slots when their refCount expires](https://github.com/Pagghiu/SaneCppLibraries/commit/065bdcce)
- [AsyncStreams: Remove the Destroying state](https://github.com/Pagghiu/SaneCppLibraries/commit/776b38f0)
- [AsyncStreams: Return true from AsyncReadableStream::push if the caller can continue pushing](https://github.com/Pagghiu/SaneCppLibraries/commit/b9732563)
- [AsyncStreams: Stop socket and file requests when close or finish events happens](https://github.com/Pagghiu/SaneCppLibraries/commit/207570c5)
- [AsyncStreams: Use a fixed size for AsyncPipeline transforms and sinks](https://github.com/Pagghiu/SaneCppLibraries/commit/de65bb9f)
- [AsyncStreams: Wrap Strings / Buffers in AsyncBufferView though type erasure](https://github.com/Pagghiu/SaneCppLibraries/commit/c6cd8283)
- [SCExample: Add option to use AsyncStreams in WebServerExample](https://github.com/Pagghiu/SaneCppLibraries/commit/cf7313e5)


# Async

Stress-testing the new `Http` and `AsyncStreams` integration revealed some subtle edge cases in the core `Async` library.

For instance, on Windows, `IOCP` cancellations can return `ERROR_NOT_FOUND` if no cancellation was queued, which shouldn't be treated as a critical error by higher-level abstractions.

More critically, a re-entrancy bug was discovered. Calling the event loop's `runOnce` method from within a callback could cause the same callback to be invoked again before it had been fully torn down. A new internal flag, `Flag_NeedsTeardown`, now prevents the same completion from being incorrectly called multiple times.

**Detailed list of commits:**

- [Async: Do not complete multiple times requests waiting for teardown](https://github.com/Pagghiu/SaneCppLibraries/commit/e54d8ab1)
- [Async: Flag most types for dll export](https://github.com/Pagghiu/SaneCppLibraries/commit/6f3ad886)
- [Async: Handle ERROR_NOT_FOUND in IOCP cancellations using CancelIOEx](https://github.com/Pagghiu/SaneCppLibraries/commit/c1b763ce)

# Tools

The `ToolsBootstrap` utility, which replaces the old bootstrap Makefiles, has received some bug fixes and feature enhancements.

This tool was largely coded with AI assistance, and in an interesting experiment, it was automatically translated from C++ to C. Why? To get even faster compilation times. While the C++ version was already quick, the C version is *faster*, and the translation was surprisingly low-effort. So... here it is!

**Detailed list of commits:**

- [Tools: Compile Tools.cpp and the Tool script in parallel](https://github.com/Pagghiu/SaneCppLibraries/commit/af5c2528)
- [Tools: Compile with debug info enabled so that tools can be debugged](https://github.com/Pagghiu/SaneCppLibraries/commit/27dc5864)
- [Tools: Do not use nostdinc++ in ToolsBootstrap for older GCC](https://github.com/Pagghiu/SaneCppLibraries/commit/b2062177)
- [Tools: Make bootstrap return -1 on error](https://github.com/Pagghiu/SaneCppLibraries/commit/6562b144)
- [Tools: Port ToolsBootstrap to C](https://github.com/Pagghiu/SaneCppLibraries/commit/1bdb55e8)

# Build

`SC::Build` is steadily maturing. This month, it gained the ability to specify coverage exclusion regexes directly in the `SC-Build.cpp` file. Additionally, the generated `Makefile` targets are now smarter, automatically attempting a clean rebuild if a `No rule to make target` error occurs.

**Detailed list of commits:**

- [Build: Automatically rebuild makefiles on "No rule to make target" error](https://github.com/Pagghiu/SaneCppLibraries/commit/0e01bdbd)
- [Build: De-hardcode coverage regex exclusion](https://github.com/Pagghiu/SaneCppLibraries/commit/d46a112e)

# Others

As with every month, there are numerous small fixes and improvements that don't need their own section but are worth mentioning.

A fix for pipe reads on Windows was added to `File`, and the `Function` template now has a user-configurable `LAMBDA_SIZE` to help avoid heap allocations for closures. `Console` gained methods for printing to `stderr`, and the limitations of `FileSystemWatcher` are now better documented thanks to a community-filed issue.

All these small changes are great indicators of the libraries maturing and hardening over time!

**Detailed list of commits:**

- [Containers: Increase Array coverage](https://github.com/Pagghiu/SaneCppLibraries/commit/b4498097)
- [File: Handle Windows ERROR_BROKEN_PIPE for synchronous reads](https://github.com/Pagghiu/SaneCppLibraries/commit/2d72fdb9)
- [FileSystemWatcher: Document file watcher limitations](https://github.com/Pagghiu/SaneCppLibraries/commit/75eaa833)
- [Foundation: Fix type constraints for Span<T> std::initializer_list  constructor](https://github.com/Pagghiu/SaneCppLibraries/commit/107c23b0)
- [Foundation: Make Function LAMBDA_SIZE user configurable](https://github.com/Pagghiu/SaneCppLibraries/commit/f7e24260)
- [Strings: Add Console methods to enable printing to stderr](https://github.com/Pagghiu/SaneCppLibraries/commit/144fadd0)