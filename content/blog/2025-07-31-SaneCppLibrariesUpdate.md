Title: 🏖️ Sane C++ July 25
Date: 2025-07-31
Category: SaneCppLibraries
Image: 2025-07-31-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2025-07-31-SaneCppLibrariesUpdate
Summary: Welcome to the update post for July 2025!<br> It's dependency cleanup month! 🧹🧹🧹
TOC:    #section-0,July Updates
        #automatic-dependency-and-loc,Automatic Dependency and LOC
        #foundation-cleanup,Foundation cleanup
        #async-dependencies,Async dependencies
        #filesystemwatcher-dependencies,FileSystemWatcher Dependencies
        #filesystem-dependencies,FileSystem Dependencies
        #filesystemiterator-dependencies,FileSystemIterator dependencies
        #file-dependencies,File dependencies
        #process-dependencies,Process dependencies
        #socket-dependencies,Socket dependencies
        #strings-improvements,Strings improvements
        #other-improvements,Other improvements

# Automatic Dependency and LOC

List of dependencies between libraries and the number of lines of code (LOC) composing them gives an immediate complexity indication.

For this reason from this month I've started publishing:

- The reported lines of code (LOC) for each library
- The dependencies between libraries 

An automatic python scripts now updates both inside each library documentation page and also to Readmes and elsewhere.

This has been the input to start attacking and removing un-needed inter-dependencies between libraries.

This has in turn freed many libraries from dynamic allocation!

<a href="https://pagghiu.github.io/SaneCppLibraries/page_dependencies.html" target="_blank">
<img src="{attach}/images/2025-07-31-SaneCppLibrariesUpdate/SCDependencies.png">
</a>


<a href="https://pagghiu.github.io/SaneCppLibraries/libraries.html" target="_blank">
<img src="{attach}/images/2025-07-31-SaneCppLibrariesUpdate/SCLibrariesLOC.png">
</a>

**Detailed list of commits:**

