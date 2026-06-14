Title: 🌸 Sane C++ May 24
Date: 2024-05-31
Category: SaneCppLibraries
Template: article_sanecpp
Image: 2024-05-31-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2024-05-31-SaneCppLibrariesUpdate
Summary: Welcome to the Sane C++ Libraries May 2024 update post!<br> No big feature has been added this month, so this is a month a bugfixes and incremental improvements.

<aside id="table-of-contents">
<nav class="is-sticky-above-lg ">
<details open="">
<summary>Content</summary>
<ul>
<li><a class="secondary" href="#section-0">Sane C++ May 2024</a></li>
<li><a class="secondary" href="#section-1">SC::Async</a></li>
<li><a class="secondary" href="#section-2">SC::Build</a></li>
<li><a class="secondary" href="#section-3">GitHub CI</a></li>
<li><a class="secondary" href="#section-4">SC::Socket</a></li>
<li><a class="secondary" href="#section-5">First contribution!</a></li>
<li><a class="secondary" href="#section-6">Additional fixes</a></li>
</ul>
</details>
</nav>
</aside>
<div id="content" role="document">
<section>
<h2>SC::Async<a href="#section-1" id="section-1" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">Fine tuning</p>
<p>
<code><a href="https://pagghiu.github.io/SaneCppLibraries/library_async.html" target="_blank">SC::Async</a></code>
Library has been receiving some fixes and an useful refactoring.
</p>
<p>
<code>AsyncEventLoop::runOnce</code> has been split into three methods, separating: 
<ul>

<li>request submission</li>
<li> polling for new events</li>
<li> completion callbacks dispatch</li>
</ul>
This allows submitting request from a "main" thread, that already has an event loop, 
blocking to poll for changes on a separate thread, and dispatching the callbacks for events received again on the same thread used for submission.
<br>
The main use of this would be integrating an AsyncEventLoop with another event loop from another library that already "owns" the application main thread, including a GUI event loop.
<br>
This refactoring has been recorded in a video
<iframe width="560" height="314" src="https://www.youtube-nocookie.com/embed/3lbyx11qDxM?si=vyQhUZ_vU5Rtn0pi"
title="YouTube video player" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>  
</p>
<p>
Relevant commits:
<ul>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/0526b5c"> Async: Split runOnce into submitRequests, blockingPoll and dispatchCompletions</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/069b4bd"> Async: More precise handling of GetQueuedCompletionStatusEx on Windows 10</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/138d1d8"> Async: Allow re-activation of AsyncLoopTimeout</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/3d48f77"> Async: Add ReactivateAsyncPhase to allow skipping submission on reactivation</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/af1e0f0"> Async: Hide KernelQueue and KernelEvents inside Internal</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/b7623c5"> Async: Handle different GetQueuedCompletionStatusEx behavior on Windows 10</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/e6a5704"> Async: Update time consistently both in NoWait and ForcedForwardProgress modes</a></li>
</ul>
</p>
</section>
<section>
<h2>SC::Build<a href="#section-2" id="section-2" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">Handmade toy build system generator grows</p>
<p>

<code><a href="https://pagghiu.github.io/SaneCppLibraries/library_build.html" target="_blank">SC::Build</a></code> Library 
has also been receiving some love, increasing its capability while simplifying <code>SC-build.cpp</code> scripts:

<ul>
<li>Support generating VS2019 projects (needed by the Windows10 Github runner)</li>
<li>Support Objective-C or Objective-C++ files</li>
<li>Support generating multiple projects</li>
<li>Support libraries to link (Makefile backend)</li>
<li>Support creating non-console applications (Windows)</li>
<li>Consistently handle all paths (include, libraries etc) as relative to project root</li>
</ul>
</p>

<p>
Relevant commits:
<ul>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/2860888"> Build: Generate one solution per project on Visual Studio backend</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/2d63b73"> Build: Specify target name when invoking Makefile</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/35f5fc5"> Build: Avoid Makefile warnings on intermediates and outputs directory creation</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/5879951"> Build: Support Objective-C and Objective-C++ files</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/9f195b3"> Build: Generate platform specific Makefile</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/a123422"> Build: Express absolute include paths as relative to project dir</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/ad9f0ee"> Build: Add flag to generate Visual Studio projects using Windows subsystem</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/b90f05c"> Build: Allow selecting target for compile, build or run action</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/c9dd352"> Build: Simplify SC-Build with more defaults</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/cab21d6"> Build: Support link libraries on Makefile backend</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/df488cd"> Build: Simplify usage of relative paths in includes and defines</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/f0b3043"> Build: Add basic multi-projects support</a></li>
</ul>

