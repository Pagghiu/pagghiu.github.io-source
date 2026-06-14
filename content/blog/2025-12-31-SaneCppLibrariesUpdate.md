Title: 🌫️ Sane C++ December 25
Date: 2025-12-31
Category: SaneCppLibraries
Image: 2025-12-31-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2025-12-31-SaneCppLibrariesUpdate
Summary: Welcome to the December 2025 update!<br> This month the `Http` library is finally losing its dependency on `Memory` and gets a lot of reliability fixes!
TOC:    #section-0,December Updates
        #dependencies,Dependencies
        #http,Http
        #asyncstreams,AsyncStreams
        #async,Async
        #others,Others

# Dependencies

The bulk of work for this month has been getting rid of the `Memory` dependency from the `Http` library.

This is incredibly important, because allocation is only done by the `Memory` library!

This means that excluding `Containers` and the support `ContainersReflection` all libraries make _No allocation_ whatsoever.
All of them can work inside fixed buffers or inside dynamically allocated memory allocated by the user that has knowledge of the entire application context.

Plus, it finally makes the internal dependencies graph between all libraries look super cool:

<a href="{attach}/images/2025-12-23-SaneCpp2year/2025-12-23-SaneCpp2Year-Dependencies.svg" target="_blank">
<img src="{attach}/images/2025-12-23-SaneCpp2year/2025-12-23-SaneCpp2Year-Dependencies.svg">
</a>

# Http

Going back to the actual improvements to Http, I am not sure where to start.
Multiple iterations of the API have been done and it's probably not over yet...

The API at the beginning of the month was something like this, with allocating `Buffers` usage and raw allocations everywhere (so ugly!):

<a href="{attach}/images/2025-12-31-SaneCppLibrariesUpdate/2025-12-HttpAsyncWebServerStart.jpg" target="_blank">
<img src="{attach}/images/2025-12-31-SaneCppLibrariesUpdate/2025-12-HttpAsyncWebServerStart.jpg">
</a>

The point has been making sure that a connection should be able to live within a block of memory that is fixed during its initialization.

This is because most of the time, reasonable defaults and safety limits must be set anyway to control how many Kb of headers can be accepted or how many Kb can be dedicated to streaming large files.

One example on initializing the web server with compile time fixed buffers is the following:

<a href="{attach}/images/2025-12-31-SaneCppLibrariesUpdate/2025-12-HttpAsyncWebServerFixed.jpg" target="_blank">
<img src="{attach}/images/2025-12-31-SaneCppLibrariesUpdate/2025-12-HttpAsyncWebServerFixed.jpg">
</a>

As `AsyncStreams` have been fully integrated, it's now possible to send even very large file using some tiny fixed buffers.
If they're too tiny, the transfer is going to become very slow, as a lot of syscall will be needed to fully transmit the file, so it's always as good idea sizing the buffers accordingly.

If one wants to decide the size of these buffers at runtime, the API will become slightly more verbose but I would say it's not so bad:
 
<a href="{attach}/images/2025-12-31-SaneCppLibrariesUpdate/2025-12-HttpAsyncWebServerRuntime.jpg" target="_blank">
<img src="{attach}/images/2025-12-31-SaneCppLibrariesUpdate/2025-12-HttpAsyncWebServerRuntime.jpg">
</a>

The example shows how to assign memory from _Structure Of Arrays_ style arrangement for these buffers, all equally sized.
This is using an helper class called `StableArray` that uses `VirtualMemory` to reserve space for extremely large buffers and just commits to physical RAM the actually used quantity.
The `WebServerExample` in `SCExample` also shows how to resize such buffers at runtime, while the web-server is running!

<a href="{attach}/images/2025-12-31-SaneCppLibrariesUpdate/2025-12-SCExample.jpg" target="_blank">
<img src="{attach}/images/2025-12-31-SaneCppLibrariesUpdate/2025-12-SCExample.jpg">
</a>

