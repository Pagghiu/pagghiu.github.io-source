Title: 🍂 Sane C++ September 25
Date: 2025-09-30
Category: SaneCppLibraries
Image: 2025-09-30-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2025-09-30-SaneCppLibrariesUpdate
Summary: Welcome to the September 2025 update!<br> The main focus this month has been on breaking internal dependencies to enhance modularity.
TOC:    #section-0,September Updates
        #reducing-internal-dependencies,Reducing Internal Dependencies
        #dependencies-support,Dependencies Support
        #dependencies-tooling,Dependencies Tooling
        #build,Build
        #gdb-pretty-printer,GDB Pretty Printer
        #contributions,Contributions
        #http,Http
        #miscellaneous,Miscellaneous

# Reducing Internal Dependencies

The majority of the work this month focused on breaking **internal** dependencies between libraries.

The goal is for Sane C++ Libraries to be a collection of libraries that *work well together*, rather than a monolithic *framework*. Users should be able to use a single library in isolation without being forced to adopt the entire ecosystem.

Sane C++ Libraries is not a project that forces itself to be the central heart of your software project (even if it would probably be a good idea! 😎).

Balancing library isolation with the ergonomics of using multiple libraries together is challenging, but significant progress has been made.

Here is the resulting graph of all internal dependencies between libraries:

<a href="https://pagghiu.github.io/SaneCppLibraries/page_dependencies.html" target="_blank">
<img src="{attach}/images/2025-09-30-SaneCppLibrariesUpdate/2025-09-Dependencies.svg">
</a>

Key takeaways:

- Only libraries that depend on `Memory` require dynamic memory allocation (currently `Containers` and `Http`).
- The entire lower row of libraries are essentially standalone, depending only on `Foundation`.
- `Foundation` is a minimal collection of headers designed to avoid using the Standard C++ Library and including compiler-supplied headers in the public interface.

In many cases, all you need to get started is the `Foundation` single-file library plus any other library from the lower row!

**Detailed list of commits:**

