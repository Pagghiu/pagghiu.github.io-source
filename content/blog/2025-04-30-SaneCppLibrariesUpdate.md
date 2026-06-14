Title: 💤 Sane C++ April 25
Date: 2025-04-30
Category: SaneCppLibraries
Image: 2025-04-30-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2025-04-30-SaneCppLibrariesUpdate
Summary: Welcome to the update post for April 2025!<br> This month has been mostly spent adding Process fork, Async vectorized writes and Memory Dump to Containers!
TOC:    #section-0,Sane C++ April 25
        #process,Process
        #foundation,Foundation
        #async,Async
        #tools,Tools
        #build,Build
        #repository-restructuring, Repository Restructuring
        #fixes,Fixes


# Process

<a href="https://pagghiu.github.io/SaneCppLibraries/library_process.html">`SC::Process`</a> library allows spawning process across all supported platforms with many features, including I/O redirection and setting environment variables / starting directories.
This month however it has been gaining a new class called `SC::ProcessFork` that uses `fork` on Posix and `RtlCloneUserProcess` a very well hidden NT Kernel API that we can consider to be some sort of Windows `fork`.

A fork duplicates a parent process execution state, os handles and private memory.

Its semantics are quite different from platform to platform but on its most common denominator it can be used to carry on "background" operations on snapshots of current program memory. One relevant use case is serializing to disk or network a live, complex and large data structure. Without the fork the program should either:

- Duplicate all the data, to snapshot it in a given instant, and keep it around for Async IO
- Block program execution and write the live data-structure until all IO is finished

Fork avoids memory duplication because it will be shared through Copy On Write (COW) mechanisms.  
COW ensures that un-modified duplicated memory pages will not occupy additional Physical RAM.

A pair of pipes makes it easy to do some coordination between parent and forked process.

This is not without caveats however for example:

1. Many API will just not work as expected on the forked process, especially on Windows
2. Limit API calls in forked process to console IO, network and file I/O (avoid GUI / Graphics)
3. All threads other than the current one will be suspended in child process (beware of deadlocks)
4. Create Sockets and FileDescriptors with Inheritable flags if you need them in fork process
5. Process deadlocks under Windows ARM64 / x86 emulation (use `Process::IsWindowsEmulatedProcess`)

So we're better using this feature only for very simple use cases, for example:

<a href="{attach}/images/2025-04-30-SaneCppLibrariesUpdate/ProcessFork.jpg" target="_blank">
<img src="{attach}/images/2025-04-30-SaneCppLibrariesUpdate/ProcessFork.jpg">
</a>

