Title: ☃️ Sane C++ December 24
Date: 2024-12-31
Category: SaneCppLibraries
Image: 2024-12-31-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2024-12-31-SaneCppLibrariesUpdate
Summary: Welcome to the update post for December 2024!<br> This month has been mostly spent improving <code>SC::AsyncStreams</code> library with Async Transform Streams!
TOC:    #section-0,Sane C++ December 24
        #scasyncstreams, SC::AsyncStreams
        #scasync, SC::Async
        #scfoundation, SC::Foundation
        #refactoring, Refactoring
        #minor-changes, Minor Changes

### SC::AsyncStreams

Most of the work has been focused on shaping the <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_async_streams.html">`SC::AsyncStreams`</a> library.

Async streams got their own folder and the `AsyncPipeline` API has been improved so that it accept transform streams.  
Transform streams are used to concurrently modify data read from a source, before it's being written to one or multiple destinations.
The sample use case has been compression through ZLIB library.  
In order to keep Sane C++ Libraries free of build time dependencies, zlib is dynamically loaded on all major operating systems.
A nice trick has been figuring out that the .NET CLR on Windows ships zlib hidden in the `clrcompression.dll`, avoiding the need to deploy it.

<blockquote class="bluesky-embed" data-bluesky-uri="at://did:plc:2yxw2iku77om6gswp7sl3njb/app.bsky.feed.post/3ldjr6ckmqk2q" data-bluesky-cid="bafyreigzeqlu4m7mdurvptalveduamsadxd3yhbvevzb6t6h7fsqgynpvi"><p lang="en">C/C++ compression tip:
Avoid deploying zlib binary with your executable, it&#x27;s already included in the OS.

macOS ▶️ libz.dylib
Linux ▶️ libz.so.1 (on normal distros)
Windows ▶️ clrcompression.dll (.NET CLR) exports:
- deflate
- deflateEnd
- inflate
- inflateEnd
- deflateInit2_
- inflateInit2_

Enjoy!😏</p>&mdash; Stefano Cristiano (<a href="https://bsky.app/profile/did:plc:2yxw2iku77om6gswp7sl3njb?ref_src=embed">@pagghiu.bsky.social</a>) <a href="https://bsky.app/profile/did:plc:2yxw2iku77om6gswp7sl3njb/post/3ldjr6ckmqk2q?ref_src=embed">December 17, 2024 at 10:14 PM</a></blockquote><script async src="https://embed.bsky.app/static/embed.js" charset="utf-8"></script>

It seems that the _fixed pool_ initial design constraint, that forbids any dynamic allocation inside Async Streams is still working.
Some more work will need to be carried on to really prove if it works on a significant number of use cases!  

Two Videos have been recorded while implementing the most significant portions of `SC::AsyncTransformStream`

<div class="youtube youtube-16x9">
<iframe src="https://www.youtube.com/embed/Ul7DdQGrETo" allowfullscreen seamless frameborder="0"></iframe>
</div>

<div class="youtube youtube-16x9">
<iframe src="https://www.youtube.com/embed/KKwohFmAUCk" allowfullscreen seamless frameborder="0"></iframe>
</div>


Detailed List of commits:

