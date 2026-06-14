Title: ☀️ Sane C++ June 24
Date: 2024-06-30
Category: SaneCppLibraries
Template: article_sanecpp
Image: 2024-06-30-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2024-06-30-SaneCppLibrariesUpdate
Summary: Welcome to the Sane C++ Libraries June 2024 update post!<br> The month has been spent mainly building SCExample, a small GUI example app to showcase some Libraries (mainly <code>SC::Async</code> / <code>SC::Plugin</code> / <code>SC::FileSystemWatcher</code>).


<aside id="table-of-contents">
<nav class="is-sticky-above-lg ">
<details open="">
<summary>Content</summary>
<ul>
<li><a class="secondary" href="#section-0">Sane C++ June 2024</a></li>
<li><a class="secondary" href="#section-1">SCExample</a></li>
<li><a class="secondary" href="#section-2">SC::Async</a></li>
<li><a class="secondary" href="#section-3">SC::Plugin</a></li>
<li><a class="secondary" href="#section-4">SC::FileSystemWatcher</a></li>
<li><a class="secondary" href="#section-5">SC::Build</a></li>
<li><a class="secondary" href="#section-6">Additional fixes</a></li>
</ul>
</details>
</nav>
</aside>
<div id="content" role="document">

<section>
<h2>SCExample<a href="#section-1" id="section-1" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">Always give a good example</p>
<p>
SCExample is a small GUI application based on sokol_app / sokol_gfx libraries, providing window abstraction and graphics api abstraction and dear-imgui for the UI.

<iframe width="700" height="400" src="https://github.com/Pagghiu/SaneCppLibraries/assets/5406873/4ad12058-6bc2-4316-90f8-4ba4c05e28de" frameborder="0" allowfullscreen>
</iframe>

Building this application has been mostly documented in the following YouTube videos:

<p>
First step has been putting together a pure cross platform GUI application (win/linux/macos), making sure to pause the render loop in absence of user inputs:<br>
<iframe width="560" height="314" src="https://www.youtube-nocookie.com/embed/4acqdGcUQnE?si=vyQhUZ_vU5Rtn0pi"
title="YouTube video player" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>  
</p>


<p>
Second step has been integrating the GUI event loop with the SC::Async I/O library (always cross-platform).<br>
<iframe width="560" height="314" src="https://www.youtube-nocookie.com/embed/z7QaTa7drFo?si=vyQhUZ_vU5Rtn0pi"
title="YouTube video player" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>  
</p>


<p>
And lastly showcasing the integration of SC::FileSystemWatcher and SC::Plugin to watch source files that are being hot-reloaded as plugins (dynamic libraries).<br>
Also in this case the cross-platform aspect has been preserved.<br>
<iframe width="560" height="314" src="https://www.youtube-nocookie.com/embed/BXybEWvSpGU?si=vyQhUZ_vU5Rtn0pi"
title="YouTube video player" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>  
</p>

This is the list of SCExample related commits:
<ul>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/6f29135e" target="_new">SCExample: Create (sokol+dear imgui) app re-drawing on user input only</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/4c72b42e" target="_new">SCExample: Display number of reloads and last load time of hot-reloaded plugins</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/96e6df4b" target="_new">SCExample: Implement simple hot-reload to showcase Plugin and FileSystemWatcher libraries</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/5be2d020" target="_new">SCExample: Integrate SC::AsyncEventLoop by using SC::AsyncEventLoopMonitor</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/947f8a7f" target="_new">SCExample: Transform floating window into a toolbar</a></li>
</ul>
</p>
</section>


<section>
<h2>SC::Async<a href="#section-2" id="section-2" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">A single event loop is never enough</p>
<p>

A small but useful addition to the <code><a href="https://pagghiu.github.io/SaneCppLibraries/library_async.html" target="_blank">SC::Async</a></code> library has been the <code>SC::AsyncEventLoopMonitor</code> class.
This class wraps most of the required machinery to integrate <code>SC::Async</code> event loop in an application that has a different main event loop (GUI or IO)

<ul>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/784ffcf7" target="_new">Async: Add AsyncEventLoopMonitor to poll the event loop from a background thread</a></li>
</ul>


</p>
</section>


<section>
<h2>SC::Plugin<a href="#section-3" id="section-3" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">Hot-Reload like there is no tomorrow</p>
<p>

<code><a href="https://pagghiu.github.io/SaneCppLibraries/library_plugin.html" target="_blank">SC::Plugin</a></code>  library has been receiving some love, with the addition of a queryInterface-like mechanism helping to define contracts between plugins and the host application.

It's possible to control linking libc / libc++, adding some custom include directories and disabling exceptions.
SC::Plugin now monitors <code>CFLAGS</code> and <code>LDFLAGS</code> environment variables (if defined) of the host environment, to allow linking the correct sysroot on posix systems.
Some fixes too have been needed on macOS where duplicated plugin symbols from different compiled <code>.dylibs</code> can wrongly increment their refcount, preventing from unloading them.

