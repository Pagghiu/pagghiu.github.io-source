Title: 2️⃣ Years of Sane C++ Libraries
Date: 2025-12-23
Modified: 2025-12-23
Category: C++
Tags: c++, sane, libraries, update, anniversary
Image: 2025-12-23-SaneCpp2Year/article.svg
Slug: site/blog/2025-12-23-SaneCpp2Year
Summary: A look back at the second year of the Sane C++ Libraries project, highlighting a massive dependency cleanup, the "No Allocations" guarantee, single-file libraries, and much more.

Another year has passed, and it's time to celebrate the second anniversary of Sane C++ Libraries
[https://github.com/pagghiu/SaneCppLibraries](https://github.com/pagghiu/SaneCppLibraries)!  
The journey continues toward the goal of providing simple, modern, and dependency-free C++ platform abstraction libraries for macOS, Windows, and Linux.

The core principles remain the same:

✅ Fast compile times  
✅ Bloat free  
✅ Simple and readable code  
✅ Easy to integrate  
⛔️ No C++ Standard Library / Exceptions / RTTI  
⛔️ No third party build dependencies (prefer OS API)  

This second year was defined by a relentless focus on architectural purity, developer experience, and delivering on the project's core promises in a tangible way.

## The Great Cleanup
<p class="chapter">The "No Allocations" Guarantee</p>

The single most important achievement of this year was a massive dependency cleanup that culminated in making them single-file libraries with clean dependencies.

Isn't this final clean internal dependency graph super cool? 😎

<a href="{attach}/images/2025-12-23-SaneCpp2year/2025-12-23-SaneCpp2Year-Dependencies.svg" target="_blank">
<img src="{attach}/images/2025-12-23-SaneCpp2year/2025-12-23-SaneCpp2Year-Dependencies.svg">
</a>

A powerful guarantee for most of the libraries has been gained too:  
**No dynamic memory allocations.**

As the official `README.md` now states:

> - All libraries do not dynamically allocate memory (excluding `Memory` and `Containers`)
> - All libraries are designed to work inside user-provided memory buffers.
> - All libraries return error codes when running out of such memory buffers.
> - Third-party container classes, including `std::` ones, are supported (see `InteropSTL` for an example).
> - `Memory` and `Containers` are fully optional and just provided for convenience.

This was a multi-month effort that involved:

- **Splitting the `Memory` library ([June]({filename}2025-06-30-SaneCppLibrariesUpdate.md)):**  
All components responsible for dynamic allocation (`Segment`, `Buffer`, `VirtualMemory`) were moved from `Foundation` into their own dedicated library.  
This created a clear architectural boundary.
- **Aggressive Refactoring ([July]({filename}2025-07-31-SaneCppLibrariesUpdate.md)-[October]({filename}2025-10-31-SaneCppLibrariesUpdate.md)):**  
Guided by a new [automated dependency tracking system](https://pagghiu.github.io/SaneCppLibraries/page_dependencies.html), libraries like `File`, `Socket`, `Process`, `FileSystem`, and `FileSystemWatcher` were refactored to remove all dependencies on `Memory` or `Strings`.
- **"Bring Your Own Containers" ([October]({filename}2025-10-31-SaneCppLibrariesUpdate.md)):**  
To prove this wasn't about locking users in, the `InteropSTL` example was created to show how easily `std::string` and `std::vector` can be used with the libraries, thanks to the lightweight `IGrowableBuffer` interface.

Now, if you use a library that doesn't depend on `Memory` (directly or indirectly), you have a compile-time guarantee that it performs no heap allocations.  


## The Year in Review
<p class="chapter">A Look Back at The Updates </p>

Beyond the architectural overhaul, the year was packed with new features and improvements.

### 🟨 Async Evolution
<p class="chapter">Async all the things</p>

The async ecosystem has been refined consistently throughout the year:

- **`AsyncStreams` ([December]({filename}2024-12-31-SaneCppLibrariesUpdate.md)):**  
Gained transform streams, demonstrated with an async ZLib compression stream.  
It was later promoted to **MVP** status (August).
- **`Async` Core ([January]({filename}2025-01-31-SaneCppLibrariesUpdate.md)):**  
The core event loop was refined with a large number of bug fixes and improvements, timers were improved, and the `SC::Function` object was optimized to save memory.  Significant effort has been spent trying to unify cancellation behaviors of the wildly different OS APIs.
- **`AsyncSequence` ([May]({filename}2025-05-31-SaneCppLibrariesUpdate.md)):**  
A major quality-of-life improvement, allowing for easy chaining of async operations without complex callback nesting.
- **`AsyncFileSystemOperation` ([June]({filename}2025-06-30-SaneCppLibrariesUpdate.md)):**  
A powerful new feature unifying a huge range of async file system operations (`copy`, `rename`, `remove`, etc.) under a single cross-platform API.
- **UDP Support ([June]({filename}2025-06-30-SaneCppLibrariesUpdate.md)):**  
Added `sendTo` and `receiveFrom` for unconnected UDP sockets.
- **Http Async Evolution ([November]({filename}2025-11-30-SaneCppLibrariesUpdate.md)):**  
Work on overhauling the `Http` library drove improvements in `AsyncStreams`, making it more flexible to handle externally managed buffers.

<a href="{attach}/images/2025-05-31-SaneCppLibrariesUpdate/SCAsyncSequence.png" target="_blank">
<img src="{attach}/images/2025-05-31-SaneCppLibrariesUpdate/SCAsyncSequence.png">
</a>

### 🧠 Memory Management Revolution ([February]({filename}2025-02-28-SaneCppLibrariesUpdate.md)-[March]({filename}2025-03-31-SaneCppLibrariesUpdate.md))
<p class="chapter">Do not allocate as if your life depends on it!</p>

The foundation for the "No Allocations" guarantee was laid early in the year.

- **`Containers` Rewrite ([February]({filename}2025-02-28-SaneCppLibrariesUpdate.md)):** The `Containers` library was rewritten, and the crucial `Buffer` and `SmallBuffer` types were born in `Foundation`, and later on isolated inside the `Memory` library.
- **Advanced Memory Management ([March]({filename}2025-03-31-SaneCppLibrariesUpdate.md)):**  
A number of useful features were added:
    - **Custom Allocators:**  
    A global, scoped, non-template-based allocator system for strategies like arena allocation.
    - **Relative Pointers:**  
    To enable fast, memcpy-able serialization of complex data structures (if you can accept a little bit of un-avoidable UB...).
    - **Virtual Memory:**  
    `VirtualAllocator` allows reserving large chunks of virtual address space to avoid reallocations.

<a href="{attach}/images/2025-03-31-SaneCppLibrariesUpdate/CustomVirtualAllocator.png" target="_blank">
<img src="{attach}/images/2025-03-31-SaneCppLibrariesUpdate/CustomVirtualAllocator.png">
</a>

<a href="{attach}/images/2025-04-30-SaneCppLibrariesUpdate/StructDump.jpg" target="_blank">
<img src="{attach}/images/2025-04-30-SaneCppLibrariesUpdate/StructDump.jpg">
</a>

### 🛠️ Tooling and Developer Experience

A major theme this year was making the libraries easier to use and develop.

- **Single-File Libraries ([August]({filename}2025-08-31-SaneCppLibrariesUpdate.md)):**  
A huge usability win! All libraries can now be amalgamated into single header files.  
A [browser-based tool](https://pagghiu.github.io/SaneCppLibraries/page_single_file_libs.html) makes it incredibly easy to generate them.
- **GDB Pretty Printer ([September]({filename}2025-09-30-SaneCppLibrariesUpdate.md)):**  
With `LLDB` and `MSVC` visualizers already present, the addition of a `GDB` pretty printer completed the set, providing a first-class debugging experience for the project's custom containers.
- **Automated Dependency Checking ([September]({filename}2025-09-30-SaneCppLibrariesUpdate.md)):**  
The CI now automatically verifies that new code doesn't introduce unwanted dependencies, enforcing architectural hygiene.
- **Self-Hosting Bootstrap ([October]({filename}2025-10-31-SaneCppLibrariesUpdate.md)):**  
The build tool system (`SC::Tools`) threw away its dependency on `make`/`nmake` and now bootstraps itself with a minimal, dependency-free C++ program (which was later ported to C for even faster startup!).

<a href="https://pagghiu.github.io/SaneCppLibraries/single_file_libs.html" target="_blank">
<img src="{attach}/images/2025-08-31-SaneCppLibrariesUpdate/SCAmalgamationGenerator.jpg">
</a>

## Community, Content & Growth

The project is still a solo development effort for the most part, but this year saw a few contributions!  
A special thank you to **[Francesco "cozis" Cozzuto](http://coz.is)** for his useful contributions and bug reports.

Growth on GitHub has been slow and steady.  
While there's no exponential explosion in stars, the project continues to find its audience, making me happy 😃.

<a href="https://star-history.com/#Pagghiu/SaneCppLibraries&Date" target="_blank">
  <img src="https://api.star-history.com/svg?repos=Pagghiu/SaneCppLibraries&type=Date" alt="Star History Chart">
</a>

In terms of content, my focus this year shifted heavily from producing YouTube videos to implementing the architectural changes described above. I may come back to making videos at some point, once I'm more satisfied with the status of the libraries, but the priority for now remains on the code.

## Looking Ahead to Year Three

With the architecture in a much cleaner state, the plan for the third year is to build on this solid foundation.

- **Mature Existing Libraries:** The main objective is to bring more libraries from `Draft` and `MVP` states to `Usable`.  
The top priority is the `Http` library, whose overhaul has already begun.
- **No New Libraries (Probably!):** I will try *not* to add any new libraries. The focus will be on hardening and perfecting the existing ones.
- **Examples and Documentation:** With the APIs stabilizing, improving documentation and adding more real-world examples will be more important than ever.

It's been a marathon of a year focused on deep, foundational work.  
Thank you to everyone who has followed along, starred the repository, or used the libraries. 

The journey is far from over!

See you soon! 🎊👋🏼