- [Documentation: Add lines of code count to Libraries.md](https://github.com/Pagghiu/SaneCppLibraries/commit/195ceea)
- [Documentation: Report dependencies between libraries](https://github.com/Pagghiu/SaneCppLibraries/commit/e91d14a)
- [Documentation: Report lines of code count of each library](https://github.com/Pagghiu/SaneCppLibraries/commit/59f0bfc)
- [Documentation: Update LOC also for README.md](https://github.com/Pagghiu/SaneCppLibraries/commit/07e100e)


# Foundation cleanup

The `Foundation` library received several updates in order to make it as minimal as possible.

- `StringViewData` was renamed to `StringSpan` for better clarity.
- A new `StringPath` class was introduced to handle file system paths with maximum length constraints and UTF-16 conversion.
- Rarely used methods in `Span<T>` were moved to where they are actually used, and some unused `TypeTraits` were removed.
- Backtrace printing for `Assert` was implemented on Windows.
- Some classes have been moved elsewhere (like `Limits.h`).

All of these building blocks have been necessary to allow removal of several inter-dependencies between libraries in the project.

Dynamic allocation status: No allocation

**Detailed list of commits:**

- [Foundation: Add StringPath holding the maximum length of a file system path](https://github.com/Pagghiu/SaneCppLibraries/commit/b80d5e7)
- [Foundation: Add write and append null terminated to StringSpan](https://github.com/Pagghiu/SaneCppLibraries/commit/db94f0d)
- [Foundation: Implement Assert backtrace printing for Windows](https://github.com/Pagghiu/SaneCppLibraries/commit/ab3d724)
- [Foundation: Move IntrusiveDoubleLinkedList to Async](https://github.com/Pagghiu/SaneCppLibraries/commit/366ac35)
- [Foundation: Move Limits.h to Testing](https://github.com/Pagghiu/SaneCppLibraries/commit/6b6a99b)
- [Foundation: Move rarely used Span<T> methods where they're actually used](https://github.com/Pagghiu/SaneCppLibraries/commit/a63a1c1)
- [Foundation: Refactor StringPath functionality in a reusable StringNativeFixed](https://github.com/Pagghiu/SaneCppLibraries/commit/2a20fb1)
- [Foundation: Remove some rarely used TypeTraits](https://github.com/Pagghiu/SaneCppLibraries/commit/626b59b)
- [Foundation: Remove some useless macros](https://github.com/Pagghiu/SaneCppLibraries/commit/a91fefc)
- [Foundation: Rename StringViewData to StringSpan](https://github.com/Pagghiu/SaneCppLibraries/commit/8485f00)
- [Foundation: Use Result in StringSpan to communicate error reason](https://github.com/Pagghiu/SaneCppLibraries/commit/f773a79)

# Async dependencies

`Async` is an advanced multi-platform async IO library with a feature set that is progressively expanding.

The biggest library of the project has now no more dependency on `Process` library.
Combining this with all the other dependency *cleanups* of this month makes the library set of transitive dependencies much cleaner.

Previously the <a href="https://pagghiu.github.io/SaneCppLibraries/library_async.html">`SC::Async`</a> Library was depending on almost the entire rest of Sane C++ Libraries!

Now the entire list of dependencies for `Async` is `File`, `FileSystem`, `Foundation`, `Socket`, `Threading`, `Time`.

Dynamic allocation status: No allocation

<a href="{attach}/images/2025-07-31-SaneCppLibrariesUpdate/SCAsyncDependencies.png" target="_blank">
<img src="{attach}/images/2025-07-31-SaneCppLibrariesUpdate/SCAsyncDependencies.png">
</a>


**Detailed list of commits:**

- [Async: Remove dependency from Process library](https://github.com/Pagghiu/SaneCppLibraries/commit/4091f2e)

# FileSystemWatcher Dependencies

`FileSystemWatcher` has probably been the hardest dependency cleanup to finish.

In addition to removing dependencies from `Strings` and `Memory` libraries, it has been necessary to remove dependency from the `Async` library too.
The reason is that `FileSystemWatcher` supports both a thread based backend or an event loop based one.

Now the role of integrating `FileSystemWatcher` with `Async` has been isolated in the `FileSystemWatcherAsync` library, through some minimal runtime virtual interface usage.

Dynamic allocation status: No allocation

**Detailed list of commits:**

- [FileSystemWatcher: Reduce manual string handling with StringPath](https://github.com/Pagghiu/SaneCppLibraries/commit/45a1232)
- [FileSystemWatcher: Remove dependency from Async and File libraries](https://github.com/Pagghiu/SaneCppLibraries/commit/563c03e)
- [FileSystemWatcher: Remove dependency from Memory library](https://github.com/Pagghiu/SaneCppLibraries/commit/29829dd)
- [FileSystemWatcher: Use StringPath where appropriate to simplify code](https://github.com/Pagghiu/SaneCppLibraries/commit/a250300)

# FileSystem Dependencies

The `FileSystem` library underwent significant refactoring to simplify its code and reduce dependencies:

- Platform-specific implementations were merged into `FileSystemOperations`.
- Methods like `makeDirectoryRecursive` were added, while `removeEmptyDirectoryRecursive` was removed.
- Dependencies on `Containers`, `Strings`, and `Memory` libraries were eliminated, making the library more lightweight and focused.

Library now only depends on `Foundation` and `Time` libraries.

Dynamic allocation status: No allocation

**Detailed list of commits:**

- [FileSystem: Get rid of removeEmptyDirectoryRecursive](https://github.com/Pagghiu/SaneCppLibraries/commit/67a5dd8)
- [FileSystem: Implement FileSystemOperations makeDirectoryRecursive](https://github.com/Pagghiu/SaneCppLibraries/commit/6f72723)
- [FileSystem: Merge platform specific implementation in FileSystemOperations](https://github.com/Pagghiu/SaneCppLibraries/commit/88d3db4)
- [FileSystem: Move FileSystemOperations to FileSystem::Operations](https://github.com/Pagghiu/SaneCppLibraries/commit/b5b0470)
- [FileSystem: Re-implement FileSystemDirectories methods in FileSystemOperations](https://github.com/Pagghiu/SaneCppLibraries/commit/d82c851)
- [FileSystem: Remove dependency from Containers library](https://github.com/Pagghiu/SaneCppLibraries/commit/106b621)
- [FileSystem: Remove dependency from String and Memory libraries](https://github.com/Pagghiu/SaneCppLibraries/commit/f966926)

# FileSystemIterator dependencies

`FileSystemIterator` has been already cleaned up during path month's effort.
This month however the extremely error prone manual string handling has been reduced through the use of the new StringPath class

Library now only depends on `Foundation` library.

Dynamic allocation status: No allocation

**Detailed list of commits:**

- [FileSystemIterator: Reduce manual string handling using StringPath](https://github.com/Pagghiu/SaneCppLibraries/commit/b774139)

# File dependencies

`File` has also seen removal of dependencies from `Memory` and `Strings`, by using `StringPath` for simplifying string handling.

Library now only depends on `Foundation` library.

Dynamic allocation status: No allocation

**Detailed list of commits:**

- [File: Remove dependency from Memory and Strings Libraries](https://github.com/Pagghiu/SaneCppLibraries/commit/33e68f9)
- [File: Rename FileDescriptor.cpp to just File.cpp](https://github.com/Pagghiu/SaneCppLibraries/commit/b1da42d)
- [File: Use StringPath where appropriate to simplify code](https://github.com/Pagghiu/SaneCppLibraries/commit/c19572a)

# Process dependencies

The `Process` library has seen also dependency from `Strings` and `Memory` library removed, through some lightweight runtime abstraction (`IGrowableBuffer`).
This interface abstracts read/write operation to/from `Strings` and `Buffers`.

Library now only depends on `File` and `Foundation` libraries.

Dynamic allocation status: No allocation

**Detailed list of commits:**

- [Process: Merge ProcessDescriptor.h to Process.h](https://github.com/Pagghiu/SaneCppLibraries/commit/1a81233)
- [Process: Remove dependency from Strings library](https://github.com/Pagghiu/SaneCppLibraries/commit/89c5385)
- [Process: Use IGrowableBuffer when outputting to String / Buffer](https://github.com/Pagghiu/SaneCppLibraries/commit/a2addfa)

# Socket dependencies

The `Socket` libraries has been streamlined by removing dependencies on `Strings`, `File`, `Threading` and `Time`.

Library now only depends on `Foundation`.

Dynamic allocation status: No allocation

**Detailed list of commits:**

- [Socket: Remove dependency from File library](https://github.com/Pagghiu/SaneCppLibraries/commit/143a4c7)
- [Socket: Merge SocketDescriptor.h to Socket.h](https://github.com/Pagghiu/SaneCppLibraries/commit/7538b89)
- [Socket: Remove dependency from Threading library](https://github.com/Pagghiu/SaneCppLibraries/commit/da872ac5)
- [Socket: Remove dependency from Time library](https://github.com/Pagghiu/SaneCppLibraries/commit/9c89b2f7)

# Strings improvements

The `Strings` library saw several improvements:

- `StringNative` was renamed to `SmallStringNative`.
- `Path` functionality was moved from the `FileSystem` library to `Strings`.
- `StringConverter` was updated to accept `StringSpan`.

Dynamic allocation status: Allocates dynamic memory

**Detailed list of commits:**

- [Strings: Change StringConverter to accept StringSpan](https://github.com/Pagghiu/SaneCppLibraries/commit/cecc951)
- [Strings: Fix clang warning about GrowableBuffer destructor marked as final](https://github.com/Pagghiu/SaneCppLibraries/commit/8568bbd)
- [Strings: Move Path from FileSystem to Strings library](https://github.com/Pagghiu/SaneCppLibraries/commit/1d496d2)
- [Strings: Rename StringNative to SmallStringNative](https://github.com/Pagghiu/SaneCppLibraries/commit/40e41b8)

# Other improvements

- The CI pipeline was updated to replace Windows Server 2019 with Windows Server 2025.
- Code was cleaned up to remove warnings reported by `clangd`
- Debug Visualizers have been fixed

**Detailed list of commits:**

- [CI: Replace Windows Server 2019 with Windows Server 2025](https://github.com/Pagghiu/SaneCppLibraries/commit/10c0296)
- [Containers: Move StrongID from Foundation to Containers](https://github.com/Pagghiu/SaneCppLibraries/commit/a1021cb)
- [DebugVisualizer: Fix StringSpan / StringView visualizers](https://github.com/Pagghiu/SaneCppLibraries/commit/585ee59)
- [Everywhere: Remove /* */ style comments](https://github.com/Pagghiu/SaneCppLibraries/commit/8945865)
- [Everywhere: Get rid of some warnings reported by clangd](https://github.com/Pagghiu/SaneCppLibraries/commit/72fde39)
- [Tools: Update 7zr to 25.00](https://github.com/Pagghiu/SaneCppLibraries/commit/9a922f6)
