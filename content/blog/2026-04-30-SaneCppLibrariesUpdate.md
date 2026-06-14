Title: 🌷 Sane C++ April 26
Date: 2026-04-30
Category: SaneCppLibraries
Image: 2026-04-30-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2026-04-30-SaneCppLibrariesUpdate
Summary: Welcome to the April 2026 update!<br> This month makes `SC::Build` much more practical as the default native workflow, a real cross-compilation tool, and an easier entry point for external projects.
TOC:    #section-0,April Updates
        #build-native-backend,Build Native Backend
        #cross-compilation,Cross-Compilation
        #runners-and-cross-runs,Runners and Cross-Runs
        #external-builds,External Builds
        #public-headers,Public Headers
        #build-ergonomics-and-ci,Build Ergonomics and CI
        #others,Others

# Build Native Backend

April has been almost entirely about `SC::Build`.
The biggest milestone is that the native generator is now the default on all supported host platforms, so the direct compile / run workflow is no longer some experimental side path.

This is where the project is becoming much more interesting to me, because the native backend is also where cross targets, foreign-binary execution and the nicer bootstrap story are all landing.
Generated backends are still useful, but at this point the standalone builder is clearly becoming the main workflow.

There is also now an experimental `Fil-C` target in the mix.
It is still very early, but I really like seeing `SC::Build` start to expose weirder compiler / toolchain combinations inside the same workflow.
I also posted a short note about it here:

<blockquote class="twitter-tweet">
<a href="https://x.com/pagghiu_/status/2047433895675617445"></a>
</blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

**Detailed list of commits:**