<ul>

<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/d6816b1d" target="_new">Plugin: Add PluginCompilerEnvironment to intercept and use CFLAGS and LDFLAGS</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/94ad0d95" target="_new">Plugin: Add PluginDynamicLibrary::queryInterface</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/efc48639" target="_new">Plugin: Add PluginSysroot and build options to allow linking libc and libc</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/64ee7266" target="_new">Plugin: Allow multiple include paths</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/9466040a" target="_new">Plugin: Change appendDefinitions into replaceDefinitions</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/72354c8f" target="_new">Plugin: Disable exceptions under MSVC</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/8ad2aca3" target="_new">Plugin: Hide Plugin symbols by default on macOS</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/f7dfa225" target="_new">Plugin: Track number of reloads and last load time for all plugins</a></li>


</ul>


</p>
</section>



<section>
<h2>SC::FileSystemWatcher<a href="#section-4" id="section-4" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">Make it actually usable</p>
<p>

Using <code><a href="https://pagghiu.github.io/SaneCppLibraries/library_filesystemwatcher.html" target="_blank">SC::FileSystemWatcher</a></code> 
inside SC::Example has exposed some usability issues and bugs (mainly repeated notifications), that have been promptly fixed.


<ul>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/05c0edd0" target="_new">FileSystemWatcher: Filter repeated notifications on macOS</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/ffada009" target="_new">FileSystemWatcher: Improve API usability </a></li>

</ul>


</p>
</section>


<section>
<h2>SC::Build<a href="#section-5" id="section-5" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">Spaces and GUI Apps</p>
<p>


<code><a href="https://pagghiu.github.io/SaneCppLibraries/library_build.html" target="_blank">SC::Build</a></code> 
can now generate Xcode projects for gui applications creating app bundles on macOS for the Xcode backend.
The configure phase will download required dependencies (like sokol or dear-imgui for SCExample).
This is not ideal as it requires internet connection, so it will be probably be made optional in some future update.

It can now build from paths with spaces (even when using the Makefile backend...) and generates Xcode projects avoiding any warning.
Some of the fixes have ramifications also on the SC::Tools that bootstraps SC::Build.


<ul>

<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/2be7d392" target="_new">Build: Collapse all non-apple TARGET_OS to just linux</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/931fe7c0" target="_new">Build: Escape quotes in Make and Xcode backends</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/df3eae83" target="_new">Build: Fix generation of compile_commands.json file</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/e6acc3d0" target="_new">Build: Fix Makefile force clean on platform specific makefiles</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/b2252911" target="_new">Build: Generate makefiles supporting building from paths with spaces</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/f711566e" target="_new">Build: Improve Xcode generator not to produce warnings under Xcode 15</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/0214cdb7" target="_new">Build: Support creating app bundles on Xcode</a></li>

<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/b2e3cef0" target="_new">Tools: Improve Makefile</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/0b802ba2" target="_new">Tools: Support building a tool from path containing spaces</a></li>

</ul>


</p>
</section>



<section>
<h2>Additional fixes<a href="#section-6" id="section-6" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">Fix fix fix</p>
<p>



And just like every month, working on SCExample has generated a number of minor fixes, API improvements / refactoring.<br>
All of them have been proudly committed to the main branch!


<ul>

<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/30f07bd1" target="_new">Containers: Fix bug in VectorMap::remove</a></li>

<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/03b81f67" target="_new">FileSystem: Add writeStringAppend</a></li>

<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/95d90abc" target="_new">Foundation: Add Host Operating System detection</a></li>

<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/4d9d9ae4" target="_new">Process: Avoid creating windows when spawning a new process</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/a7859c5c" target="_new">Process: Improve ProcessTest compatibility</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/03cd51dd" target="_new">Process: Rename StringsTable to StringsArena</a></li>

<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/1f332027" target="_new">Reflection: Disable SC_REFLECT_AUTOMATIC on older clang versions</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/a9412644" target="_new">Reflection: Fix compile error due to a GCC bug</a></li>

<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/e230df7b" target="_new">Strings: Add StringHashFNV</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/1c0fd898" target="_new">Strings: Do not let StringBuilder leave unterminated string when format fails</a></li>

<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/fd246950" target="_new">Time: Make HighResolutionCounter::snap return reference to HighResolutionCounter itself</a></li>

<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/1b50cb3b" target="_new">Documentation: Add SCExample to the Examples page</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/32181ff8" target="_new">Documentation: Update README with latest video</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/07591f19" target="_new">Documentation: Update README with May 2024 blog post</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/476fbf88" target="_new">Documentation: Update SCExample documentation</a></li>



</ul>


</p>
</section>

</div>