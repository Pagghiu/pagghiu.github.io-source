Title: 🍂 Sane C++ September 26
Date: 2026-09-30
Category: SaneCppLibraries
Slug: site/blog/2026-09-30-SaneCppLibrariesUpdate
Summary: Welcome to the September 2026 update!<br> This month replaces text-based errors with structured `Result` identities, adds Unix-domain sockets and external HTTP transports, improves the agent skills, and fixes several asynchronous lifetime and cancellation issues.
TOC:    #section-0,September Updates
        #structured-result-errors,Structured Result errors
        #the-migration-across-libraries-and-tools,The migration across libraries and tools
        #unix-domain-sockets-and-http-transports,Unix-domain sockets and HTTP transports
        #skills-and-evaluation,Skills and evaluation
        #async-lifetime-fixes-and-other-work,Async lifetime fixes and other work

# Structured Result errors

The biggest change this month is the error model shared by the libraries.

Previously, `SC::Result` stored a pointer to an error message. It was small and easy to propagate, but distinguishing
failures meant inspecting English text. That also tied error identity to wording and made variable diagnostics depend
on the lifetime of a formatted buffer.

The new `Result` stores a 32-bit category and a 32-bit error value in one eight-byte object. Zero represents success.
Each library owns its error enum and category, while a small registry assigns the built-in category numbers and checks
for collisions. Applications can define their own categories too.

This makes errors useful to code as well as to people. A caller can distinguish capacity exhaustion, invalid input,
cancellation, or an unsupported operation through an explicit identity. Equivalent failures use the same primary code
on each platform; native error numbers and backend stages belong in additional context.

Some APIs return an enriched result carrying that context: an operation kind, required capacity, offset, or native
error number. Converting it to a plain `Result` preserves the category and primary error, while dropping the extra
detail. `SC_TRY` continues to propagate failures, and `SC_CO_TRY` does the same for coroutines.

Error text is now optional. Each owner has a dedicated error header and a separate opt-in formatter header. Formatters
write UTF-8 into caller-provided storage, report the required capacity, and leave applications free to supply their own
wording or translations. Core libraries do not need to carry canonical English messages when an application only wants
numeric errors. Release binary checks cover this separation for static, shared, and single-file builds on macOS,
Linux, and Windows.

The temporary compatibility bridge used during migration is gone. The old message-pointer factories and `SC_TRY_MSG`
have been removed, and all participating binaries need to be rebuilt together. This is a source and ABI change, even
though plain `Result` ends the migration at eight bytes again.