- [Process: Add ProcessFork](https://github.com/Pagghiu/SaneCppLibraries/commit/f4cb4a95)
- [Process: Add isWindowsEmulatedProcess to avoid using ProcessFork](https://github.com/Pagghiu/SaneCppLibraries/commit/a74f704a)

# Foundation

This month the custom allocator system gains a new ability.  
Anything `SC::Segment` based (`Vector` / `String` / `VectorMap` including their Inline variants) can be dumped and restored with a simple cast!  
This is very useful for serialization purposes, for network protocols or state persistence to the disk, assuming there's no need to validate the data and/or to version it.

If data can evolve in different "versions" with added and removed field, you should probably look at <a href="https://pagghiu.github.io/SaneCppLibraries/library_serialization_binary.html" target="_blank">`SC::SerializationBinary`</a>.

Once everything is routed through an allocator, this is not difficult to do, but some effort has been spent to make it simple and easy.  
Some <a href="https://x.com/pagghiu_/status/1908415906897670633" target="_blank">debate on X</a> has made it clear that this cannot be made fully UB safe under any existing C++ standard version so the usual caveats of "check what your compiler is doing" apply here.

<a href="{attach}/images/2025-04-30-SaneCppLibrariesUpdate/StructDump.jpg" target="_blank">
<img src="{attach}/images/2025-04-30-SaneCppLibrariesUpdate/StructDump.jpg">
</a>

- [Containers: Add Containers memory dump test](https://github.com/Pagghiu/SaneCppLibraries/commit/2019d984)
- [Containers: Allow declaring intrusive list in public headers without including its implementation](https://github.com/Pagghiu/SaneCppLibraries/commit/f0db7de8)
- [Containers: Move Vector with Virtual memory test to Containers](https://github.com/Pagghiu/SaneCppLibraries/commit/37205552)
- [Foundation: Add cxa_thread_atexit on Linux](https://github.com/Pagghiu/SaneCppLibraries/commit/bfacf568)
- [Foundation: Add start_lifetime_as to Span<T>](https://github.com/Pagghiu/SaneCppLibraries/commit/4073d791)
- [Foundation: Disable Segment owner check when creating temporaries](https://github.com/Pagghiu/SaneCppLibraries/commit/48dc8b1d)
- [Foundation: Remove useless const_cast from start_lifetime_as](https://github.com/Pagghiu/SaneCppLibraries/commit/62d814af)
- [Foundation: Rename reinterpret_as_span_of](https://github.com/Pagghiu/SaneCppLibraries/commit/270f42d0)
- [Foundation: Rename some methods in MemoryAllocator and VirtualMemory](https://github.com/Pagghiu/SaneCppLibraries/commit/a6862f6b)
- [Foundation: Use type U for all src parameters in Buffer operations](https://github.com/Pagghiu/SaneCppLibraries/commit/12f5503b)

# Async

<a href="https://pagghiu.github.io/SaneCppLibraries/library_async.html">`SC::Async`</a> library now supports vectorized writes.

This is the ability to atomically write multiple slices of memory with distinct start address and length.
It can be useful to reduce the number of _syscalls_ required to execute the writes and also allows avoiding intermediate buffers to compose them in the proper order.

- On posix this uses `writev` for both sockets and files.
- On Windows `WSASend` can handle sockets in the same way, but `WriteFile` must be called multiple times in sequence for files.

`SC::Async` unifies such platform differences providing a simpler experience for library users.

Some other changes also have been done, centralizing `AsyncRequest` start in `AsyncEventLoop` and unifying `AsyncTask` for all request types.
These changes have been made to prepare for a larger feature that will land next month (surprise!).


Unfortunately some fields have been renamed, soft-breaking the API, but it shouldn't take more than a search and replace for library users to fix the errors.
Also the Async API will change again during next weeks so maybe it's a good idea to resume updating next month.

<a href="{attach}/images/2025-04-30-SaneCppLibrariesUpdate/AsyncVectorizedWrites.png" target="_blank">
<img src="{attach}/images/2025-04-30-SaneCppLibrariesUpdate/AsyncVectorizedWrites.png">
</a>

- [Async: Allow using AsyncTask for every request type](https://github.com/Pagghiu/SaneCppLibraries/commit/f471af41)
- [Async: Centralize Async Request start in AsyncEventLoop::start](https://github.com/Pagghiu/SaneCppLibraries/commit/5dab6ecb)
- [Async: Define all classes directly inside namespace SC](https://github.com/Pagghiu/SaneCppLibraries/commit/627623db)
- [Async: Manually activate write requests with same handle on Posix](https://github.com/Pagghiu/SaneCppLibraries/commit/7b87154c)
- [Async: Remove useless [[nodiscard]] for SC::Result](https://github.com/Pagghiu/SaneCppLibraries/commit/8115b7f6)
- [Async: Rename AsyncFile{Read/Write/Close/Poll} fileDescriptor field to handle](https://github.com/Pagghiu/SaneCppLibraries/commit/2aee19b4)
- [Async: Support vectorized file write](https://github.com/Pagghiu/SaneCppLibraries/commit/b87449b2)
- [Async: Support vectorized socket send](https://github.com/Pagghiu/SaneCppLibraries/commit/b5acbf5b)
- [Async: Try writing to socket before activating write watcher on Posix](https://github.com/Pagghiu/SaneCppLibraries/commit/8ef0440f)
- [Async: Unify Posix file writes code path with socket writes](https://github.com/Pagghiu/SaneCppLibraries/commit/1eb28c7c)

# Tools

It's been a while since last refresh to <a href="https://pagghiu.github.io/SaneCppLibraries/page_tools.html">`SC::Tools`</a>!

`SC::Tools` are awesome, they just use Sane C++ Libraries to do the typical "scripting" that one would do in bash or python but with zero dependencies!

This month some dependencies have been updated, mainly `clang-format`, `doxygen` and `7zip`.  
Also the `SC::Package` tool that downloads / clones repos from inside `SC::Build` scripts is now using shallow cloning, bringing a noticeable speedup!

It's possible to now run `SC::Format` and build documentation and coverage on Linux instead of macOS only, so that the CI can just use any simple 
Linux VM instead of a more complex and less available macOS one.

`SC::Format` uses clang-19 so make sure to use it if you ever plan to send an MR to the project (but the CI will error out immediately anyway, so you will find out very quickly).

The doxygen update was long overdue but every version of doxygen was plagued with some bug breaking the documentation.
The `1.12.0` version seems to work better, but if you see anything wrong please open an issue on github.

<a href="{attach}/images/2025-04-30-SaneCppLibrariesUpdate/Doxygen_1_12_0.png" target="_blank">
<img src="{attach}/images/2025-04-30-SaneCppLibrariesUpdate/Doxygen_1_12_0.png">
</a>

- [Tools: Add more descriptive messages for when git is missing](https://github.com/Pagghiu/SaneCppLibraries/commit/5d066d29)
- [Tools: Enable running SC-Format on Linux](https://github.com/Pagghiu/SaneCppLibraries/commit/034cd91b)
- [Tools: Fallback to use wget on Linux if curl is not available](https://github.com/Pagghiu/SaneCppLibraries/commit/4f1e003c)
- [Tools: Support shallow cloning of git repos](https://github.com/Pagghiu/SaneCppLibraries/commit/c7c5fff1)
- [Tools: Update 7zr to 24.09](https://github.com/Pagghiu/SaneCppLibraries/commit/5410ccc7)
- [Tools: Update to clang-format 19](https://github.com/Pagghiu/SaneCppLibraries/commit/4dfefd4a)
- [SCExample: Shallow clone dear-imgui and sokol](https://github.com/Pagghiu/SaneCppLibraries/commit/835ae6d1)
- [CI: Install 7zip to monitor its validity](https://github.com/Pagghiu/SaneCppLibraries/commit/46b1cbad)
- [CI: Run clang-format and build documentation and coverage on linux](https://github.com/Pagghiu/SaneCppLibraries/commit/d6a3f78a)
- [Documentation: Update Doxygen to 1.12.0](https://github.com/Pagghiu/SaneCppLibraries/commit/ff0da851)

# Build

<a href="https://pagghiu.github.io/SaneCppLibraries/library_build.html">`SC::Build`</a> has gained per-file include paths variable expansion for Visual Studio Projects and coverage computation on Linux.
Some features like `nostdlib++` have been disabled on Linux because they need more love to properly support all combinations of it with the sanitizers.

- [Build: Do not use nostdlib++ on Linux](https://github.com/Pagghiu/SaneCppLibraries/commit/96d648c4)
- [Build: Expand per-file include paths on VS Projects](https://github.com/Pagghiu/SaneCppLibraries/commit/50a6dda3)
- [Build: Support coverage computation on Linux](https://github.com/Pagghiu/SaneCppLibraries/commit/e78489b3)

# Repository Restructuring

The repository has been restructured as well, with the `SC.cpp` unity build file moved to the root of the repo and all tests moved to a `Tests` subdirectory.
Also C bindings for the library now live together with the corresponding C++ library itself.
Hopefully this now makes more sense than before.

I know that this will break someone's build, but hey, it's a single file, it shouldn't take that much time to update its path in your build system.


<a href="{attach}/images/2025-04-30-SaneCppLibrariesUpdate/NewRepoStructure.png" target="_blank">
<img src="{attach}/images/2025-04-30-SaneCppLibrariesUpdate/NewRepoStructure.png">
</a>

- [Everywhere: Move all tests to the Tests subdirectory](https://github.com/Pagghiu/SaneCppLibraries/commit/0b4e8000)
- [Everywhere: Move hashing C Bindings inside the library itself](https://github.com/Pagghiu/SaneCppLibraries/commit/ea9d5da5)
- [Everywhere: Move the SC.cpp unity build file to root of the project](https://github.com/Pagghiu/SaneCppLibraries/commit/479e7fab)
- [Everywhere: Run clang-format 19 on the entire repo](https://github.com/Pagghiu/SaneCppLibraries/commit/bcb45eb8)

# Fixes

And just a single fix that doesn't fit in any of the previous bigger categories!

- [Strings: Fix reading from potentially unaligned memory](https://github.com/Pagghiu/SaneCppLibraries/commit/690cf89e)
