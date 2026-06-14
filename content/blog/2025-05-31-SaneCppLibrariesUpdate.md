Title: 🌸 Sane C++ May 25
Date: 2025-05-31
Category: SaneCppLibraries
Image: 2025-05-31-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2025-05-31-SaneCppLibrariesUpdate
Summary: Welcome to the update post for May 2025!<br> This month a new object called `AsyncSequence` has been added to <a href="https://pagghiu.github.io/SaneCppLibraries/library_async.html">`SC::Async`</a> together with a good list of smaller improvements!
TOC:    #section-0,Sane C++ May 25
        #deepwiki, DeepWiki
        #async-sequence,Async Sequence
        #async-cancellations,Async Cancellations
        #async-improvements,Async Improvements

# DeepWiki

I've been feeding the Sane C++ Libraries repo to <a href="https://deepwiki.com" target="_blank">DeepWiki</a> and I am actually surprised by how good it has understood the overall codebase structure!
Some details are wrong and sometimes it analyzes details that are not really worth that much, but it's really amazing how much insight it provides at a glance to someone who is not aware of the internals of the project.

Make sure to check it out at:

<a href="https://deepwiki.com/Pagghiu/SaneCppLibraries">https://deepwiki.com/Pagghiu/SaneCppLibraries</a>
<a href="https://deepwiki.com/Pagghiu/SaneCppLibraries" target="_blank">
<img src="{attach}/images/2025-05-31-SaneCppLibrariesUpdate/SCDeepWiki.png">
</a>

# Async Sequence

`AsyncSequence` allows controlling requests execution order, and it's implemented as a simple linked list queue that can simplify some common use cases.

For example `AsyncSequence` can be used to issue an `AsyncSocketConnect` request and then a sequence of `AsyncSocketSend` or a `AsyncSocketReceive` immediately after.
`AsyncSequence` avoids the need to start such additional requests in the callback of the previously finished requests.

This is a (not so small) extract of the test suite where `AsyncSequence` is being used to *queue* two writes so that they will happen in the correct order.
<a href="{attach}/images/2025-05-31-SaneCppLibrariesUpdate/SCAsyncSequence.png" target="_blank">
<img src="{attach}/images/2025-05-31-SaneCppLibrariesUpdate/SCAsyncSequence.png">
</a>

- [Async: Add AsyncSequence to control async requests execution order](https://github.com/Pagghiu/SaneCppLibraries/commit/2ec9cd28) 

# Async Cancellations

Lastly Async requests cancellation handling has been consolidated between all backends and it's more precise and consistent.
Some async backends (Windows `IOCP` / Linux `io_uring`) post cancellations notification to the kernel queue.
This is now properly handled by stepping the event loop one more time.

The remaining changes try to consistently track multiple edge cases when processing cancellations:

- `cancelAsync` is called only if an activateAsync has been previously called
- `teardownAsync` is called only if setupAsync has been previously called

Honestly trying to unify these kind of behaviors between APIs that are so wildly different is really challenging!

- [Async: Consolidate state machine cancellation handling between all backends](https://github.com/Pagghiu/SaneCppLibraries/commit/b9e466af) 

# Async Improvements

<a href="https://pagghiu.github.io/SaneCppLibraries/library_async.html">`SC::Async`</a> has been receiving some additional fine tuning reducing the size of all AsyncRequest, removing some common fields like eventIndex and event loop pointer.

`AsyncFileClose` and `AsyncSocketClose` have finally seen their return code moved to completion data and AsyncSocketConnect will stop its watcher in case of errors.

- [Async: Add method to create async UDP socket associated with event loop](https://github.com/Pagghiu/SaneCppLibraries/commit/10e409b4) 
- [Async: Avoid enabling Socket connect watcher on errors (Posix)](https://github.com/Pagghiu/SaneCppLibraries/commit/53e17bce) 
- [Socket: Add method to check SocketIPAddress validity](https://github.com/Pagghiu/SaneCppLibraries/commit/b9e0a77f) 
- [Async: Do not access request after completion unless it has been reactivated](https://github.com/Pagghiu/SaneCppLibraries/commit/f4b18d79) 
- [Async: Allow removing file / socket association with event loop](https://github.com/Pagghiu/SaneCppLibraries/commit/538f769a) 
- [Async: Move AsyncFileClose return code to completion data](https://github.com/Pagghiu/SaneCppLibraries/commit/a65f19f9) 
- [Async: Remove useless [[nodiscard]]](https://github.com/Pagghiu/SaneCppLibraries/commit/0e713590) 
- [Async: Split AsyncSocketAcceptData out of AsyncSocketAccept](https://github.com/Pagghiu/SaneCppLibraries/commit/5aad3aa6) 
- [Async: Declare per-request debug name only when SC_ASYNC_ENABLE_LOG is defined](https://github.com/Pagghiu/SaneCppLibraries/commit/6c98c709) 
- [Async: Remove pointer to event loop inside async requests](https://github.com/Pagghiu/SaneCppLibraries/commit/46543ed5) 
- [Async: Store 2 bytes of user flags in AsyncRequest](https://github.com/Pagghiu/SaneCppLibraries/commit/6425ccb1) 
- [Async: Do not store event index per each request](https://github.com/Pagghiu/SaneCppLibraries/commit/fb27bfa7) 
- [Async: Migrate code to completion data in AsyncSocketClose](https://github.com/Pagghiu/SaneCppLibraries/commit/ed75c2db) 
