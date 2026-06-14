Title: 🌫️ Sane C++ November 24
Date: 2024-11-30
Category: SaneCppLibraries
Template: article_sanecpp
Image: 2024-11-30-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2024-11-30-SaneCppLibrariesUpdate
Summary: Welcome to the update post for November 2024! <br> Main focus of the month is the addition of Async Streams!  

<aside id="table-of-contents">
    <nav class="is-sticky-above-lg ">
    <details open="">
        <summary>Content</summary>
        <ul>
        <li><a class="secondary" href="#section-0">Sane C++ November 2024</a></li>
        <li><a class="secondary" href="#section-1">SC::AsyncStreams</a></li>
        <li><a class="secondary" href="#section-2">Additional fixes</a></li>
        </ul>
    </details>
    </nav>
</aside>
<div id="content" role="document">

<section>
<h2>SC::AsyncStreams<a href="#section-1" id="section-1" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">Pushing it forward</p>
<p>
The <a href="https://pagghiu.github.io/SaneCppLibraries/library_async_streams.html" target="_new"><code>SC::Async</code></a> library has been extended with the addition of <a href="https://pagghiu.github.io/SaneCppLibraries/library_async_streams.html" target="_new">SC::AsyncStreams</a>!<br>
Async Streams are largely inspired by <a href="https://nodejs.org/api/stream.html" target="_new">node.js Streams</a>, a very powerful tool to process large amounts of data in parallel.<br>
The basic idea about an async stream is to create a Source / Sink abstraction (also called Readable and Writable) and process small buffers of data at time.<br>
The state machine that coordinates this interaction handles data buffering and more importantly handles also back-pressure, that means:
<ul>
<li><b>Pausing</b> the readable stream when a connected writable stream cannot process data fast enough</li>
<li><b>Resuming</b> the readable stream when a connected writable stream is finally able to receive more data</li>
</ul>
By implementing streams on top of async operations it's possible to run many of them concurrently very efficiently.<br>
When properly implemented for example an async pipeline can concurrently read from disk, write to a socket while compressing data.<br>
For now only Readable / Writable File and Socket streams have been implemented, but Async Transform Streams (for compression) will be next!<br>

Most notable differences with node.js streams are for now:
<ul>
<li>No allocation (designed to work inside user-provided list of buffers)</li>
<li>No object mode</li>
<li>Fixed Layout to create data pipelines (<code>AsyncPipeline</code>)</li>
<li><code>onData</code> support only (no <code>readable</code> event)</li>
</ul>

<code>Async Streams</code> are for now in 🟥 Draft state.
It's also possible that its API will evolve a little bit to be less verbose and there is also lack of nice examples, aside from the tests.<br>
It's better waiting for it to become stable before doing anything significant with it.<br>
Some changes and fixes in the <a href="https://pagghiu.github.io/SaneCppLibraries/library_async_streams.html" target="_new"><code>SC::Async</code></a> library
have been made necessary to support Async Streams.
<br><br>
This is the list of related commits:
<ul>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/339f291e" target="_new">Async: Add AsyncReadableStream</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/11a2b925" target="_new">Async: Add AsyncWritableStream</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/9d9d550b" target="_new">Async: Draft AsyncPipeline and AsyncRequest{Readable | Writable} Stream</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/fc97464e" target="_new">Async: Extend AsyncRequest{Readable | Writable}Stream to Socket Send/Receive</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/46174b02" target="_new">Async: Make AsyncPipeline and AsyncRequest{Readable | Writable}Stream public</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/15ec1855" target="_new">Async: Make AsyncSocket{Send | Receive} buffer and handle public</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/a6bdc110" target="_new">Async: Rename AsyncPipeline::Sink to AsyncPipeline::Pipe</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/3c780170" target="_new">Async: Reorganize AsyncTest for clarity</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/c251205c" target="_new">Async: Use offsets only if explicitly set in AsyncFile{Read | Write}</a></li>
</ul>
</p>
</section>

<section>
<h2>Additional fixes<a href="#section-2" id="section-2" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">Fix fix fix</p>
<p>
    
And just like every update, a bunch of fixes and improvements to all libraries have been committed.
Nothing specific stands out this update, but for completeness this is the list of related commits:          
<ul>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/9347ca62" target="_new">Build: Bypass VMWare hgfs issue setting wrong modified time for new files</a> </li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/a075702d" target="_new">Build: Support linking system libraries in XCode</a> </li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/a572d897" target="_new">Containers: Fix compile errors under latest MSVC</a> </li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/ee4947b2" target="_new">Documentation: Enable warnings as errors</a> </li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/596f0523" target="_new">Documentation: Update README.md with latest videos</a> </li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/b0778887" target="_new">Foundation: Add equality operator to Function</a> </li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/0ad81879" target="_new">Foundation: Add HeapBuffer</a> </li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/c750871f" target="_new">Foundation: Add Span::equals</a> </li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/7f08864b" target="_new">Foundation: Add Span::get(int)</a> </li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/14f37f58" target="_new">Foundation: Add StrongID</a> </li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/e80edc21" target="_new">Hashing: Improve documentation</a> </li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/23e7b37b" target="_new">Meta: Ignore sync folder and icon files</a> </li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/fa9a48cb" target="_new">Tools: Rebuild bootstrap when make fails</a> </li>

</ul>          
</p>
</section>