The shared definitions are Common source fragments, used by
[Foundation](https://pagghiu.github.io/SaneCppLibraries/libraries/foundation/) and the other libraries without adding a
new inter-library dependency. The architecture and formatting contracts are recorded in
[COMMON-0009](https://github.com/Pagghiu/SaneCppLibraries/blob/development/Architecture/Common/common-0009-use-library-owned-structured-result-errors.md).

**Detailed list of commits:**

- [Common: Add structured Result compatibility bridge](https://github.com/Pagghiu/SaneCppLibraries/commit/b4523826c)
- [Common: Add opt-in Result error formatting](https://github.com/Pagghiu/SaneCppLibraries/commit/9ee948a4e)
- [CI: Validate Result error category registry](https://github.com/Pagghiu/SaneCppLibraries/commit/0bc9beb36)
- [Architecture: Keep Result errors platform independent](https://github.com/Pagghiu/SaneCppLibraries/commit/c5c339a83)
- [Common: Initialize enriched error contexts through their active union members](https://github.com/Pagghiu/SaneCppLibraries/commit/4821eb1db)
- [Common: Remove the Result compatibility bridge and restore its eight-byte identity](https://github.com/Pagghiu/SaneCppLibraries/commit/ec1bd64d8)
- [Strings: Complete optional diagnostics and restore CLI library-error presentation](https://github.com/Pagghiu/SaneCppLibraries/commit/6c99587ca)
- [Everywhere: Isolate Result error definitions in dedicated owner headers](https://github.com/Pagghiu/SaneCppLibraries/commit/d69ab93ca)

# The migration across libraries and tools

Most of September's commits are the work needed to make that model consistent across the repository.

The system-facing libraries now report portable operation errors and retain native details where useful:
[Threading](https://pagghiu.github.io/SaneCppLibraries/libraries/threading/),
[Process](https://pagghiu.github.io/SaneCppLibraries/libraries/process/),
[SerialPort](https://pagghiu.github.io/SaneCppLibraries/libraries/serial-port/),
[File](https://pagghiu.github.io/SaneCppLibraries/libraries/file/),
[FileSystem](https://pagghiu.github.io/SaneCppLibraries/libraries/file-system/),
[FileSystemWatcher](https://pagghiu.github.io/SaneCppLibraries/libraries/file-system-watcher/), and
[Plugin](https://pagghiu.github.io/SaneCppLibraries/libraries/plugin/).

[FileSystemIterator](https://pagghiu.github.io/SaneCppLibraries/libraries/file-system-iterator/) also separates normal
exhaustion from failure. Reaching the end of a directory traversal no longer needs an error sentinel, and a native
enumeration failure stays distinguishable from an empty directory. Filesystem predicates similarly separate their
yes/no answer from an operation error. Plugin scanning uses an explicit completion state as well.

The migration continues through
[Cryptography](https://pagghiu.github.io/SaneCppLibraries/libraries/cryptography/),
[Fibers](https://pagghiu.github.io/SaneCppLibraries/libraries/fibers/), and the async and HTTP layers. Tests now assert
error identities and propagation instead of matching prose. In particular, foreign-category failures must survive
wrappers without being replaced by a generic local error, and inactive enriched context must be cleared.

Build and Package have their own tool categories. A failed toolchain selection, package receipt validation, archive
extraction, or download can be classified at that boundary without adding tool-specific errors to a library enum.
[Strings](https://pagghiu.github.io/SaneCppLibraries/libraries/strings/) supplies structured command-line failures and
the CLI still presents readable diagnostics when its optional formatters are enabled.

There are too many individual producer migrations to list usefully here, so these are the main entry points and final
cleanup commits.

**Selected commits:**

- [Threading: Use structured error codes](https://github.com/Pagghiu/SaneCppLibraries/commit/7f7ac992e)
- [Strings: Use structured command-line errors](https://github.com/Pagghiu/SaneCppLibraries/commit/60cc3ff40)
- [Process: Use structured errors](https://github.com/Pagghiu/SaneCppLibraries/commit/4b2ce449c)
- [SerialPort: Use structured errors](https://github.com/Pagghiu/SaneCppLibraries/commit/4dcee4d4b)
- [FileSystemIterator: Separate exhaustion from errors](https://github.com/Pagghiu/SaneCppLibraries/commit/d0eae2744)
- [FileSystemIterator: Report native enumeration failure separately from exhaustion](https://github.com/Pagghiu/SaneCppLibraries/commit/b3ff61ed7)
- [FileSystemWatcher: Migrate backend failures to Result](https://github.com/Pagghiu/SaneCppLibraries/commit/145a71c2e)
- [Plugin: Migrate producers to structured results](https://github.com/Pagghiu/SaneCppLibraries/commit/8cd916bb0)
- [Socket: Migrate failure producers to ResultSocket](https://github.com/Pagghiu/SaneCppLibraries/commit/cf23a68e5)
- [Cryptography: Tighten structured producer contracts](https://github.com/Pagghiu/SaneCppLibraries/commit/ecaea99f1)
- [File: Verify propagation and completion contracts](https://github.com/Pagghiu/SaneCppLibraries/commit/b821ed7a8)
- [FileSystem: Separate predicate answers from errors](https://github.com/Pagghiu/SaneCppLibraries/commit/13bd00c0c)
- [Fibers: Define portable structured error domain](https://github.com/Pagghiu/SaneCppLibraries/commit/7361dcb84)
- [Async: Preserve portable operation identities for native failures](https://github.com/Pagghiu/SaneCppLibraries/commit/9d10e93b6)
- [Await: Consolidate equivalent task and HTTP operation errors](https://github.com/Pagghiu/SaneCppLibraries/commit/54b67a862)
- [Tools: Establish tool-owned Result error category](https://github.com/Pagghiu/SaneCppLibraries/commit/f35a84568)
- [Build: Port command-line errors to structured identities](https://github.com/Pagghiu/SaneCppLibraries/commit/3ad806bca)
- [Package: Establish owned errors for CLI registry and recipes](https://github.com/Pagghiu/SaneCppLibraries/commit/046fae0e5)
- [Result: Remove production reads of legacy messages](https://github.com/Pagghiu/SaneCppLibraries/commit/cdcae4b38)
- [Everywhere: Remove brittle plain-error wording assertions](https://github.com/Pagghiu/SaneCppLibraries/commit/c19aaed65)
- [Documentation: Finish replacing legacy Result text and layout guidance](https://github.com/Pagghiu/SaneCppLibraries/commit/46bad7bb7)

# Unix-domain sockets and HTTP transports

[Socket](https://pagghiu.github.io/SaneCppLibraries/libraries/socket/) now supports Unix-domain streams and datagrams
through family-neutral addresses. Pathname endpoints work on macOS and Linux, and Linux also supports abstract names.
Windows and Emscripten report this socket family as unsupported. Filesystem socket paths remain caller-owned: closing
a descriptor does not remove the pathname.

The same addressing support reaches
[Async](https://pagghiu.github.io/SaneCppLibraries/libraries/async/) and
[Await](https://pagghiu.github.io/SaneCppLibraries/libraries/await/), so local IPC can use synchronous calls, callbacks,
or coroutines without switching to a separate socket API.

[Http](https://pagghiu.github.io/SaneCppLibraries/libraries/http/) gained external asynchronous transports. A client
connector can own connection establishment before the built-in DNS/socket path starts, then supply readable and writable
plaintext streams. A server can accept externally supplied stream pairs into its caller-owned connection slots.
Both paths use the existing HTTP/1.1 parser and state machine.

This allows native transport providers to own their handles and connection setup while HTTP stays independent of TLS
and platform-specific transport APIs. Connection retirement and reuse follow the installed streams' lifetime barriers.

[HttpClient](https://pagghiu.github.io/SaneCppLibraries/libraries/http-client/) also received session-state fixes.
Cookie and authorization updates check capacity before committing copied fields, so a short scratch buffer cannot
leave a partially updated slot. Plain HTTP responses cannot create or replace `Secure` cookies, IP-literal cookie hosts
require exact domains, and malformed cookie input is handled more carefully. The libcurl backend disables signals when
used from a worker thread.

**Detailed list of commits:**

- [Socket: Accept UTF-8-tagged ASCII input](https://github.com/Pagghiu/SaneCppLibraries/commit/19ea71e9b)
- [Socket: Add Unix-domain socket support](https://github.com/Pagghiu/SaneCppLibraries/commit/a85300eb1)
- [Async: Add Unix-domain socket support](https://github.com/Pagghiu/SaneCppLibraries/commit/d80e8d6b0)
- [Await: Add Unix-domain socket support](https://github.com/Pagghiu/SaneCppLibraries/commit/e52db0b6f)
- [Http: Add external asynchronous transports](https://github.com/Pagghiu/SaneCppLibraries/commit/e2594fc43)
- [HttpClient: Harden session state integrity](https://github.com/Pagghiu/SaneCppLibraries/commit/b84aa99f9)
- [HttpClient: Disable libcurl signals in worker thread](https://github.com/Pagghiu/SaneCppLibraries/commit/b94aa9ca4)
- [HttpClient: Make scheduler initialization transactional](https://github.com/Pagghiu/SaneCppLibraries/commit/4befd7c6f)
- [HttpClient: Preserve async adapter errors and retryable initialization](https://github.com/Pagghiu/SaneCppLibraries/commit/e3bc247a4)

# Skills and evaluation

The repository now separates the
[Sane C++ Libraries skill](https://github.com/Pagghiu/SaneCppLibraries/tree/development/Skills/sane-cpp-libraries), which
helps agents compose the actual APIs, from the
[Sane C++ Style skill](https://github.com/Pagghiu/SaneCppLibraries/tree/development/Skills/sane-cpp-style), which teaches
ownership, capacity, errors, cleanup, and lifetime design without requiring Sane libraries.

The API guidance is more concrete now. It directs agents to verify public headers and examples before writing code,
and includes a process-and-pipe composition recipe. Capturing stdout and stderr is a useful test case: a process exit
does not mean both pipes have drained, a full capture buffer does not mean reading should stop, and a fixed number of
slots is only useful if each slot can be safely reused.

I also added a small evaluation workflow with recorded attempts and acceptance suites. The latest recorded attempt
passed all six declared functional suites, but a supplemental probe still found an unreaped child. Those are limited
experiments, with changes in both skills and model between some runs, so I would not turn the scores into a general
claim about agent performance.

They did give useful feedback: the skill gained timed-wakeup and queue-progress guidance, and the library gained a
fix to reap POSIX children when process-exit completion is delivered. The evaluation notes keep the observed failure
and the subsequent API fix visible.

**Detailed list of commits:**

- [Skills: Improve Sane skills and add evaluation support](https://github.com/Pagghiu/SaneCppLibraries/commit/661a17a9d)
- [Skills: Refine skill evaluation and async guidance](https://github.com/Pagghiu/SaneCppLibraries/commit/a66f8c9c9)
- [Skills: Record updated skill rerun and queue progress guidance](https://github.com/Pagghiu/SaneCppLibraries/commit/57e84daef)
- [Documentation: Record evaluation 4 reaping gap](https://github.com/Pagghiu/SaneCppLibraries/commit/2e1b6f396)
- [Async: Reap POSIX children on process exit completion](https://github.com/Pagghiu/SaneCppLibraries/commit/7c5586fc9)

# Async lifetime fixes and other work

Several changes this month deal with what happens just after an asynchronous callback runs.

`Async` now copies a due timeout callback before invoking it and restarts traversal from the live list. The callback
may wake a thread that immediately releases its request, so retaining the request's callable or a cached next pointer
was unsafe. A separate fix avoids touching an idle sequence after its completion callback, since that callback may
resume a coroutine and destroy or reuse the awaiter that owned the sequence.

[AsyncFibers](https://pagghiu.github.io/SaneCppLibraries/libraries/async-fibers/) now synchronizes cancellation handoff
with the event-loop owner thread. Stop and completion callbacks finish before the cancellation result is written,
avoiding concurrent writes that became visible during the `Result` migration. `Async` also dispatches cancellations
before it can block waiting for more events.

[AsyncStreams](https://pagghiu.github.io/SaneCppLibraries/libraries/async-streams/) handles failed reads without a buffer,
emits finish after a deferred writable end, and preserves transform-finalization and zlib errors. HTTP WebSocket
upgrade failures are contained, and the handshake SHA-1 provider can be selected explicitly.

The remaining work includes bounded Visual Studio discovery in `Plugin`, backend-free cryptography assertions for
Fil-C, updated documentation, and the usual monthly LOC refresh.

**Detailed list of commits:**

- [AsyncStreams: Guard failed reads without buffers](https://github.com/Pagghiu/SaneCppLibraries/commit/1440ba58b)
- [AsyncStreams: Emit finish after deferred writable end](https://github.com/Pagghiu/SaneCppLibraries/commit/c7dfad5fe)
- [AsyncStreams: Preserve transform finalize failures](https://github.com/Pagghiu/SaneCppLibraries/commit/169c404b8)
- [AsyncStreams: Preserve zlib adapter errors and safe stream lifetime](https://github.com/Pagghiu/SaneCppLibraries/commit/cf396c7ed)
- [AsyncWebServer: Contain WebSocket upgrade failures](https://github.com/Pagghiu/SaneCppLibraries/commit/b1e25acf7)
- [Http: Select WebSocket SHA1 providers](https://github.com/Pagghiu/SaneCppLibraries/commit/cf029402f)
- [Async: Dispatch cancellations before blocking](https://github.com/Pagghiu/SaneCppLibraries/commit/3afe039d5)
- [Async: Preserve timeout callbacks during dispatch](https://github.com/Pagghiu/SaneCppLibraries/commit/016015f2f)
- [AsyncFibers: Synchronize cancellation handoff](https://github.com/Pagghiu/SaneCppLibraries/commit/60a44696b)
- [Async: Avoid accessing an idle sequence after its completion callback](https://github.com/Pagghiu/SaneCppLibraries/commit/31f471d1a)
- [Testing: Allow disabled test fixtures](https://github.com/Pagghiu/SaneCppLibraries/commit/4f8ef04c9)
- [Plugin: Bound Visual Studio discovery to captured process bytes](https://github.com/Pagghiu/SaneCppLibraries/commit/8ca86b413)
- [Cryptography: Assert unsupported operations in backend-free Fil-C tests](https://github.com/Pagghiu/SaneCppLibraries/commit/43dd1b5ba)
- [Documentation: Reconcile Async ADR identities after Result integration](https://github.com/Pagghiu/SaneCppLibraries/commit/2cb284b42)
- [Documentation: Update LOC for September 2026](https://github.com/Pagghiu/SaneCppLibraries/commit/9565a78d1)

See you next month!
