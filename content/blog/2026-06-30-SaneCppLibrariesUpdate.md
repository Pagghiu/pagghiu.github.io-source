Title: ☀️ Sane C++ June 26
Date: 2026-06-30
Category: SaneCppLibraries
Image: 2026-06-30-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2026-06-30-SaneCppLibrariesUpdate
Summary: Welcome to the June 2026 update!<br> This month is about cleaner common foundations, more dependency-free libraries, agent-friendly repository workflows, Windows long-path support, and a large pass on `Async` contracts.
TOC:    #section-0,June Updates
        #common-foundations,Common Foundations
        #agentic-repository-workflow,Agentic Repository Workflow
        #windows-long-paths,Windows Long Paths
        #async-contracts,Async Contracts
        #polish-and-everything-else,Polish and Everything Else

# Common Foundations

June started with a fairly deep cleanup of the lower layers of the project.
The old shape was that many libraries depended on <a href="https://pagghiu.github.io/SaneCppLibraries/library_foundation.html">`Foundation`</a> even when they only needed a small primitive such as `Result`, `Span`, `Function`, compiler macros, platform detection, or a basic string/path view.

That is much cleaner now.
A large set of these small building blocks has been moved into common fragments, so libraries can include only the pieces they actually need.
The practical consequence is important: many more libraries now have no real library dependency at all.

<a href="/images/2026-06-30-SaneCppLibrariesUpdate/2026-06-Dependencies.svg" target="_blank">
<img src="/images/2026-06-30-SaneCppLibrariesUpdate/2026-06-Dependencies.svg" alt="Sane C++ Libraries dependency graph for June 2026">
</a>

This fits the direction I want for Sane C++ Libraries.
The libraries should be easy to pick up individually, easy to amalgamate, and easy for tools or agents to reason about without dragging a large conceptual dependency tree behind every include.
Smaller dependency surfaces also make the single-file outputs less surprising, because the generated order is closer to the actual code structure.

`Plugin` and `SerializationText` also got dependency simplifications in the same spirit.
They no longer need to pull in `Strings`, which removes another bit of unnecessary coupling from libraries that should stay small and composable.

There were also follow-up fixes around per-library assert providers, documentation, CI, and the JavaScript single-file generation path.

**Detailed list of commits:**

