Title: 💤 Sane C++ April 24
Date: 2024-04-27
Category: SaneCppLibraries
Template: article_sanecpp
Image: 2024-04-27-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2024-04-27-SaneCppLibrariesUpdate
Summary: Here we are with the forth monthly update for Sane C++ Libraries!

<aside id="table-of-contents">
<nav class="is-sticky-above-lg ">
<details open="">
<summary>Content</summary>
<ul>
<li><a class="secondary" href="#section-0">Sane C++ April 2024</a></li>
<li><a class="secondary" href="#section-1">Coverage and Documentation</a></li>
<li><a class="secondary" href="#section-2">SC::AsyncLoopWork</a></li>
<li><a class="secondary" href="#section-3">C bindings</a></li>
<li><a class="secondary" href="#section-4">SC::Process</a></li>
<li><a class="secondary" href="#section-5">Improvements to the Library</a></li>
</ul>
</details>
</nav>
</aside>
<div id="content" role="document">
<section>
<h2>SC::AsyncLoopWork<a href="#section-2" id="section-2" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">Executing background work with notification on event loop</p>
<p>
<code><a href="https://pagghiu.github.io/SaneCppLibraries/library_async.html" target="_blank">SC::Async</a></code>
has gained the new
<code><a href="https://pagghiu.github.io/SaneCppLibraries/struct_s_c_1_1_async_loop_work.html#details" target="_blank">SC::AsyncLoopWork</a></code>
type, that allows executing blocking work in background thread, with an "after work" notification callback
called on the event loop itself.
This second notification callback can be used to update GUI or to safely modify some global state without
needing mutexes.
<code>SC::AsyncLoopWork</code> is a generalization of the system used to execute file operations on thread
pool, extending it to any arbitrary blocking operation.
</p>
<p>
The addition of <code>SC::AsyncLoopWork</code> has been recorded in a video.
<iframe width="560" height="314" src="https://www.youtube-nocookie.com/embed/huavEjzflHQ?si=vyQhUZ_vU5Rtn0pi"
title="YouTube video player" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>  
</p>
<p>
Relevant commits:
<ul>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/4ab30f5" target="_blank">Async: Add
AsyncLoopWork to execute
callbacks in background threads on the EventLoop</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/c7870cd" target="_blank">Async: Add atomic
pending flags to
avoid multiple invocations of wakeup in the same loop iteration</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/bee5228" target="_blank">Async: Clarify
condition where
getNumberofActiveHandle() can become negative</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/79fdec0" target="_blank">Async: Refactoring
AsyncTask to embed
ThreadPoolTask</a></li>
</ul>
</p>
</section>
<section>
<h2>Coverage and Documentation<a href="#section-1" id="section-1" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">Automation for GitHub CI</p>
<p>
GitHub CI scripts are now able to generate test coverage reports and documentation.
In line with the spirit of the project, both features have been added to
<code><a href="https://pagghiu.github.io/SaneCppLibraries/page_tools.html" target="_blank">SC::Tools</a></code>,
avoiding any shell scripting or use of other languages.
This means that they've been written in C++, using Sane C++ libraries to execute FileSystem operations, spawn
processes and <code>SC::Package</code> to download and extract binary dependencies.
</p>
<p>
<a href="{attach}/images/2024-04-27-SaneCppLibrariesUpdate/coverage_badge.png" target="_blank">
<img src="{attach}/images/2024-04-27-SaneCppLibrariesUpdate/coverage_badge.png">
</a>
</p>
<p>
<a href="{attach}/images/2024-04-27-SaneCppLibrariesUpdate/coverage_report.png" target="_blank">
<img src="{attach}/images/2024-04-27-SaneCppLibrariesUpdate/coverage_report.png">
</a>
</p>
<p>
<ul>
<li><code>SC build coverage</code> generates the coverage report using clang source based coverage (and a SVG
badge).</li>
<li><code>SC build documentation</code> generates documentation using doxygen.</li>
</ul>
Both actions are executed in sequence in the same CI job and automatically deployed to GitHub pages.
<br>
This means that the entire <a href="https://pagghiu.github.io/SaneCppLibraries" target="_blank">Documentation Website</a> 
is now automatically built and deployed on every commit to main!
</p>
<p>
<a href="{attach}/images/2024-04-27-SaneCppLibrariesUpdate/coverage_tasks.png" target="_blank">
<img src="{attach}/images/2024-04-27-SaneCppLibrariesUpdate/coverage_tasks.png">
</a>
</p>