- [ContainersSerialization: Remove Serialization dependency on Containers](https://github.com/Pagghiu/SaneCppLibraries/commit/3b2bc612)
- [FileSystem: Remove FileSystem dependency on File](https://github.com/Pagghiu/SaneCppLibraries/commit/9a3c5dc9)
- [FileSystem: Remove FileSystem dependency on Time](https://github.com/Pagghiu/SaneCppLibraries/commit/1f2ff68e)
- [Plugin: Remove Plugin dependency on Containers](https://github.com/Pagghiu/SaneCppLibraries/commit/03852af7)
- [Plugin: Remove Plugin dependency on Memory](https://github.com/Pagghiu/SaneCppLibraries/commit/f476ab91)
- [Plugin: Remove Plugin dependency on Threading](https://github.com/Pagghiu/SaneCppLibraries/commit/1b1f20d7)
- [SerializationText: Remove SerializationText dependency on Memory](https://github.com/Pagghiu/SaneCppLibraries/commit/83281e6d)
- [Strings: Move String and SmallString to Memory](https://github.com/Pagghiu/SaneCppLibraries/commit/43b772ea)
- [Strings: Remove Path dependency on String](https://github.com/Pagghiu/SaneCppLibraries/commit/327bb8e3)
- [Strings: Remove StringBuilder dependency on Buffer and require finalize (breaking change)](https://github.com/Pagghiu/SaneCppLibraries/commit/02bd0f2d)
- [Strings: Remove StringBuilder dependency on String](https://github.com/Pagghiu/SaneCppLibraries/commit/636d54bb)
- [Strings: Remove StringFormat dependency on Buffer and String](https://github.com/Pagghiu/SaneCppLibraries/commit/9e36c556)
- [Testing: Remove Testing dependency on Memory](https://github.com/Pagghiu/SaneCppLibraries/commit/4752f1ef)
- [Testing: Remove Testing dependency on Strings](https://github.com/Pagghiu/SaneCppLibraries/commit/0ec0f808)

# Dependencies Support

To achieve the goal of reducing internal dependencies, it was necessary to break many internal sub-dependencies.

The most challenging task was moving `String` and `SmallString` from the `Strings` library to the `Memory` library.

Most `String` usages were related to file and path manipulation, which is now handled by the fixed-size and native-encoding-aware `StringPath`.

While this may seem counter-intuitive, it makes perfect sense. The `Strings` library should focus on string manipulation, and `std::string`-like classes don't belong there as they require allocator support.

In the future, alternatives to `std::string`-like allocation will be provided. For now, anyone needing it can use `String` and the `Global` allocator support from `Memory`.

This change caused a large refactoring across the entire project, which may have introduced some bugs (mainly due to re-working null-termination).

The most significant *breaking change* is the new requirement to call `StringBuilder::finalize` to ensure the underlying string container or buffer is null-terminated.

Please report any misbehavior or bugs you may find.

**Detailed list of commits:**

- [Foundation: De-virtualize IGrowableBuffer::getDirectAccess](https://github.com/Pagghiu/SaneCppLibraries/commit/2cd13385)
- [Foundation: Export IGrowableBuffer and derived classes](https://github.com/Pagghiu/SaneCppLibraries/commit/d6055f9e)
- [Foundation: Implement GrowableBuffer<StringPath>](https://github.com/Pagghiu/SaneCppLibraries/commit/883e7cfb)
- [Foundation: Move StringView::compare to StringSpan](https://github.com/Pagghiu/SaneCppLibraries/commit/27f48bcd)
- [Memory: Avoid losing data when tryGrowTo causes reallocation](https://github.com/Pagghiu/SaneCppLibraries/commit/c9c7aab1)
- [Memory: Make GrowableBuffer<Buffer> final](https://github.com/Pagghiu/SaneCppLibraries/commit/0d9d0870)
- [Plugin: Null terminate error messages when compiling or linking](https://github.com/Pagghiu/SaneCppLibraries/commit/0caf50ed)
- [SerializationText: Default specialization handles non-struct type](https://github.com/Pagghiu/SaneCppLibraries/commit/beabd54b)
- [SerializationText: Use StringSpan in SerializationText](https://github.com/Pagghiu/SaneCppLibraries/commit/f23e76eb)
- [Strings: Allow custom encoding in construction of StringView from iterators](https://github.com/Pagghiu/SaneCppLibraries/commit/88b415f0)
- [Strings: Avoid allocation in Path::normalize when preserving UNC prefix](https://github.com/Pagghiu/SaneCppLibraries/commit/6ae66418)
- [Strings: Avoid reading past end pointers during UTF decoding](https://github.com/Pagghiu/SaneCppLibraries/commit/c308279f)
- [Strings: Do not append null-terminator in StringBuilder / StringFormat](https://github.com/Pagghiu/SaneCppLibraries/commit/afcb4182)
- [Strings: Get rid of dynamic memory allocations from Console](https://github.com/Pagghiu/SaneCppLibraries/commit/81c182b3)
- [Strings: Make Console conversion buffer optional](https://github.com/Pagghiu/SaneCppLibraries/commit/25194d8b)
- [Strings: Make GrowableBuffer<String> final](https://github.com/Pagghiu/SaneCppLibraries/commit/ae04fbea)
- [Strings: Make output the first parameter of Path::relativeFromTo](https://github.com/Pagghiu/SaneCppLibraries/commit/dd4374c4)
- [Strings: Make StringPath::path private](https://github.com/Pagghiu/SaneCppLibraries/commit/a0e22c32)
- [Strings: Move null-termination helpers from StringConverter to String and StringBuilder](https://github.com/Pagghiu/SaneCppLibraries/commit/cc996056)
- [Strings: Remove unused member functions from StringConverter](https://github.com/Pagghiu/SaneCppLibraries/commit/ac78c533)
- [Strings: Simplify StringConverter API and break dependency from Buffer](https://github.com/Pagghiu/SaneCppLibraries/commit/f1e23351)
- [Strings: Use StringSpan instead of StringView for StringFormat specifiers](https://github.com/Pagghiu/SaneCppLibraries/commit/3ef05efc)
- [Testing: Use StringPath for library root / application root / executable paths](https://github.com/Pagghiu/SaneCppLibraries/commit/2a8b5a6b)


# Dependencies Tooling

Internal dependencies are now automatically computed with a Python script that also generates SVGs for documentation and a small interactive visualization.

The interactive visualization can highlight the required downstream dependencies for a given set of libraries.

<a href="https://pagghiu.github.io/SaneCppLibraries/page_dependencies.html" target="_blank">
<img src="{attach}/images/2025-09-30-SaneCppLibrariesUpdate/2025-09-DependenciesInteractive.png">
</a>

This is useful because it's now entirely automatic, ensuring the documentation is always in sync with the current state of internal dependencies.

Finally, the CI will fail if a PR introduces a dependency that doesn't adhere to proper dependency hygiene!

**Detailed list of commits:**

- [Dependencies: Compute minimal dependencies for each library](https://github.com/Pagghiu/SaneCppLibraries/commit/3352d8f9)
- [Dependencies: Generate a dependencies graph .dot file](https://github.com/Pagghiu/SaneCppLibraries/commit/64f3bb3e)
- [Dependencies: Generate Dependencies SVG for each library](https://github.com/Pagghiu/SaneCppLibraries/commit/60e48c42)
- [Dependencies: Generate the interactive dependencies graph](https://github.com/Pagghiu/SaneCppLibraries/commit/15654f55)
- [Dependencies: Automatically check for accidental dependencies addition](https://github.com/Pagghiu/SaneCppLibraries/commit/29bf55f4)

# Build

The `SC::Build` build generator has been transitioned into an application rather than a library.

The main driver for this change is its significant number of internal dependencies, which makes little sense to reuse as a library.

A few fixes have also been made.

**Detailed list of commits:**

- [Build: Make Build just a tool rather than a library](https://github.com/Pagghiu/SaneCppLibraries/commit/b079772c)
- [Build: Fix incorrect generation of Xcode project](https://github.com/Pagghiu/SaneCppLibraries/commit/1cc5c5af)
- [Build: Only define rules relevant to requested targets in Makefiles](https://github.com/Pagghiu/SaneCppLibraries/commit/909090f1)

# GDB Pretty Printer

A pretty printer is an extension for a debugger that displays data structures in a more human-readable format. For example, it can decode a string with the proper UTF encoding or show the elements of a container rather than its raw implementation details. This is very useful when debugging and is often taken for granted when using the C++ standard library.

<a href="https://x.com/pagghiu_/status/1964226245010350512" target="_blank">
<img src="{attach}/images/2025-09-30-SaneCppLibrariesUpdate/2025-09-GDBPrettyPrinter.png">
</a>

For a project that doesn't use the Standard Library, creating pretty printers for its users is almost a necessity.

The project already had `LLDB` and `MSVC` pretty printers (debug visualizers), with `GDB` being the only one missing. A new GDB debug visualizer has been added, so be sure to give it a try if `GDB` is your debugger of choice!

**Detailed list of commits:**

- [DebugVisualizer: Add a GDB debug visualizer](https://github.com/Pagghiu/SaneCppLibraries/commit/d7de5f12)

# Contributions

This month, the project received some really useful contributions from [Francesco Cozzuto](http://coz.is) (cozis)!

This was also an opportunity to fix some issues in the CI for contributors that were not properly set up.

**Detailed list of commits:**

- [Async: Use epoll_pwait instead of epoll_pwait2](https://github.com/Pagghiu/SaneCppLibraries/commit/57cc066e)
- [Build: Add "DebugValgrind" build for SCTest](https://github.com/Pagghiu/SaneCppLibraries/commit/b2515366)
- [FileSystem: Add Operations::getCurrentDirectory](https://github.com/Pagghiu/SaneCppLibraries/commit/dc8f428d)
- [FileSystem: Run clang-format](https://github.com/Pagghiu/SaneCppLibraries/commit/d65ee98f)
- [CI: Allow running the CI jobs on every branch of the repo](https://github.com/Pagghiu/SaneCppLibraries/commit/4451c6f1)
- [CI: Trigger "Documentation and Code Coverage" workflow on pull requests](https://github.com/Pagghiu/SaneCppLibraries/commit/d6ae3d17)

# Http

The `SC::Http` module has received some improvements to its URL parser, mainly by extending its test coverage.

However, this is just a small step. `SC::Http` is still in a 🟥 Draft state and will require substantial work before it can even be considered 🟨 MVP.

**Detailed list of commits:**

- [Http: Add UTF8 tests for HttpURL Parser](https://github.com/Pagghiu/SaneCppLibraries/commit/3d351d95)
- [Http: Improve URL parser to handle case sensitivity, IPV6 and invalid ports](https://github.com/Pagghiu/SaneCppLibraries/commit/531a317a)
- [Http: Improve URL Parser to test more edge cases](https://github.com/Pagghiu/SaneCppLibraries/commit/424fa577)


# Miscellaneous

As with every month, here is a bunch of random fixes!

- [Everywhere: Support running test suite under XCTest](https://github.com/Pagghiu/SaneCppLibraries/commit/3582d554)
- [File: Check for errors during stdin / stdout / stderr handles duplication](https://github.com/Pagghiu/SaneCppLibraries/commit/75765a45)
- [Process: Modify stdout / stderr Span to return how many bytes have been read](https://github.com/Pagghiu/SaneCppLibraries/commit/22e0f32f)