- [Build: Enable native generator by default on all platforms](https://github.com/Pagghiu/SaneCppLibraries/commit/5ab42c5a)
- [Build: Change default action to compile](https://github.com/Pagghiu/SaneCppLibraries/commit/1ac6567)
- [Build: Allow C++ 17 in SC-build.cpp configuration files](https://github.com/Pagghiu/SaneCppLibraries/commit/34f08c06)
- [Build: Add new experimental Fil-C target](https://github.com/Pagghiu/SaneCppLibraries/commit/3900d3cf)

# Cross-Compilation

The next big theme has been making cross-compilation feel like a real supported workflow instead of a bag of flags.
`SC::Build` now has friendly Linux and Windows target profiles, packaged sysroots, `llvm-mingw` support, and raw `--triple` / `--sysroot` escape hatches for when one wants to go off the beaten path.

This is not the flashiest work in the world, but it changes a lot in practice.
Once target profiles, sysroots and packaged toolchains are wired together properly, building for another platform starts feeling boring in the good way, instead of like a custom one-off setup.

**Detailed list of commits:**

- [Build: Add first-class Linux native target profiles](https://github.com/Pagghiu/SaneCppLibraries/commit/39930007)
- [Build: Package host LLVM for Linux target profiles](https://github.com/Pagghiu/SaneCppLibraries/commit/ad9c8e67)
- [Everywhere: Support building with musl on Linux](https://github.com/Pagghiu/SaneCppLibraries/commit/55f8a662)
- [Build: Add packaged Linux sysroots for macOS](https://github.com/Pagghiu/SaneCppLibraries/commit/a5176868)
- [Build: Add Linux sysroots and qemu runner support](https://github.com/Pagghiu/SaneCppLibraries/commit/3259d083)
- [Build: Add llvm-mingw cross-compile](https://github.com/Pagghiu/SaneCppLibraries/commit/255b6ab2)
- [Tools: Add llvm-mingw package](https://github.com/Pagghiu/SaneCppLibraries/commit/4492e658)
- [Build: Add windows-gnu-arm64 cross target](https://github.com/Pagghiu/SaneCppLibraries/commit/8ef53944)
- [Build: Add --triple and --sysroot](https://github.com/Pagghiu/SaneCppLibraries/commit/01e4daed)
- [Build: Add windows-msvc-x86_64 cross target](https://github.com/Pagghiu/SaneCppLibraries/commit/2cd32111)
- [Build: Add windows-msvc-arm64 cross target](https://github.com/Pagghiu/SaneCppLibraries/commit/1bc02040)

# Runners and Cross-Runs

Producing foreign binaries is only half the story.
This month also makes them much easier to execute, with much better Wine and QEMU integration across different host and target combinations.

There has been a lot of fiddly work here around Linux ARM64, portable MSVC packaging, auto-resolved wrappers and managed runner registration.
The nice result on the user side is that `build run` is increasingly able to do something sensible automatically even when the executable does not match the host platform, which is exactly what I wanted from this tool.

**Detailed list of commits:**

- [Build: Add Wine runner support for Windows GNU targets](https://github.com/Pagghiu/SaneCppLibraries/commit/07c3a544)
- [Build: Auto-resolve Linux box64 Wine wrappers](https://github.com/Pagghiu/SaneCppLibraries/commit/0dde6d98)
- [Build: Auto-wrap Linux arm64 Wine runners](https://github.com/Pagghiu/SaneCppLibraries/commit/83746e99)
- [Build: Add explicit portable MSVC package overrides](https://github.com/Pagghiu/SaneCppLibraries/commit/53243019)
- [Build: Validate portable MSVC import packaging](https://github.com/Pagghiu/SaneCppLibraries/commit/53f4e733)
- [Build: Repair legacy portable MSVC package layouts](https://github.com/Pagghiu/SaneCppLibraries/commit/b6484426)
- [Build: Reuse stored Wine path for portable MSVC](https://github.com/Pagghiu/SaneCppLibraries/commit/d0bcedc1)
- [Build: Repair Linux ARM64 portable MSVC Wine runners](https://github.com/Pagghiu/SaneCppLibraries/commit/b1da4896)
- [Build: Prefer plain Wine for Linux ARM64 console runs](https://github.com/Pagghiu/SaneCppLibraries/commit/298aa429)
- [Build: Support Linux ARM64 Wine runs for Windows arm64 targets](https://github.com/Pagghiu/SaneCppLibraries/commit/6248c7c7)
- [Build: Validate Windows GNU ARM64 runs on Linux](https://github.com/Pagghiu/SaneCppLibraries/commit/768e5ff0)
- [Build: Add managed QEMU runner registration for native cross-runs](https://github.com/Pagghiu/SaneCppLibraries/commit/54d68d67)

# External Builds

Another important change is that `SC::Build` is becoming easier to use outside of the main repository.
The new external launchers and bootstrap flow make it much simpler to point a standalone project at a Sane C++ checkout, or even use a shared cached checkout, without having to copy the repository workflow by hand.

This is especially useful for small external experiments and tests, because the build-definition file can stay tiny while still pulling in the Sane C++ libraries and the right public headers automatically.
The additions around shared helpers, defaults and `SC_BUILD` self-detection also make it easier for a single `SC-build.cpp` file to act both as build script and as project source when needed, which is a pretty nice trick for tiny examples.

For example, an external project can just `curl` the launcher, write a tiny `SC-build.cpp`, and compile immediately:



```cpp
#include "SaneCppBuild.h"

SC::Result SC::Build::configure(Definition& definition, const Parameters& parameters)
{
    Project project = {"MyProject"};
    SC_TRY(Build::addSaneCppLibraries(project, parameters));
    SC_TRY(project.addFile("main.cpp"));
    return definition.addProject(move(project));
}
```

```bash
curl -L -o SC-build.sh https://raw.githubusercontent.com/Pagghiu/SaneCppLibraries/main/SC-build.sh
chmod +x SC-build.sh
./SC-build.sh run
```

I like this a lot because it starts making `SC::Build` feel usable as a general standalone tool, not only as the thing used to build this repository itself.

**Detailed list of commits:**

- [Build: Add external SC-build launchers](https://github.com/Pagghiu/SaneCppLibraries/commit/06d1faea)
- [Build: Add shared addSaneCppLibraries helper](https://github.com/Pagghiu/SaneCppLibraries/commit/4caa2ae1)
- [Build: Add the SC_BUILD macro to self-detect being targeted by SC::Build](https://github.com/Pagghiu/SaneCppLibraries/commit/26d39729)
- [Build: Add defaults to simplify commonly set options](https://github.com/Pagghiu/SaneCppLibraries/commit/689ee2e6)

# Public Headers

The external-project story is also much better now because there are explicit public headers whose names match the single-file library variants.
This means external users can include headers such as `SaneCppStrings.h` or `SaneCppHttp.h` in a much more obvious way, while keeping the door open to switch between single-file and multi-file integration styles with much less friction.

I think this is a very nice change for usability.
If the public header names match the single-file library names, users do not need to care as much about how things are packaged internally, and moving between the two styles becomes much less annoying.

**Detailed list of commits:**

- [Everywhere: Add explicit external public include headers](https://github.com/Pagghiu/SaneCppLibraries/commit/70cce7a6)

# Build Ergonomics and CI

There has also been a steady stream of work on polishing the day-to-day experience around the builder and its CI coverage.
This includes better output handling, more flexible CLI parsing, self-tests for the build system itself, and a lot of cache work to keep workflows lighter and less repetitive.

These changes are less visible than target-profile support or cross-runners, but they are the sort of things that stop a build tool from feeling fragile.
Also, a lot of this month has been about making the CI less wasteful, because waiting on giant caches all the time is just boring.

**Detailed list of commits:**

- [Build: Add richer native build output handling](https://github.com/Pagghiu/SaneCppLibraries/commit/19689189)
- [Build: Support named options after target](https://github.com/Pagghiu/SaneCppLibraries/commit/6c6dc4dd)
- [Build: Do not update timestamp if file content is not changed](https://github.com/Pagghiu/SaneCppLibraries/commit/bb591bd4)
- [Build: Add SCBuildTest to the CI](https://github.com/Pagghiu/SaneCppLibraries/commit/70243865)
- [Build: Get rid of extra new lines in build test console output](https://github.com/Pagghiu/SaneCppLibraries/commit/1688c9fd)
- [Build: Share fixture package caches across runs](https://github.com/Pagghiu/SaneCppLibraries/commit/a450dd32)
- [Build: Preserve custom driver Linux target fixtures](https://github.com/Pagghiu/SaneCppLibraries/commit/bac8c53a)
- [Build: Split workflow package caches by package](https://github.com/Pagghiu/SaneCppLibraries/commit/6bb6e0f6)
- [Build: Shrink docs tool package caches](https://github.com/Pagghiu/SaneCppLibraries/commit/3aa91631)
- [Build: Merge docs package installs](https://github.com/Pagghiu/SaneCppLibraries/commit/66674a84)
- [Build: Shrink llvm-mingw workflow caches](https://github.com/Pagghiu/SaneCppLibraries/commit/736ba47f)
- [Build: Add Windows-host packaged Linux sysroots](https://github.com/Pagghiu/SaneCppLibraries/commit/2867773d)
- [Build: Warm Windows LLVM and sysroot caches](https://github.com/Pagghiu/SaneCppLibraries/commit/f931d74c)
- [Build: Warm shared Windows caches only once](https://github.com/Pagghiu/SaneCppLibraries/commit/487e334e)
- [Build: Skip Windows LLVM restores in debug jobs](https://github.com/Pagghiu/SaneCppLibraries/commit/867fc538)
- [Build: Restrict Windows cache skips to build matrix](https://github.com/Pagghiu/SaneCppLibraries/commit/39767201)
- [Build: Restore Posix llvm-mingw cache only in release](https://github.com/Pagghiu/SaneCppLibraries/commit/e12ddcd1)
- [Build: Shrink Windows LLVM workflow cache](https://github.com/Pagghiu/SaneCppLibraries/commit/d01fb685)
- [Build: Fix make run target selection for single-project workspaces](https://github.com/Pagghiu/SaneCppLibraries/commit/d0fe8747)
- [Build: Add repository root directory include only in tests](https://github.com/Pagghiu/SaneCppLibraries/commit/acdf493d)

# Others

Outside `SC::Build`, the month also includes a few useful portability and quality-of-life changes.
`Async` loop timeout tests got some stabilization work, runtime path resolution became more portable across build targets, MinGW compilation support improved, and `Strings` gained case-insensitive helpers.

This section is smaller than usual, but that is mostly because April has been totally dominated by build-system work.

**Detailed list of commits:**

- [CI: Try fixing packages caching](https://github.com/Pagghiu/SaneCppLibraries/commit/63c6c004)
- [Skills: Unify all skills into one designed for progressive discovery](https://github.com/Pagghiu/SaneCppLibraries/commit/d4bfa432)
- [Everywhere: Support compiling using MinGW](https://github.com/Pagghiu/SaneCppLibraries/commit/a973b1c8)
- [Async: Stabilize loop timeout test](https://github.com/Pagghiu/SaneCppLibraries/commit/66861b22)
- [Async: Handle EINTR on io_uring](https://github.com/Pagghiu/SaneCppLibraries/commit/321be035)
- [Everywhere: Make runtime path resolution portable across build targets](https://github.com/Pagghiu/SaneCppLibraries/commit/12d60568)
- [Async: Stabilizing loop timeout test](https://github.com/Pagghiu/SaneCppLibraries/commit/1ef4eef0)
- [Strings: Add case insensitive {startsWith | contains | equals}](https://github.com/Pagghiu/SaneCppLibraries/commit/c52cd5e1)

See you next month!