It's also possible to just give each connection a buffers of different sizes, making the memory management slightly more complicated.

The library is still in `🟥 Draft` state, and it will likely stay like that for the next months. 

I can still see some random lost connections in browser tools from Safari / Firefox / Chrome when trying to visit some test website.

Also the performance / latency looks quite bad for now, but it doesn't make sense to start working on performance before becoming compliant with the spec to some acceptable level!

<a href="{attach}/images/2025-12-31-SaneCppLibrariesUpdate/2025-12-HttpError.jpg" target="_blank">
<img src="{attach}/images/2025-12-31-SaneCppLibrariesUpdate/2025-12-HttpError.jpg">
</a>

**Detailed list of commits:**

- [Http: Add helper to configure connection buffers and queues at runtime](https://github.com/Pagghiu/SaneCppLibraries/commit/2802e629)
- [Http: Allow declaring fixed size queues side by side with HttpConnection](https://github.com/Pagghiu/SaneCppLibraries/commit/d2971b78)
- [Http: Allow resizing server connections array](https://github.com/Pagghiu/SaneCppLibraries/commit/a4b7c3c3)
- [Http: Allow user to setup header memory for each connection](https://github.com/Pagghiu/SaneCppLibraries/commit/ae44d2ab)
- [Http: Improve Documentation](https://github.com/Pagghiu/SaneCppLibraries/commit/15bb382b)
- [Http: Let caller supply the streams for async file server stream](https://github.com/Pagghiu/SaneCppLibraries/commit/39ebbc23)
- [Http: Make buffers pool and pipeline per connection](https://github.com/Pagghiu/SaneCppLibraries/commit/7e5d3e53)
- [Http: Make HttpAsyncServer and HttpAsyncFileServer API more symmetric](https://github.com/Pagghiu/SaneCppLibraries/commit/0ce599d7)
- [Http: Make ThreadPool mandatory to initialize HttpAsyncFileServer](https://github.com/Pagghiu/SaneCppLibraries/commit/c5eac859)
- [Http: Move pipeline from file stream to connection object](https://github.com/Pagghiu/SaneCppLibraries/commit/f2e70243)
- [Http: Move slice buffers helper to AsyncStreams](https://github.com/Pagghiu/SaneCppLibraries/commit/f8506b71)
- [Http: Parse response in HttpClient to read Content-Length](https://github.com/Pagghiu/SaneCppLibraries/commit/f107b2b3)
- [Http: Remove dependency on Memory (drop HttpClient)](https://github.com/Pagghiu/SaneCppLibraries/commit/f39ee2cf)
- [Http: Rename HttpServer to HttpConnectionsPool](https://github.com/Pagghiu/SaneCppLibraries/commit/802e72ef)
- [Http: Rename HttpWebServer to HttpAsyncFileServer](https://github.com/Pagghiu/SaneCppLibraries/commit/af100a97)
- [Http: Use AsyncStreams in HttpResponse](https://github.com/Pagghiu/SaneCppLibraries/commit/b306d315)
- [Http: Use AsyncStreams in HttpWebServer](https://github.com/Pagghiu/SaneCppLibraries/commit/52c160ba)
- [Http: Write response headers to the headers buffer](https://github.com/Pagghiu/SaneCppLibraries/commit/31395aae)
- [SCExample: Allow changing buffers sizes at runtime in WebServer Example](https://github.com/Pagghiu/SaneCppLibraries/commit/bd657cf0)
- [SCExample: Use virtual memory for all web server buffers](https://github.com/Pagghiu/SaneCppLibraries/commit/3ed1d515)

# AsyncStreams

A few changes in `AsyncStreams` have been made, as consequences of `Http` improvements.

Writable streams can now be destroyed and pipelines are automatically un-piped after all sinks have finished writing their data.

A few fixes also have been applied, like copying listeners during emit event (to allow changing listeners when inside an handler), emptying the read queue on destroy and resetting the request state on init.

Methods to set queues and buffers for the pool have been separated from initialization, so that they can be set during construction / setup and re-used across multiple successive initializations.

**Detailed list of commits:**

- [AsyncStreams: Add destroy method for writable stream](https://github.com/Pagghiu/SaneCppLibraries/commit/99b30825)
- [AsyncStreams: Add explicit method to set buffers in the pool](https://github.com/Pagghiu/SaneCppLibraries/commit/371edff4)
- [AsyncStreams: Add method to explicitly set read and write queues](https://github.com/Pagghiu/SaneCppLibraries/commit/fed7c057)
- [AsyncStreams: Automatically un-pipe pipelines after all sinks have finished](https://github.com/Pagghiu/SaneCppLibraries/commit/7d7db8c1)
- [AsyncStreams: Copy listeners during Event emit](https://github.com/Pagghiu/SaneCppLibraries/commit/ab7efb92)
- [AsyncStreams: Empty the readQueue when destroying](https://github.com/Pagghiu/SaneCppLibraries/commit/3d0e8b82)
- [AsyncStreams: Explicitly mark buffers to be re-used when their refCount goes to zero](https://github.com/Pagghiu/SaneCppLibraries/commit/94ad89f0)
- [AsyncStreams: Reset requests state on stream initialization](https://github.com/Pagghiu/SaneCppLibraries/commit/71cd7291)

# Async

The extensive testing and improvements of `Http` library has exposed some issues in `Async`.

A quite nasty bug in the gather writes has been fixed in Posix, affecting partial writes, that has never been surfacing in the unit tests.

Also it made sense to ignore reporting errors when cancellations fail to submit on windows.
This happens when trying to cancel an async operation that has already finished but for which the overlapped status has not been retrieved yet.

**Detailed list of commits:**

- [Async: Add method to check if event loop backend needs thread-pool](https://github.com/Pagghiu/SaneCppLibraries/commit/b5bbc57d)
- [Async: Do not report errors when cancellations fail to submit](https://github.com/Pagghiu/SaneCppLibraries/commit/eb49c425)
- [Async: Fix incomplete gather writes on Posix](https://github.com/Pagghiu/SaneCppLibraries/commit/4dcedcfa)

# Others

The usual mix of fixes this month includes a debug visualizer for `Span<T>` and properly support exporting types across dynamic libraries (by adding `SC_COMPILER_EXPORT` in all relevant places).

During a bad search and replace done a few months ago, `Result` lost its `[[nodiscard]]` status, that has been fixed.

`GrowableBuffer` has now a `Span<char>` specialization, to allow using things like `StringFormat` / `StringBuilder` with raw char arrays.

`VirtualMemory` class has been cleaned up and improved, with its destructor properly releasing allocated memory.

A bug in `Process` was reading incomplete output from child processes terminating very quickly.

**Detailed list of commits:**

- [DebugVisualizer: Add debug visualizers for Span<T>](https://github.com/Pagghiu/SaneCppLibraries/commit/aed874a7)
- [Everywhere: Add SC_COMPILER_EXPORT clause to many types](https://github.com/Pagghiu/SaneCppLibraries/commit/7b368e33)
- [File: Add method to read into a fixed buffer until it's full or EOF happens](https://github.com/Pagghiu/SaneCppLibraries/commit/43df70bc)
- [Foundation: Add GrowableBuffer<Span<char>> specialization](https://github.com/Pagghiu/SaneCppLibraries/commit/a107d6e3)
- [Foundation: Mark Result as a [[nodiscard]] type again](https://github.com/Pagghiu/SaneCppLibraries/commit/a9806d78)
- [Memory: Make VirtualMemory fields private and add destructor](https://github.com/Pagghiu/SaneCppLibraries/commit/4a3f5cbb)
- [Process: Read entire process output until in user supplied writable span](https://github.com/Pagghiu/SaneCppLibraries/commit/1f393c01)

See you next month!