<p>
Relevant commits:
<ul>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/92660cb" target="_blank">Tools: Add build
coverage</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/b654096" target="_blank">Tools: Add build
documentation</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/ffe3d9b" target="_blank">Tools: Add build run
to
run default built target</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/2652e4c" target="_blank">Tools: Add the
-nostdlib++ flag to the bootstrap Makefile when
clang is detected</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/7713ea8" target="_blank">Tools: Fix incorrect
build coverage regex filter</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/588ef54" target="_blank">Tools: Return
errorlevel on Windows building the tool fails</a>
</li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/a9f21aa" target="_blank">Tools: Support build
documentation on Windows</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/05854a4" target="_blank">Tools: Track
dependencies properly also for NMAKE on
windows</a></li>

<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/82be102" target="_blank">Build: Add support
for
C source files</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/e395304" target="_blank">Build: Enable source
based coverage when under clang</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/d070d63" target="_blank">Build: Generate
coverage badge SVG</a></li>

<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/2f66257" target="_blank">CI: Automatically
build
and deploy documentation and code
coverage report</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/939e5d9" target="_blank">Coverage: Exclude
some
tests that cannot be run under
XCTest</a></li>
</ul>

</p>
</section>

<section>
<h2>C bindings<a href="#section-3" id="section-3" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">because Sane C++ libraries map to C really well</p>
<p>
Most Sane C++ Libraries have been designed to nicely map to a clean C-api.<br>
Time has come to start creating some C bindings, starting with the simplest one:
<code><a href="https://pagghiu.github.io/SaneCppLibraries/library_hashing.html">SC::Hashing</a></code>.<br>
<a href="https://pagghiu.github.io/SaneCppLibraries/group__group__sc__hashing.html#details"
target="_blank">This
is the result</a>.<br>
What library do you think should be the next?<br>
</p>
<p>
<a href="{attach}/images/2024-04-27-SaneCppLibrariesUpdate/sc_hashing.png" target="_blank">
<img src="{attach}/images/2024-04-27-SaneCppLibrariesUpdate/sc_hashing.png">
</a>
</p>
<p>
Relevant Commits:
<ul>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/91ac131" target="_blank"> Bindings: Add C
binding for
SC::Hashing (sc_hashing)</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/f4f9ffa" target="_blank"> Hashing: Improve
methods naming</a>
</li>
</ul>
</p>
</section>

<section>
<h2>SC::Process<a href="#section-4" id="section-4" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">Everyone loves child processes</p>

<p>
<code>
<a href="https://github.com/Pagghiu/SaneCppLibraries/library_process.html" target="_blank">
SC::Process
</a></code> library is getting more complete.<br>
This month it has been gaining ability to:
<ul>
<li>Set child process working directory</li>
<li>Set child process environment variables</li>
</ul>

<p>
<a href="{attach}/images/2024-04-27-SaneCppLibrariesUpdate/sc_process_environment.png" target="_blank">
<img src="{attach}/images/2024-04-27-SaneCppLibrariesUpdate/sc_process_environment.png">
</a>
</p>
Both options have been implemented on all supported platforms (windows/macOS/Linux).

</p>
<p>
Relevant commits:
<ul>

<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/ea5e2c0" target="_blank">Process: Add
Process::setWorkingDirectory</a>
</li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/4e38dea" target="_blank">Process: Allow
customizing child processes environment variables</a>
</li>
</ul>
</p>
</section>


<section>
<h2>Improvements to the Library<a href="#section-5" id="section-5" class="secondary" tabindex="-1">#</a></h2>

Some fixes and minor additions have been delivered too, improving the entire set of libraries.
<ul>

<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/1a2681b" target="_blank"> FileSystem: Fix
copyFile failing when trying to clone across devices</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/20dddb7" target="_blank"> FileSystem: Use File
library for file read and write</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/720a90f" target="_blank"> Foundation: Make min
and max arguments and return value references</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/f6a4ecf" target="_blank"> Strings: Add some
tests for StringView::fromNullTerminated</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/af1a68c" target="_blank"> Strings: Add
StringView::{splitAfter | trimWhiteSpaces} and StringViewTokenizer::tokenizeNextLine</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/62c7854" target="_blank"> Strings: Add
StringView::splitBefore</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/ddb2c27" target="_blank"> Strings: Make
StringViewTokenizer remaining StringView available as a field</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/0cf618a" target="_blank"> Testing: Add --quiet
switch and flags to execute sections only if explicitly requested</a></li>
</ul>

</section>
</div>