</p>
</section>

<section>
<h2>GitHub CI<a href="#section-3" id="section-3" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">because a good and lean CI keeps you healthy</p>
<p> 
The GitHub CI has been simplified, consisting now of three github workflow files:
<ul>
<li>windows (windows 10 + windows 11)</li>
<li>posix (linux + macOS)</li>
<li>documentation and coverage (macOS)</li>
</ul>
</p>
<p>
The GitHub CI matrix feature has been used to test multiple platforms and configurations.
On all platforms both Debug and Release configurations are now being tested.
Additionally also Windows 10 has been added to the list of platform tested by the CI.
</p>
<p>
Relevant Commits:
<ul>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/04123ab">CI: Skip documentation deployment step outside of forks</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/097d01d">CI: Merge Linux and macOS into a posix runner</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/9a4d1f2">CI: Run GitHub workflows only on main branch</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/b59a345">CI: Fix windows pipeline</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/cdd5e3a">CI: Run the tests on Windows 10 and Windows 11 both in Debug and Release</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/f8067a8">CI: Set GitHub workflow badges to the correct URL</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/fd1dc37">CI: Skip documentation deployment step on forks</a></li>
</ul>
</p>
</section>

<section>
<h2>SC::Socket<a href="#section-4" id="section-4" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">Sockets keep your feet warm</p>

<p>
<code>
<a href="https://github.com/Pagghiu/SaneCppLibraries/library_socket.html" target="_blank">
SC::Socket
</a></code> library has been cleaned up, after some "encouragement" given in a issue that was trying to expand UDP support.
</p>

<p>
Relevant commits:
<ul>

<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/645dae9"> Socket: Move examples from header to snippets</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/9755163"> Socket: Move SocketNetworking::resolveDNS into its own SocketDNS class</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/befe282"> Socket: Require a valid socket for both SocketClient::connect overloads</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/cf3034e"> Socket: Split SocketServer::bind out of SocketServer::listen to allow creating UDP servers</a></li>

</ul>
</p>
</section>

<section>
<h2>First contribution!<a href="#section-5" id="section-5" class="secondary" tabindex="-1">#</a></h2>

<p>

First contributor of the project has appeared!<br>
Thanks to <a href="https://github.com/Pagghiu/SaneCppLibraries/pull/18" target="_blank"> this contributor PR</a> now both Tools and Plugin 
will work even if visual studio is installed in a directory different from default!
</p>
<p>
More importantly the entire <a href="https://github.com/Pagghiu/SaneCppLibraries/blob/main/CONTRIBUTING.md" target="_blank" >CONTRIBUTING.md</a> guide has been validated 
and this also proves that <code>SC::Tools</code> and the GitHub CI have been doing their job just fine!
</p>

<ul>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/89a3518"> Plugin: Detect Visual Studio path dynamically</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/978cc4c"> Tools: Update 7-zip to 24.05</a></li>  
</ul>
</section>

<section>
<h2>Additional fixes<a href="#section-6" id="section-6" class="secondary" tabindex="-1">#</a></h2>


An <a href="https://github.com/Pagghiu/SaneCppLibraries/issues/17" target="_blank">issue</a> has been reported when mixing Sane C++ Libraries with C++ Standard Library on Linux and they've been fixed as well.
<ul>

<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/98e7310"> Foundation: Just include <memory.h> if SC_COMPILER_ENABLE_STD_CPP is defined or exceptions are used</a></li>

And then just a usual bunch of fixes and minor additions.
<ul>

<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/036c5c4"> Documentation: Update README with latest video</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/0f1cd95"> Documentation: Improve commit message format and squashing sections</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/940b780"> Everywhere: Support Visual Studio 2019</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/f37c814"> Everywhere: Fix ClangCL build</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/1d0271c"> FileSystem: Fix Path::relativeFromTo</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/fde2d97"> Foundation: Allow passing arbitrary number of arguments to placement new</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/f86ce3d"> Strings: Add String::owns</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/75819d5"> Time: Add operator < and > to Milliseconds and HighResolutionCounter::getRelative</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/40341b4"> Tools: Escape path for the .touched file in the NMAKE Windows bootstrap</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/d30163d"> Tools: Use just commit hash for SC-Package when cloning git repos</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/d47e439"> Tools: Fix HEAD casing for "git rev-parse" used by SC-Package</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/d4ce9c3"> Tools: Automatically retry building a tool on make failure</a></li>
</ul>
</section>
</div>