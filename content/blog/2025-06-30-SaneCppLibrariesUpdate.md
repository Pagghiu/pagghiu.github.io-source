Title: ☀️ Sane C++ June 25
Date: 2025-06-30
Category: SaneCppLibraries
Image: 2025-06-30-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2025-06-30-SaneCppLibrariesUpdate
Summary: Welcome to the update post for June 2025!<br> This month brings a new async file system operations, an enhanced UDP socket support in <a href="https://pagghiu.github.io/SaneCppLibraries/library_async.html">`SC::Async`</a> and some dependency cleanup with the Memory library split from Foundation!
TOC:    #section-0,Sane C++ June 25
        #async-file-system-operations,Async File System Operations
        #async-udp-socket-operations,Async UDP Socket Operations
        #memory-library-split,Memory Library Split
        #filesystemiterator-and-filesystemwatcher-dependency-cleanup,FileSystemIterator and FileSystemWatcher Dependency Cleanup
        #foundation,Foundation
        #socket,Socket
        #other-improvements,Other improvements

# Async File System Operations

A major new feature this month is the unified `AsyncFileSystemOperation` that provides async file system operations across all platforms. This replaces the previous `AsyncFileClose` and `AsyncSocketClose` with a more comprehensive and consistent API.

The new operations include:

- **open/close** (File)
- **read/write** (File)
- **copyFile/copyDirectory** (File / Directory)
- **rename** (File / Directory)
- **removeFile/removeEmptyDirectory**: (File / Directory)

Eventually `AsyncFileRead` / `AsyncFileWrite` will be renamed to something like `AsyncPipeRead` / `AsyncPipeWrite`, losing their threading support needed for buffered files, now that dedicated fs read / write operation exist.

Under the hood, this leverages platform-specific async APIs:

- `io_uring` on Linux
- `IOCP` (I/O Completion Ports) on Windows.

The abstraction handles the complexity of these very different APIs while providing a consistent interface.

Here's an example (extracted from the test suite) on how it's meant to be used:

<a href="{attach}/images/2025-06-30-SaneCppLibrariesUpdate/SCAsyncFileSystemOperation.png" target="_blank">
<img src="{attach}/images/2025-06-30-SaneCppLibrariesUpdate/SCAsyncFileSystemOperation.png">
</a>

Detailed list of commits:

