Title: 🌊 Sane C++ August 25
Date: 2025-08-31
Category: SaneCppLibraries
Image: 2025-08-31-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2025-08-31-SaneCppLibrariesUpdate
Summary: Welcome to the update post for August 2025!<br> This month we finally have Single File Libs!!!
TOC:    #section-0,August Updates
        #single-file-libraries,Single File Libraries
        #threading,Threading
        #async,Async
        #asyncstreams,AsyncStreams
        #algorithms,Algorithms
        #process,Process
        #strings,Strings
        #build,Build
        #file,File
        #other-improvements,Other Improvements

# Single File Libraries

One of the core principles of this project is to be "Easy to Integrate".  
I'm always looking for ways to lower the barrier to entry for using these libraries in your own projects.

To that end, I'm happy to announce that all Sane Cpp Libraries are now available as **single-file libraries**!

This means you can now get the power of a library like `SC::Async` or `SC::Process` by simply dropping a single `.h` file into your project.  
No complex build system integration, no scripts to run—just include the header and build the source file. It's that simple.

There are two amalgamator tools written in Python and Javascript, that you can use to generate the single file libs locally on a checked out copy of the repo.
Alternatively you can use the browser-based JavaScript amalgamator available at [single_file_libs.html](https://pagghiu.github.io/SaneCppLibraries/single_file_libs.html).

<a href="https://pagghiu.github.io/SaneCppLibraries/single_file_libs.html" target="_blank">
<img src="{attach}/images/2025-08-31-SaneCppLibrariesUpdate/SCAmalgamationGenerator.jpg">
</a>

<a href="https://pagghiu.github.io/SaneCppLibraries/single_file_libs.html" target="_blank">
<img src="{attach}/images/2025-08-31-SaneCppLibrariesUpdate/SCAmalgamationExample.jpg">
</a>

**Detailed list of commits:**

- [SingleFileLibs/Javascript: Add javascript single file libs amalgamator (in-browser + cli)](https://github.com/Pagghiu/SaneCppLibraries/commit/0a0a269a)
- [SingleFileLibs/Python: Add python single file libs amalgamator](https://github.com/Pagghiu/SaneCppLibraries/commit/8ddb8370)
- [SingleFileLibs/Python: Print total lines of code at the end of library tables](https://github.com/Pagghiu/SaneCppLibraries/commit/304be752)

# Threading

The `Threading` library received some love this month and has now been promoted to **Usable** status!

Here are some of the key additions:

- **`SC::Semaphore`**: A classic semaphore for controlling access to a resource.
- **`SC::Barrier`**: A synchronization primitive that allows a set of threads to wait for each other to reach a certain point before continuing.
- **`SC::RWLock`**: A reader-writer lock that allows concurrent access for read-only operations, but exclusive access for write operations.
- **`Atomic<T>` improvements**: The atomic types have been improved with more operations and better memory ordering support for MSVC.

I also fixed a tricky "lost wake-up" bug in `EventObject`'s condition variable signaling, which improves the robustness of thread synchronization.

**Detailed list of commits:**

- [Threading: Add Barrier](https://github.com/Pagghiu/SaneCppLibraries/commit/0f14d189)
- [Threading: Add RWLock](https://github.com/Pagghiu/SaneCppLibraries/commit/29f4107c)
- [Threading: Add Semaphore](https://github.com/Pagghiu/SaneCppLibraries/commit/4d2a9fb2)
- [Threading: Improve Atomic<bool> and Atomic<int32_t>](https://github.com/Pagghiu/SaneCppLibraries/commit/9e8de5b5)
- [Threading: Prevent EventObject lost wake-up and fix Mutex destructor](https://github.com/Pagghiu/SaneCppLibraries/commit/20c6700c)
- [Threading: Promote Threading to Usable](https://github.com/Pagghiu/SaneCppLibraries/commit/ef558303)

# Async

The `Async` library received several important fixes, particularly for the `io_uring` backend on Linux and the IOCP backend on Windows.  
These changes improve the reliability and prevent potential hangs or asserts when dealing with asynchronous file and pipe operations.

**Detailed list of commits:**

- [Async: Allow re-using AsyncProcessExit on Linux under io_uring](https://github.com/Pagghiu/SaneCppLibraries/commit/53b90663)
- [Async: Do not expect IOCP cancellation packet if AsyncFilePoll handle is already closed](https://github.com/Pagghiu/SaneCppLibraries/commit/6882e371)
- [Async: Do not process AsyncFilePoll cancellations on io_uring backend](https://github.com/Pagghiu/SaneCppLibraries/commit/55651c5e)
- [Async: Handle file descriptor read or write succeeding synchronously on Windows](https://github.com/Pagghiu/SaneCppLibraries/commit/0a62eae8)
- [Async: Re-organize files for more effective unity build](https://github.com/Pagghiu/SaneCppLibraries/commit/815c2102)
- [Async: Support async pipe non-blocking reads](https://github.com/Pagghiu/SaneCppLibraries/commit/60118293)
- [Async: Test synchronous pipe reads from ThreadPool](https://github.com/Pagghiu/SaneCppLibraries/commit/2ca79bb6)

# AsyncStreams

`AsyncStreams` has been promoted to **MVP** (Minimum Viable Product), meaning its core feature set is in place for concurrently reading, writing, and transforming byte streams.  

**Detailed list of commits:**

- [AsyncStreams: Add async request test variation for blocking and non-blocking pipes](https://github.com/Pagghiu/SaneCppLibraries/commit/a37078a3)
- [AsyncStreams: Process leftover input bytes before finalizing zlib stream](https://github.com/Pagghiu/SaneCppLibraries/commit/e1b307b9)
- [AsyncStreams: Promote AsyncStreams to MVP](https://github.com/Pagghiu/SaneCppLibraries/commit/1d0e047e)

# Algorithms

The Algorithms library has been removed, or to be more precise it has been merged to Containers.
The reason is pretty simple, I am not a great fan of using std-like algorithms aside from very simple usages.
I find that any non-trivial usage of std C++ `<algorithm>` make code more difficult to read and reason about.  
For this reason Sane C++ `Algorithms` library was only bringing 3 functions (`removeIf`, `sort` and `find`) so it made really little sense.  
If you need std-like algorithms, just include `<algorithm>` or add some other library providing them to your project.

**Detailed list of commits:**

- [Algorithms: Revoke its standalone library status moving it to Containers](https://github.com/Pagghiu/SaneCppLibraries/commit/76158a1b)

# Process

Process library has been improved with arguments quoting on Windows.
There's now better support for redirecting standard I/O and better support for ipc pipes in general, that has also involved the File library.

**Detailed list of commits:**

- [Process: Automatically set child process standard IO inherit flags](https://github.com/Pagghiu/SaneCppLibraries/commit/2660f3d7)
- [Process: Check the correct variable before assigning environmentMemory](https://github.com/Pagghiu/SaneCppLibraries/commit/3b802fbb)
- [Process: Increment environment storage to 16K chars](https://github.com/Pagghiu/SaneCppLibraries/commit/1d146ea0)
- [Process: Quote arguments on Windows with any UTF encoding](https://github.com/Pagghiu/SaneCppLibraries/commit/03199676)
- [Process: Validate external pipes used to redirect child process IO](https://github.com/Pagghiu/SaneCppLibraries/commit/e154dafa)

# Strings

The `Path` and `StringBuilder` classes now have better support for to handle UTF8 and UTF16 encodings.  
Throughout the libraries the philosophy is to keep strings in whatever encoding they've been given.
Strings are lazy converted only when required by some OS API and in some cases this could lead to hitting asserts due to unsupported encodings.

**Detailed list of commits:**

- [Strings: Check for null iterator before calling memchr](https://github.com/Pagghiu/SaneCppLibraries/commit/6507b49e)
- [Strings: Remove StringView::slice methods using bytes](https://github.com/Pagghiu/SaneCppLibraries/commit/6cdb0436)
- [Strings: Support mixed encodings in Path](https://github.com/Pagghiu/SaneCppLibraries/commit/a6ab717e)
- [Strings: Support mixed encodings in StringBuilder::appendReplaceAll](https://github.com/Pagghiu/SaneCppLibraries/commit/2ad27c99)
- [Strings: Support mixed encodings in StringView::split{Before | After}](https://github.com/Pagghiu/SaneCppLibraries/commit/bd272a53)

# Build

The self-hosted C++ build system can now generate workspace files that group multiple projects.
This has been done to support testing compilation of the Single File Libs in the CI, but it can be useful in general.

If absolute paths are used when adding files to a project, they will be automatically made relative to the project root directory.

Some better checking in makefile generation has been added, to avoid trying to build non-existing configurations.

**Detailed list of commits:**

- [Build: Automatically compute relative paths when required for files](https://github.com/Pagghiu/SaneCppLibraries/commit/655ca98c)
- [Build: Generate workspace files grouping multiple projects](https://github.com/Pagghiu/SaneCppLibraries/commit/71182e79)
- [Build: Print error when an unsupported configuration is requested](https://github.com/Pagghiu/SaneCppLibraries/commit/d9e09efd)

# File

The file library gains methods to open stdin / stderr and stdout cross-platform.  
Also the API for Pipe has been changed to make sure properly setting inheritable and blocking flags during creation, as in some platforms (Windows) some of these behaviors cannot be changed later (mainly setting OVERLAPPED_IO flags).

**Detailed list of commits:**

- [File: Add methods to open stdin / stderr / stdout](https://github.com/Pagghiu/SaneCppLibraries/commit/e7ff8fb5)
- [File: Enforce setting inheritable and blocking flags during pipe creation](https://github.com/Pagghiu/SaneCppLibraries/commit/43bb44e5)

# Other Improvements

Beyond these major updates, August included a bunch of other fixes:

- **CI**: The continuous integration pipeline now automatically generates and builds the single-file libraries to ensure they are always up-to-date and working correctly.
- **Dependencies**: The LOC update is handled by the Python amalgamator script and the dependency .json generator is a separate script
- **Everywhere**: Fix some warnings under clang-cl and ASAN warning about using out of scope stack memory for FileSystemIterator
- **Tools**: Generate PDBs on windows so that tools can be debugged

**Detailed list of commits:**

- [CI: Add single file libs generation and build](https://github.com/Pagghiu/SaneCppLibraries/commit/80f11581)
- [CI: Always apt-get update before apt-get install](https://github.com/Pagghiu/SaneCppLibraries/commit/a9deffea)
- [Dependencies: Add script to just update library dependencies](https://github.com/Pagghiu/SaneCppLibraries/commit/1a9662f9)
- [Documentation: Update LOC for all libraries](https://github.com/Pagghiu/SaneCppLibraries/commit/d2c2af71)
- [Everywhere: Declare FileSystemIterator::FolderState before FileSystemIterator](https://github.com/Pagghiu/SaneCppLibraries/commit/c1f74b45)
- [Everywhere: Fix clang-cl warnings and unity build issues](https://github.com/Pagghiu/SaneCppLibraries/commit/d0c3b8c6)
- [Everywhere: Remove nodiscard when used with Result](https://github.com/Pagghiu/SaneCppLibraries/commit/8147fe99)
- [FileSystem: Fix conversion of precise error messages](https://github.com/Pagghiu/SaneCppLibraries/commit/e80abd40)
- [Plugin: Propagate host executable sanitization flags](https://github.com/Pagghiu/SaneCppLibraries/commit/5c52cc56)
- [Testing: Enforce TestReport not printing anything under quiet mode](https://github.com/Pagghiu/SaneCppLibraries/commit/d412fd19)
- [Tools: Generate PDB when building tools on Windows](https://github.com/Pagghiu/SaneCppLibraries/commit/cd429f4d)
- [Tools: Run SC-format with default event loop backend](https://github.com/Pagghiu/SaneCppLibraries/commit/749742c5)
- [Tools: Update 7zr to 25.01](https://github.com/Pagghiu/SaneCppLibraries/commit/70b2d740)