- [Move Async Streams to a dedicated folder](https://github.com/Pagghiu/SaneCppLibraries/commit/00b4e95d)
- [Improve documentation](https://github.com/Pagghiu/SaneCppLibraries/commit/17a36188)
- [Use threaded blocking IO for file operations in test](https://github.com/Pagghiu/SaneCppLibraries/commit/21839848)
- [Add an async zlib transform stream](https://github.com/Pagghiu/SaneCppLibraries/commit/21a0c927)
- [Replace Pipe with a Span of AsyncWritableStream](https://github.com/Pagghiu/SaneCppLibraries/commit/21c8605c)
- [Add method to remove all listeners bound to a specific class instance](https://github.com/Pagghiu/SaneCppLibraries/commit/387cc1f1)
- [Fix pause handling inside AsyncRequestReadableStream](https://github.com/Pagghiu/SaneCppLibraries/commit/402a214c)
- [Allow extending writable ending state until needed](https://github.com/Pagghiu/SaneCppLibraries/commit/70a4f927)
- [Add unpipe to remove listeners added by pipe](https://github.com/Pagghiu/SaneCppLibraries/commit/741bf983)
- [Add CircularQueue::pushFront](https://github.com/Pagghiu/SaneCppLibraries/commit/80b565e8)
- [Make AsyncPipeline end writable sinks when readable source ends](https://github.com/Pagghiu/SaneCppLibraries/commit/87e7652d)
- [Add errors listener directly on the AsyncPipeline in the test](https://github.com/Pagghiu/SaneCppLibraries/commit/8a3c5431)
- [Add ZLibAPI and ZLibStream](https://github.com/Pagghiu/SaneCppLibraries/commit/ad6a2b59)
- [Add Event::removeListener member function overload](https://github.com/Pagghiu/SaneCppLibraries/commit/c7c6714d)
- [Implement write resuming and pushing a buffer to the top of the write queue](https://github.com/Pagghiu/SaneCppLibraries/commit/d74291a1)
- [Add auto-close descriptor for request streams](https://github.com/Pagghiu/SaneCppLibraries/commit/de7e410f)
- [Add AsyncTransformStream and a simple synchronous zlib stream](https://github.com/Pagghiu/SaneCppLibraries/commit/df25bbf2)
- [Add AsyncPipeline::pipe to validate requested pipeline](https://github.com/Pagghiu/SaneCppLibraries/commit/ec5d68dc)

### SC::Async

<a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_async.html">`SC::Async`</a> gets its usual set of monthly minimal improvements.
The most significant one is change in API when using thread pools, so that they can be set once and re-used over multiple `start` of the same request.

Detailed List of commits:

- [Require setting thread-pool before start for AsyncLoopWork](https://github.com/Pagghiu/SaneCppLibraries/commit/898a7755)
- [Allow setting request thread pool and task before start](https://github.com/Pagghiu/SaneCppLibraries/commit/90fca39b)
- [Avoid leaking link to next element in ThreadSafeLinkedList](https://github.com/Pagghiu/SaneCppLibraries/commit/9cd6b84a)
- [Set AsyncRequest to State::Free after stop()](https://github.com/Pagghiu/SaneCppLibraries/commit/b05854d2)

### SC::Foundation

<a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_foundation.html">`SC::AsyncFoundation`</a> gets a few new classes to represent read-only and read/write strings without needing to include the entire <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_strings.html">`SC::String`</a> library.

- [Fix Span::reinterpret_as_array_of const correctness](https://github.com/Pagghiu/SaneCppLibraries/commit/1fb1bf36)
- [Add method to check if a Function is bound to a specific class instance](https://github.com/Pagghiu/SaneCppLibraries/commit/245cb384)
- [Add SpanStringView and SpanString](https://github.com/Pagghiu/SaneCppLibraries/commit/9ba637d1)
- [Add Span::sliceFromStartUntil and fix Span::equals](https://github.com/Pagghiu/SaneCppLibraries/commit/a16248d1)
- [Fix Span::reinterpret_as_array_of](https://github.com/Pagghiu/SaneCppLibraries/commit/ae21ddc2)

### Refactoring
Changes in <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_foundation.html">`SC::AsyncFoundation`</a> have been carried on to reduce header bloat and inter-dependencies between libraries.
More specifically both File and Socket library got this treatment, so that Socket doesn't depend on <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_strings.html">`SC::String`</a> library at all anymore, and <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_file.html">`SC::File`</a> now has a StringView-free header (`FileDescriptor.h`) that can be included without bringing any `StringView` dependency

- [Split all String and Vector related functions out of FileDescriptor](https://github.com/Pagghiu/SaneCppLibraries/commit/a2f67be3)
- [Split SocketDescriptor header](https://github.com/Pagghiu/SaneCppLibraries/commit/77d21663)

### Minor changes

- [Cleanup README.md by referencing relevant blogs/videos inside each library](https://github.com/Pagghiu/SaneCppLibraries/commit/146608cc)
- [Add some Quick Sheets and update README.md](https://github.com/Pagghiu/SaneCppLibraries/commit/b0154f33)
- [Add function to obtain plugins to reload after a file is modified](https://github.com/Pagghiu/SaneCppLibraries/commit/a7aad864)