- [Async: Add AsyncFileSystemOperation](https://github.com/Pagghiu/SaneCppLibraries/commit/cf2dac7)
- [Async: Add "open" async file system operation](https://github.com/Pagghiu/SaneCppLibraries/commit/5eea13c)
- [Async: Add "close" async file system operation](https://github.com/Pagghiu/SaneCppLibraries/commit/1656732)
- [Async: Add "read" async file system operation](https://github.com/Pagghiu/SaneCppLibraries/commit/3eb4d4e)
- [Async: Add "write" async file system operation](https://github.com/Pagghiu/SaneCppLibraries/commit/1656732)
- [Async: Add "copyFile" async file system operation](https://github.com/Pagghiu/SaneCppLibraries/commit/04a77a1)
- [Async: Add "rename" async file system operation](https://github.com/Pagghiu/SaneCppLibraries/commit/427a70c)
- [Async: Add "removeFile" async file system operation](https://github.com/Pagghiu/SaneCppLibraries/commit/8033b48)
- [Async: Add "removeDirectory" async file system operation](https://github.com/Pagghiu/SaneCppLibraries/commit/427a70c)
- [Async: Add "copyDirectory" async file system operation](https://github.com/Pagghiu/SaneCppLibraries/commit/4bee0c0)

# Async UDP Socket Operations

New async operations for UDP sockets have been added: `sendTo` and `receiveFrom` for unconnected sockets. 

This is particularly useful for UDP networking scenarios where you need to send/receive from multiple endpoints.

The implementation handles the platform differences elegantly:

- **Linux**: Uses `io_uring` with `IORING_OP_SENDMSG` and `IORING_OP_RECVMSG`
- **Windows**: Uses `IOCP` with `WSASendTo` and `WSARecvFrom`

Here's how the async sendTo operation looks in practice:
<a href="{attach}/images/2025-06-30-SaneCppLibrariesUpdate/SCAsyncSendTo.jpg" target="_blank">
<img src="{attach}/images/2025-06-30-SaneCppLibrariesUpdate/SCAsyncSendTo.jpg">
</a>

And the corresponding receiveFrom operation:
<a href="{attach}/images/2025-06-30-SaneCppLibrariesUpdate/SCAsyncReceiveFrom.jpg" target="_blank">
<img src="{attach}/images/2025-06-30-SaneCppLibrariesUpdate/SCAsyncReceiveFrom.jpg">
</a>

- [Async: Add sendTo and receiveFrom requests for unconnected sockets](https://github.com/Pagghiu/SaneCppLibraries/commit/7a728f2)

# Memory Library Split

One important change this mont is the split of memory management components from the Foundation library into a dedicated Memory library.

The goal has been isolating `Segment`, `Buffer`, `Globals`, and `VirtualMemory` - all the components that perform dynamic allocation.

This change brings much clearer dependency boundaries. Now if something depends only on Foundation, you can be certain it doesn't perform any dynamic allocation. This is particularly important for embedded systems, low-level libraries, or any code that needs to avoid heap allocation.

The split involved moving 46 files and updating countless include statements across the codebase. 
While this was a slighltly distrupting refactoring effort, it makes the library architecture much more predictable and easier to reason about.

- [Memory: Split Segment, Buffer, Globals and VirtualMemory out of Foundation](https://github.com/Pagghiu/SaneCppLibraries/commit/07a30bd)

# FileSystemIterator and FileSystemWatcher Dependency Cleanup

This month saw significant work on cleaning up the dependency graph, which demonstrates the commitment to the <a href="https://pagghiu.github.io/SaneCppLibraries/page_principles.html">Sane C++ Libraries principles</a>.

`FileSystemWatcher` and `FileSystemIterator` have been cleaned up to remove unnecessary dependencies on `Strings` and `Containers`, making the dependency graph cleaner and more predictable.

As part of this cleanup, `FileSystemIterator` now requires you to pass in a fixed span of `FileSystemIterator::FolderState` that the iterator will use, avoiding any internal allocation.

Also `FileSystemWatcher` got the _no allocation_ treatment with the only exceptionon Linux where it's still doing a small (single) allocation holding paths for watching sub-directories (in case of recursive watch).
One could tecnically request the span of memory to use to the caller but maybe it's not great to bend the API for all other backends just for this one specific Linux difference. This topic will be re-visited in the future eventually maybe providing some hooks to remove also this very last allocation.

This kind of architectural hygiene is crucial for maintaining the "bloat free" and "easy to integrate" principles - when libraries have minimal, clear dependencies, they're much easier to understand, test, and integrate into existing projects!

- [FileSystemWatcher: Remove dependency from Strings, Containers and FileSystemIterator](https://github.com/Pagghiu/SaneCppLibraries/commit/2f59c19)
- [FileSystemIterator: Remove dependency from Strings and Containers](https://github.com/Pagghiu/SaneCppLibraries/commit/7b743ee)

# Foundation

A new `SC::StringViewData` class has been added to `Foundation` and it can be used in place of `SC::StringView` when parsing is not needed.

It's a non-owning view over a string and the most common use case is to pass it in and out of OS API as is for file system paths.
As it holds also the encoding, some libraries will convert the string in some internal buffer before passing it to OS api.

- [Foundation: Add StringViewData](https://github.com/Pagghiu/SaneCppLibraries/commit/5ee30f6)

# Socket

Added methods to shutdown sockets and get string representations of SocketIPAddress.

- [Socket: Add method to shutdown sockets](https://github.com/Pagghiu/SaneCppLibraries/commit/3e036b5)
- [Socket: Add method to return SocketIPAddress string representation](https://github.com/Pagghiu/SaneCppLibraries/commit/3271b9a)

# Other improvements

- [Algorithms: Add contains and output found index from findIf](https://github.com/Pagghiu/SaneCppLibraries/commit/94c8849)
- [File: Fix infinite loop on FileDescriptor::write (Windows)](https://github.com/Pagghiu/SaneCppLibraries/commit/c8e251b)
