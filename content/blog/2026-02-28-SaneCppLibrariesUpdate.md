Title: 🔌 Sane C++ February 26
Date: 2026-02-28
Category: SaneCppLibraries
Image: 2026-02-28-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2026-02-28-SaneCppLibrariesUpdate
Summary: Welcome to the February 2026 update!<br> This month introduces `SerialPort`, named-pipe end-to-end support, and major async backend wakeup/process handling improvements.
TOC:    #section-0,February Updates
        #serialport-and-named-pipes,SerialPort and Named Pipes
        #async-runtime,Async Runtime
        #http-and-asyncwebserver,Http and AsyncWebServer
        #testing-and-build,Testing and Build
        #others,Others


# SerialPort and Named Pipes

February has been all about connecting low-level I/O pieces end to end.
A new cross-platform `SerialPort` library landed with dedicated tests (including `com0com` coverage), while named-pipe support now spans `File`, `Async`, and `AsyncStreams`.

The result is that local IPC and serial communication can now be handled with the same async building blocks used by the rest of the project, with better test coverage across platform-specific behavior.

**Detailed list of commits:**

- [SerialPort: Add cross-platform library to handle serial ports](https://github.com/Pagghiu/SaneCppLibraries/commit/92eb611d)
- [SerialPort: Add com0com test](https://github.com/Pagghiu/SaneCppLibraries/commit/8fad4618)
- [File: Add named pipe server/client API and coverage](https://github.com/Pagghiu/SaneCppLibraries/commit/4dfcfe5a)
- [Async: Add named pipe input/output tests](https://github.com/Pagghiu/SaneCppLibraries/commit/63f0c521)
- [AsyncStreams: Add PipeDescriptor stream init and named pipe tests](https://github.com/Pagghiu/SaneCppLibraries/commit/fbb96637)
- [Async: Add async serial port tests](https://github.com/Pagghiu/SaneCppLibraries/commit/2d8b635c)
- [File: Use pipe2 to set CLOEXEC atomically for new pipes](https://github.com/Pagghiu/SaneCppLibraries/commit/d7cb0b31)

# Async Runtime

`Async` received several runtime reliability upgrades this month.
The new `AsyncFileSend` primitive is now part of the core, and multiple fixes improved cancellation safety and timer sequencing.

Backend wakeup/process handling was also strengthened with platform-native primitives (`eventfd`, `EVFILT_USER`, `pidfd`) so event loops can coordinate shared wakeups and process exits more predictably, especially on Linux.

**Detailed list of commits:**

- [Async: Add AsyncFileSend primitive](https://github.com/Pagghiu/SaneCppLibraries/commit/a5ce1e83)
- [Async: Only reset Flag_NeedsTeardown if async is accessible](https://github.com/Pagghiu/SaneCppLibraries/commit/353b61d2)
- [Async: Keep sequenced LoopTimeouts in active timer list](https://github.com/Pagghiu/SaneCppLibraries/commit/288b6787)
- [Async: Keep completion-state invariant during IOCP cancellation](https://github.com/Pagghiu/SaneCppLibraries/commit/a10314c0)
- [Async: Use eventfd on epoll and EVFILT_USER on kqueue for shared wakeups](https://github.com/Pagghiu/SaneCppLibraries/commit/63d87e83)
- [Async: Use pidfd for Linux epoll process exit handling](https://github.com/Pagghiu/SaneCppLibraries/commit/ae27e400)

# Http and AsyncWebServer

`Http` now uses `AsyncFileSend` for file server transfers, and header accumulation got a small optimization.
At the same time, `AsyncWebServer` and examples gained more runtime knobs: selecting ports, forcing epoll backend options, and configuring max clients / I/O threads.

These changes make it easier to benchmark and stress the server in real scenarios, while keeping setup fully self-hosted.

**Detailed list of commits:**

- [Http: Use AsyncFileSend in file server](https://github.com/Pagghiu/SaneCppLibraries/commit/3ab90246)
- [Http: Header accumulation minor optimization](https://github.com/Pagghiu/SaneCppLibraries/commit/2e3b6409)
- [AsyncWebServer: Expose max clients and io threads as CLI parameters](https://github.com/Pagghiu/SaneCppLibraries/commit/f7ef1a24)
- [Examples: Add options to force using epoll backend](https://github.com/Pagghiu/SaneCppLibraries/commit/2b8fe4d8)
- [Examples: Add port argument to AsyncWebServer](https://github.com/Pagghiu/SaneCppLibraries/commit/32fbcbca)

# Testing and Build

A good portion of the work focused on making test runs more parallel-friendly and less conflicting.
`BuildTest` and `PluginTest` fixtures are now isolated better, while SCTest supports configurable port offsets and opt-in `BuildTest` execution for local workflows.

This should reduce flakiness when multiple configurations or runs happen at the same time.

**Detailed list of commits:**

- [Build: Isolate BuildTest outputs for parallel SCTest runs](https://github.com/Pagghiu/SaneCppLibraries/commit/a3a0bac4)
- [Testing: Make BuildTest opt-in locally via --all-tests](https://github.com/Pagghiu/SaneCppLibraries/commit/9759bc32)
- [Testing: Add configurable SCTest port offsets](https://github.com/Pagghiu/SaneCppLibraries/commit/78a45340)
- [Plugin: Isolate PluginTest fixtures for parallel SCTest runs](https://github.com/Pagghiu/SaneCppLibraries/commit/b323fc19)

# Others

The rest of the month includes practical API and platform cleanups across multiple libraries.
From read error parsing in `File`, to `ProcessEnvironment::get`, to exposing `SO_REUSEADDR`, this batch improves day-to-day ergonomics while tightening edge-case behavior.

**Detailed list of commits:**

- [File: Parse read errors in FileDescriptor::readAppend](https://github.com/Pagghiu/SaneCppLibraries/commit/45ee4a87)
- [Process: Add ProcessEnvironment::get](https://github.com/Pagghiu/SaneCppLibraries/commit/6febcee5)
- [Socket: Expose SO_REUSEADDR](https://github.com/Pagghiu/SaneCppLibraries/commit/abc88ebc)
- [FileSystemWatcher: Increment relative path storage](https://github.com/Pagghiu/SaneCppLibraries/commit/8abd23b5)
- [Tools: Update 7zr to 26.00](https://github.com/Pagghiu/SaneCppLibraries/commit/be06c23c)

See you next month!
