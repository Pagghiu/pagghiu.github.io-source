Title: 🎠 Sane C++ February 24
Date: 2024-02-23
Category: SaneCppLibraries
Template: article_sanecpp
Image: 2024-02-23-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2024-02-23-SaneCppLibrariesUpdate
Summary: Two months have passed since the <a href="2023-12-23-SaneCppLibrariesRelease.html">initial release of Sane C++ Libraries</a>! 🎉🎉🎉<br> This post collects all relevant events happened during the second month of (public) life of the project.

<aside id="table-of-contents">
<nav class="is-sticky-above-lg ">
<details open="">
<summary>Content</summary>
<ul>
<li><a class="secondary" href="#section-0">Sane C++ February 2024</a></li>
<li><a class="secondary" href="#section-1">Code</a></li>
<li><a class="secondary" href="#section-2">Github Releases</a></li>
<li><a class="secondary" href="#section-3">Hacker News</a></li>
<li><a class="secondary" href="#section-4">Github</a></li>
<li><a class="secondary" href="#section-5">YouTube</a></li>
</ul>
</details>
</nav>
</aside>
<div id="content" role="document">
<section>
<article>
<h2>Code<a href="#section-1" id="section-1" class="secondary" tabindex="-1">#</a></h2>
Code is always the most important news!👨🏻‍💻<br>
Continuing giving Linux some love!! 🐧
<br>
<br>
✅ <a href="https://pagghiu.github.io/SaneCppLibraries/library_async.html" target="_blank">SC::Async</a> got an
<code>io_uring</code> Linux backend!<br>
✅ <a href="https://pagghiu.github.io/SaneCppLibraries/library_async.html" target="_blank">SC::Async</a>
<code>epoll</code> backend got simplified <br>
✅ <a href="https://pagghiu.github.io/SaneCppLibraries/library_async.html" target="_blank">SC::Async</a> now
tracks all active requests to mark them as free on a sudden close requests. <br>
✅ <a href="https://pagghiu.github.io/SaneCppLibraries/library_async.html" target="_blank">SC::Async</a> got
all private implementation details hidden under a compiler firewall<br>
✅ <a href="https://pagghiu.github.io/SaneCppLibraries/library_async.html" target="_blank">SC::Async</a> can
now use <code>SC::ThreadPool</code> to run some async ops<br>
✅ <a href="https://pagghiu.github.io/SaneCppLibraries/library_async.html" target="_blank">SC::Async</a>
<code>AsyncFileRead</code> / <code>AsyncFileWrite</code> are now fully async also on buffered files <br>
✅ <a href="https://pagghiu.github.io/SaneCppLibraries/library_threading.html"
target="_blank">SC::ThreadPool</a> has been added, to allow running tasks in background<br>
✅ Got CI building and running tests on Windows, Linux and macOS (using Github Actions).<br>
✅ The CI also enforces proper formatting through clang-format.<br>
✅ Fixed a few UB and leaks signaled by gcc UBSAN and LSAN on Linux.<br>
✅ Improved documentation for <a href="https://pagghiu.github.io/SaneCppLibraries/page_building_user.html"
target="_blank">Building as an User</a> vs
<a href="https://pagghiu.github.io/SaneCppLibraries/page_building_contributor.html">Building as a
contributor</a><br>

<h2>Github Releases<a href="#section-2" id="section-2" class="secondary" tabindex="-1">#</a></h2>
I have started creating Github <a href="https://github.com/Pagghiu/SaneCppLibraries/releases"
target="_blank">releases</a> tagged with each month. <br>
I'm not planning to do semantic versioning for now, just sticking to <i>year-month</i> release tagging.
<p>
<ul>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/releases/tag/release%2F2024%2F02"
target="_blank">February 2024
Release</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/releases/tag/release%2F2024%2F01"
target="_blank">January 2024
Release</a></li>
</ul>
</p>
<h2>Hacker News<a href="#section-3" id="section-3" class="secondary" tabindex="-1">#</a></h2>
The Library has been <a href="https://news.ycombinator.com/item?id=39159153">posted to Hacker News</a>
bringing some visibility on the project for a few hours.
The discussions / comments are also quite interesting, sparkled by the many opinionated and strong decisions /
principles of the library.<br>
I've tried answering some of the posts, and it has been fun honestly 😁.<br>
Some themes:<br>
<ul>
<li>You shouldn't be writing C++ libraries without the standard library / exceptions / smart pointers</li>
<li>Qt / POCO exists and provides everything you need</li>
<li>Writing Builds in C++ is not Sane</li>
<li>You should implement all containers that exists in the STL</li>
</ul>
My favorite comment is <a href="https://news.ycombinator.com/item?id=39161028"> this one</a>:
<figure>
<img src="{attach}/images/2024-02-23-SaneCppLibrariesUpdate/HackerNewsComment.jpg">
</figure>
<h2>Github<a href="#section-4" id="section-4" class="secondary" tabindex="-1">#</a></h2>
<p>
As of today, the Sane C++ Libraries has got 419 ⭐️ stars ⭐️ on <a
href="https://github.com/pagghiu/SaneCppLibraries" target="_blank">Github</a>
(<a href="https://github.com/pagghiu/SaneCppLibraries"><img
src="https://img.shields.io/github/stars/Pagghiu/SaneCppLibraries"></a>).<br>
A big jump from the 187 stars of last month!<br>
A big step has been due to the hacker news post, but in the subsequent weeks there has been a steady
and horganic increase, hopefully meaning that more people are finding something interesting in the project.
</p>

<h2>YouTube <a href="#section-5" id="section-5" class="secondary" tabindex="-1">#</a></h2>
<p>
I have been producing 5 videos explaining some of the design decisions around the <a
href="https://pagghiu.github.io/SaneCppLibraries/library_async.html" target="_blank">SC::Async</a>
library, the addition of <code>io_uring</code> to it, the creation of <a
href="https://pagghiu.github.io/SaneCppLibraries/library_threading.html"
target="_blank">SC::ThreadPool</a> and how it has been used to do proper Async File I/O also for buffered
files (that always act synchronously under most async APIs, excluding <code>io_uring</code>...)
</p>
<iframe width="280" height="157" src="https://www.youtube-nocookie.com/embed/pIGosb2D2Ro?si=vyQhUZ_vU5Rtn0pi"
title="YouTube video player" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>

<iframe width="280" height="157" src="https://www.youtube-nocookie.com/embed/YR935rorb3E?si=vyQhUZ_vU5Rtn0pi"
title="YouTube video player" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>

<iframe width="280" height="157" src="https://www.youtube-nocookie.com/embed/CgYE0YrpHt0?si=vyQhUZ_vU5Rtn0pi"
title="YouTube video player" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>

<iframe width="280" height="157" src="https://www.youtube-nocookie.com/embed/e48ruImESxI?si=vyQhUZ_vU5Rtn0pi"
title="YouTube video player" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>

<iframe width="280" height="157" src="https://www.youtube-nocookie.com/embed/WF9beKyEA_E?si=vyQhUZ_vU5Rtn0pi"
title="YouTube video player" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>

<h2>Next<a href="#section-1" id="section-4" class="secondary" tabindex="-1">#</a></h2>
So what's next?<br>
I'm not really sure. One thing I would like to experiment with is a <a href="https://github.com/nothings/stb"
target="_blank">stb style</a> wrapper for some of the libraries, to make them usable from C.
<br>
Thank you for reading this far!<br><br>
Bye!👋🏼<br>
Pagghiu
</article>

</section>
</div>