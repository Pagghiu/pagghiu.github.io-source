Title: ❄️ Sane C++ January 25
Date: 2025-01-31
Category: SaneCppLibraries
Image: 2025-01-31-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2025-01-31-SaneCppLibrariesUpdate
Summary: Welcome to the update post for January 2025!<br> This month has been mostly spent improving <code>SC::Async</code> library!
TOC:    #section-0,Sane C++ January 25
        #scasync, SC::Async
        #scasyncstreams, SC::AsyncStreams
        #scfoundation, SC::Foundation
        #sctime, SC::Time
        #minor-changes, Minor Changes


### SC::Async

<a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_async.html">`SC::Async`</a> has been the main focus of the month.

Simplification:

- Remove one state throughout the system (`Teardown`)

Consistency:

- Expose callback to signal when a request is fully stopped after issuing a `AsyncRequest::stop()`.

Features:

- Exclude specific request from active count (it will not keep the loop alive)
- Enumerate all (non-internal) active and submitted async requests
- Interrupt event loop even with active requests
- Update loop time externally
- Check request state (free / active / cancelling)

Stability:

- Fix issues with `AsyncWakeUp` on `io_uring`

Timers (`AsyncLoopTimeout`) improvements:

- Invoke timers consistently when one of them is being cancelled during another timer's callback.
- Sort timers by expiration time (first) and insertion order (second)
- Use Monotonic clock everywhere
- Unify code on all backends (including `io_uring`)

Detailed List of commits:

- [Async: Add a callback to signal when AsyncRequest is fully closed after stop()](https://github.com/Pagghiu/SaneCppLibraries/commit/a8825316)
- [Async: Add method to check if event loop is initialized](https://github.com/Pagghiu/SaneCppLibraries/commit/cfe1eef6)
- [Async: Add method to enumerate all requests of the event loop](https://github.com/Pagghiu/SaneCppLibraries/commit/63850d3d)
- [Async: Add methods to check if a request is free/active/cancelling and update loop time](https://github.com/Pagghiu/SaneCppLibraries/commit/705643b8)
- [Async: Allow excluding a specific request from active count](https://github.com/Pagghiu/SaneCppLibraries/commit/809d139d)
- [Async: Allow interrupting event loop even with active requests](https://github.com/Pagghiu/SaneCppLibraries/commit/69d6edb2)
- [Async: Do not enumerate internally created requests](https://github.com/Pagghiu/SaneCppLibraries/commit/082e2dcb)
- [Async: Enforce temporal ordering of loop timeouts](https://github.com/Pagghiu/SaneCppLibraries/commit/00ced9c5)
- [Async: Expose callback to notify before and after polling for IO](https://github.com/Pagghiu/SaneCppLibraries/commit/89506626)
- [Async: Fix AsyncWakeUp on io_uring](https://github.com/Pagghiu/SaneCppLibraries/commit/f1eac82e)
- [Async: Fix expired timers invocation when they're being cancelled](https://github.com/Pagghiu/SaneCppLibraries/commit/81e4455a)
- [Async: Make teardownAsync static function](https://github.com/Pagghiu/SaneCppLibraries/commit/c6edcbd3)
- [Async: Reduce AsyncEventLoop size](https://github.com/Pagghiu/SaneCppLibraries/commit/3c0a170b)
- [Async: Remove Teardown state to reduce complexity](https://github.com/Pagghiu/SaneCppLibraries/commit/32f15c13)
- [Async: Split AsyncTest in multiple files for easier navigation](https://github.com/Pagghiu/SaneCppLibraries/commit/c46a9fa4)
- [Async: Update time in any case after a kernel sync operation](https://github.com/Pagghiu/SaneCppLibraries/commit/ca411dc0)
- [Async: Use Monotonic clock everywhere](https://github.com/Pagghiu/SaneCppLibraries/commit/9970a64d)
- [Async: When interrupted loop shouldn't dispatch completions](https://github.com/Pagghiu/SaneCppLibraries/commit/8b375613)

### SC::AsyncStreams

Some minimal work as been done to the <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_async_streams.html">`SC::AsyncStreams`</a> library as well.


One video has been recorded Showing how to move the transform stream compression operation on a background thread, using `AsyncLoopWork`.
This video pauses (for now) the series of videos dedicated to `SC::AsyncStreams`.

<div class="youtube youtube-16x9">
<iframe src="https://www.youtube.com/embed/vCh6vEfiISI" allowfullscreen seamless frameborder="0"></iframe>
</div>

Detailed List of commits:

- [AsyncStreams: Compress on separate thread on zlib transform stream](https://github.com/Pagghiu/SaneCppLibraries/commit/5df350ac)
- [AsyncStreams: Fix zlib api calling convention](https://github.com/Pagghiu/SaneCppLibraries/commit/d7c0e573)


### SC::Foundation

<a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_foundation.html">`SC::Foundation`</a> most notable change has been using a different approach in `SC::Function`.

We're now using a `vtable`-like approach that allows saving one entire pointer (!!) for each `SC::Function` instance.

The price to pay is the static initialization (that will require a `mutex` acquisition) and one more indirection, but it has been considered a good tradeoff.

Detailed List of commits:

- [Foundation: Add a basic test for HeapBuffer](https://github.com/Pagghiu/SaneCppLibraries/commit/48788b62)
- [Foundation: Add explicit size for Linux on OpaqueObject](https://github.com/Pagghiu/SaneCppLibraries/commit/dec26556)
- [Foundation: Use static vtable approach in Function to reduce its size](https://github.com/Pagghiu/SaneCppLibraries/commit/153995b9)

### SC::Time

The <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_time.html">`SC::Time`</a> library got user defined literals, some conversion between different units and differentiation between monotonic and realtime clocks.

A nasty bug regarding time normalization in `SC::Time::HighResolutionCounter` has been fixed too!

Detailed List of commits:

- [Time: Add User defined literals and more conversions between types](https://github.com/Pagghiu/SaneCppLibraries/commit/57f737d6)
- [Time: Differentiate between Monotonic and Realtime clocks](https://github.com/Pagghiu/SaneCppLibraries/commit/22c2335a)
- [Time: Handle time normalization in HighResolutionCounter](https://github.com/Pagghiu/SaneCppLibraries/commit/e4832649)

### Minor changes

And these are some minor changes that don't have enough impact to deserve a dedicated comment.

Detailed List of commits:

- [Everywhere: Fix build and runtime issues with GCC 13](https://github.com/Pagghiu/SaneCppLibraries/commit/fb093b66)
- [Plugin: Use correct casing for the "nologo" option](https://github.com/Pagghiu/SaneCppLibraries/commit/ae1f43d8)
- [SCExample: Stop timer during close](https://github.com/Pagghiu/SaneCppLibraries/commit/ca1b0c12)
- [SCExample: Update dear-imgui and sokol](https://github.com/Pagghiu/SaneCppLibraries/commit/77c26075)