- [Foundation: Split Compiler.h, Platform.h and PrimitiveTypes.h in common code fragments](https://github.com/Pagghiu/SaneCppLibraries/commit/d7c1e68c)
- [Foundation: Remove SC_COMPILER_UNUSED](https://github.com/Pagghiu/SaneCppLibraries/commit/87ceb892)
- [Foundation: Integrate CompilerMacrosExport.h](https://github.com/Pagghiu/SaneCppLibraries/commit/6b8eede0)
- [Foundation: Move Result.h to Common](https://github.com/Pagghiu/SaneCppLibraries/commit/e5ff0939)
- [Foundation: Move Deferred.h to Common](https://github.com/Pagghiu/SaneCppLibraries/commit/c5c45d88)
- [Foundation: Move UniqueHandle.h to Common](https://github.com/Pagghiu/SaneCppLibraries/commit/0b26ab5e)
- [Foundation: Move Function.h and TypeTraits.h to Common](https://github.com/Pagghiu/SaneCppLibraries/commit/17c22cfe)
- [Foundation: Move AlignedStorage.h to Common](https://github.com/Pagghiu/SaneCppLibraries/commit/7b548642)
- [Foundation: Formatting for Result.h](https://github.com/Pagghiu/SaneCppLibraries/commit/bbee085f)
- [Foundation: Move OpaqueObject.h to Common](https://github.com/Pagghiu/SaneCppLibraries/commit/69d464f9)
- [Foundation: Move InitializerList.h to Common](https://github.com/Pagghiu/SaneCppLibraries/commit/e2eee9d8)
- [Foundation: Move Span.h to Common](https://github.com/Pagghiu/SaneCppLibraries/commit/a0bb73f5)
- [Foundation: Move IGrowableBuffer.h to Common](https://github.com/Pagghiu/SaneCppLibraries/commit/10802c9a)
- [Foundation: Move StringSpan.h to Common](https://github.com/Pagghiu/SaneCppLibraries/commit/f0924c6a)
- [Foundation: Move StringPath.h to Common](https://github.com/Pagghiu/SaneCppLibraries/commit/7bd01bdb)
- [Foundation: Move Assert.h to Common](https://github.com/Pagghiu/SaneCppLibraries/commit/fa6dcd90)
- [Foundation: Make Assert providers per library](https://github.com/Pagghiu/SaneCppLibraries/commit/accab404)
- [Foundation: Fix JS single-file Common order resolution](https://github.com/Pagghiu/SaneCppLibraries/commit/cf889c59)
- [Foundation: Fix documentation after Common moves](https://github.com/Pagghiu/SaneCppLibraries/commit/4334e638)
- [Foundation: Fix CI after Common fragment moves](https://github.com/Pagghiu/SaneCppLibraries/commit/ecc6d6e0)
- [Foundation: Simplify StringSpan.h](https://github.com/Pagghiu/SaneCppLibraries/commit/6058db84)
- [Everywhere: Remove Foundation dependency](https://github.com/Pagghiu/SaneCppLibraries/commit/5f412ca4)
- [Documentation: Clarify the No Allocations clauses](https://github.com/Pagghiu/SaneCppLibraries/commit/f7ce3612)
- [SerializationText: Remove Strings dependency](https://github.com/Pagghiu/SaneCppLibraries/commit/22464bb8)
- [Plugin: Remove dependency on Strings library](https://github.com/Pagghiu/SaneCppLibraries/commit/2a6aaffd)

# Agentic Repository Workflow

Another theme this month was making the repository easier to navigate and change with agents.

The documentation now has an explicit agentic contribution workflow.
The website tagline also moved toward the "built for Agents" direction, and the documentation CI can trigger publishing of the website source.

This matters because I think that the era of manual coding is over (excluding recreative purposes of course).

Humans and agents both need routes through the codebase: library docs, skills, examples, local AGENTS.md and more, all pointing in the same direction.

I plan to expand more on this theme in the coming months, adding more formal constraints and ADR to prevent agents from derailing.

**Detailed list of commits:**

- [Documentation: Define agentic contribution workflow](https://github.com/Pagghiu/SaneCppLibraries/commit/e9dd4799)
- [CI: Trigger website source publish from documentation CI](https://github.com/Pagghiu/SaneCppLibraries/commit/212ec9f9)
- [Documentation: Add "built for Agents" to the tagline](https://github.com/Pagghiu/SaneCppLibraries/commit/3aecf593)
- [Documentation: Correct coverage links](https://github.com/Pagghiu/SaneCppLibraries/commit/474a5e23)

# Windows Long Paths

Windows long paths also deserve their own section.
This work started right at the end of May and carried into June with follow-up fixes, documentation, and build-tool integration.

The short version is that Windows runtime targets are now long-path-aware by default where it makes sense.
`SC::Build` can emit the manifest support needed for console executables, GUI applications, and shared libraries, while static libraries reject that option because there is no runtime manifest to embed.

There is common Windows path handling, long-path-aware bootstrap behavior, PowerShell launcher support, Visual Studio project generation support, native build command rewriting, manifest/resource staging, and test coverage around long directory names.

Hopefully now this just works transparently without too many issues (and if there are, just as your agent to report them).

**Detailed list of commits:**

- [Everywhere: Support windows long paths](https://github.com/Pagghiu/SaneCppLibraries/commit/dc129f07)
- [Build: Add Windows long-path policy switch](https://github.com/Pagghiu/SaneCppLibraries/commit/34e3c825)
- [Tools: Fix Windows UNC bootstrap and manifest staging](https://github.com/Pagghiu/SaneCppLibraries/commit/e2ed6aba)

# Async Contracts

The biggest library-specific work this month was <a href="https://pagghiu.github.io/SaneCppLibraries/library_async.html">`Async`</a>.
May introduced `Await` as a coroutine layer on top of `Async`, so June spent a lot of time tightening the lower-level contracts that everything else depends on.

The new `AsyncContractTest` is the clearest sign of that shift.
Instead of only testing individual operations, the test suite now captures more of the lifecycle rules around event loops, requests, close paths, cancellation state, manual completions, sequence shutdown, submitted request stops, blocking polls, and request reuse from callbacks.

`AsyncFilePoll` was also split into `AsyncFileReadiness` and `AsyncExternalCompletion`.
That is a better separation: one concept is about file readiness, while the other is about manually injecting completions into the event loop.
Those were related implementation paths, but they are not the same API idea.

There was also a lot of wording cleanup in the docs.
Signal fanout, signal option semantics, request enumeration, event-loop run behavior, and thread-pool policy are all more explicit now.
That should help both direct `Async` users and the newer `Await` layer avoid relying on behavior that was accidental or underspecified.


**Detailed list of commits:**

- [Async: Split AsyncFilePoll into AsyncFileReadiness and AsyncExternalCompletion](https://github.com/Pagghiu/SaneCppLibraries/commit/e880c340)
- [Async: Stabilize FileSystemWatcher async submission test](https://github.com/Pagghiu/SaneCppLibraries/commit/1ba3b500)
- [Async: Stop dispatching completions inside close()](https://github.com/Pagghiu/SaneCppLibraries/commit/63298677)
- [Async: Add AsyncContractTest](https://github.com/Pagghiu/SaneCppLibraries/commit/7e7ba888)
- [Async: Strengthen core lifecycle contracts](https://github.com/Pagghiu/SaneCppLibraries/commit/7ce1f93b)
- [Async: Enumerate active sequenced requests](https://github.com/Pagghiu/SaneCppLibraries/commit/dd9936bb)
- [Async: Clarify signal watcher fanout](https://github.com/Pagghiu/SaneCppLibraries/commit/56f467e9)
- [Async: Clarify signal option semantics](https://github.com/Pagghiu/SaneCppLibraries/commit/87c796f6)
- [Async: Cover submitted request stop contract](https://github.com/Pagghiu/SaneCppLibraries/commit/c500315e)
- [Async: Document request enumeration contract](https://github.com/Pagghiu/SaneCppLibraries/commit/cdb4b91a)
- [Async: Mark cancellation enumeration nonportable](https://github.com/Pagghiu/SaneCppLibraries/commit/be9e7488)
- [Async: Remove misleading signal one-shot no-op](https://github.com/Pagghiu/SaneCppLibraries/commit/db46aa4f)
- [Async: Cover event loop recreation contract](https://github.com/Pagghiu/SaneCppLibraries/commit/137774a7)
- [Async: Cover blocking poll listeners](https://github.com/Pagghiu/SaneCppLibraries/commit/54039e45)
- [Async: Cover excluded active run semantics](https://github.com/Pagghiu/SaneCppLibraries/commit/35d3f79f)
- [Async: Cover interrupted run contract](https://github.com/Pagghiu/SaneCppLibraries/commit/4c2565ae)
- [Async: Clarify event loop contracts](https://github.com/Pagghiu/SaneCppLibraries/commit/670f5f9c)
- [Async: Clarify thread pool policy](https://github.com/Pagghiu/SaneCppLibraries/commit/5faa0293)
- [Async: Clean wakeup test noise](https://github.com/Pagghiu/SaneCppLibraries/commit/9beba993)
- [Async: Reset external completion cancellation state](https://github.com/Pagghiu/SaneCppLibraries/commit/799e99e7)
- [Async: Cover event loop close completion paths](https://github.com/Pagghiu/SaneCppLibraries/commit/e011f544)
- [Async: Cover reactivation decision contracts](https://github.com/Pagghiu/SaneCppLibraries/commit/a9b0969a)
- [Async: Cover sequence shutdown contracts](https://github.com/Pagghiu/SaneCppLibraries/commit/c69f2988)
- [Async: Preserve run progress for manual completions](https://github.com/Pagghiu/SaneCppLibraries/commit/2a942cdc)
- [Async: Cover request reuse from close callback](https://github.com/Pagghiu/SaneCppLibraries/commit/4f1cd16d)
- [Async: Handle missing thread pool completion removal](https://github.com/Pagghiu/SaneCppLibraries/commit/a6801c44)

# Http, HttpClient and Everything Else

The rest of the month is mostly hardening and small practical fixes.

`Http` and `HttpClient` got a lot of edge-case coverage.
Most of this is diagnostic and validation work: pinned error messages, disabled upload policies, multipart behavior, router and header helpers, WebSocket frame/hub diagnostics, server parser behavior, client TLS diagnostics, URL and proxy validation, authorization origin checks, cookie scope, and response header length limits.

That may sound less exciting than adding new HTTP features, but it is the work that makes the newer HTTP surface safer to build examples on.
May made the HTTP libraries more useful; June made more of their failure modes explicit.

There were also smaller platform and tooling fixes.
`Process` has a larger Windows environment arena, `FileSystemWatcher` handles zero-byte Windows change completions, `SCExample` is a little more robust around plugin files and example paths, the Windows bash launcher forwards to `SC.bat`, Visual Studio LLVM tool discovery was fixed in CI, and `Time` avoids an integer conversion warning.

**Detailed list of commits:**

- [Process: Increase Windows process environment arena](https://github.com/Pagghiu/SaneCppLibraries/commit/1a132c04)
- [Http: Pin diagnostic result messages](https://github.com/Pagghiu/SaneCppLibraries/commit/0d727cab)
- [Http: Add public header compile smoke](https://github.com/Pagghiu/SaneCppLibraries/commit/714ecf7c)
- [Http: Stress large multipart uploads](https://github.com/Pagghiu/SaneCppLibraries/commit/58788195)
- [Http: Pin WebSocket hub diagnostics](https://github.com/Pagghiu/SaneCppLibraries/commit/97fa03f0)
- [Http: Clarify server lifecycle errors](https://github.com/Pagghiu/SaneCppLibraries/commit/d0483e45)
- [Http: Pin file server option diagnostics](https://github.com/Pagghiu/SaneCppLibraries/commit/c67168ce)
- [Http: Fix server storage diagnostics](https://github.com/Pagghiu/SaneCppLibraries/commit/1029e1d8)
- [Http: Pin router diagnostics](https://github.com/Pagghiu/SaneCppLibraries/commit/649645e6)
- [Http: Pin multipart writer diagnostics](https://github.com/Pagghiu/SaneCppLibraries/commit/392fa55a)
- [Http: Pin header helper diagnostics](https://github.com/Pagghiu/SaneCppLibraries/commit/a893f23b)
- [Http: Pin WebSocket frame diagnostics](https://github.com/Pagghiu/SaneCppLibraries/commit/d7ff02aa)
- [Http: Add form value lookup helper](https://github.com/Pagghiu/SaneCppLibraries/commit/9517792c)
- [Http: Pin URL decode diagnostics](https://github.com/Pagghiu/SaneCppLibraries/commit/b675c127)
- [Http: Add request option setters](https://github.com/Pagghiu/SaneCppLibraries/commit/f15a8363)
- [Http: Use request option setters](https://github.com/Pagghiu/SaneCppLibraries/commit/5f302eee)
- [Http: Pin multipart header diagnostics](https://github.com/Pagghiu/SaneCppLibraries/commit/436187bb)
- [Http: Cover disabled uploads policy](https://github.com/Pagghiu/SaneCppLibraries/commit/63a87eb6)
- [Http: Pin client trailer diagnostic](https://github.com/Pagghiu/SaneCppLibraries/commit/0967e750)
- [Http: Smoke client option helpers](https://github.com/Pagghiu/SaneCppLibraries/commit/7cbb5f13)
- [Http: Pin client TLS diagnostics](https://github.com/Pagghiu/SaneCppLibraries/commit/312fa170)
- [Http: Pin server parser diagnostics](https://github.com/Pagghiu/SaneCppLibraries/commit/b8fdf14d)
- [Http: Cover disabled multipart uploads](https://github.com/Pagghiu/SaneCppLibraries/commit/8daceaa5)
- [HttpClient: Align session URL validation](https://github.com/Pagghiu/SaneCppLibraries/commit/5ec2528c)
- [HttpClient: Tighten proxy URL validation](https://github.com/Pagghiu/SaneCppLibraries/commit/2fd398db)
- [HttpClient: Document proxy URL constraints](https://github.com/Pagghiu/SaneCppLibraries/commit/5ab1d2f3)
- [HttpClient: Validate cached authorization headers](https://github.com/Pagghiu/SaneCppLibraries/commit/2c116fd8)
- [HttpClient: Document session authorization validation](https://github.com/Pagghiu/SaneCppLibraries/commit/04d443ba)
- [HttpClient: Validate cached authorization origins](https://github.com/Pagghiu/SaneCppLibraries/commit/3ba07c17)
- [HttpClient: Validate TLS CA paths](https://github.com/Pagghiu/SaneCppLibraries/commit/09a1b95a)
- [HttpClient: Clamp response header length](https://github.com/Pagghiu/SaneCppLibraries/commit/dc3bd1c5)
- [HttpClient: Enforce session cookie scope](https://github.com/Pagghiu/SaneCppLibraries/commit/dc84026a)
- [FileSystemWatcher: Handle zero-byte Windows change completions](https://github.com/Pagghiu/SaneCppLibraries/commit/e3288071)
- [SCExample: Make it more solid regarding plugin files modified in Visual Studio](https://github.com/Pagghiu/SaneCppLibraries/commit/f6a3d59c)
- [SCExample: Normalize examples path](https://github.com/Pagghiu/SaneCppLibraries/commit/3ae2378d)
- [Tools: Forward SC.sh to SC.bat on Windows bash](https://github.com/Pagghiu/SaneCppLibraries/commit/a5ea07c6)
- [Plugin: Route build products to PluginDefinition::directory](https://github.com/Pagghiu/SaneCppLibraries/commit/ff69ee94)
- [CI: Fix Visual Studio LLVM tool discovery](https://github.com/Pagghiu/SaneCppLibraries/commit/f44adda2)
- [Everywhere: Avoid integer conversion warning](https://github.com/Pagghiu/SaneCppLibraries/commit/8a38a0e)
- [SerializationBinary: Remove Assert provider](https://github.com/Pagghiu/SaneCppLibraries/commit/22620d5)
- [SingleFileLibs/Python: Exclude Common in LOC computation](https://github.com/Pagghiu/SaneCppLibraries/commit/aa665a5)

See you next month!
