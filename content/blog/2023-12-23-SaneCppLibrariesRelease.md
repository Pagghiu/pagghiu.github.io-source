Title: 🎉 Sane C++ Libraries
Date: 2023-12-23
Category: SaneCppLibraries
Template: article_sanecpp
Image: 2023-12-23-SaneCppLibrariesRelease/article.png
Slug: site/blog/2023-12-23-SaneCppLibrariesRelease
Summary: Let's go!

<aside id="table-of-contents">
<nav class="is-sticky-above-lg ">
<details open="">
<summary>Content</summary>
<ul>
<li><a class="secondary" href="#section-0">Sane C++ Release</a></li>
<li><a class="secondary" href="#section-1">Where do we start from?</a></li>
<li><a class="secondary" href="#section-2">Other languages and libraries</a></li>
<li><a class="secondary" href="#section-3">The holy <i>hidden subset</i> of C++</a></li>
<li><a class="secondary" href="#section-4">Defining the scope</a></li>
<li><a class="secondary" href="#section-5">Some rules</a></li>
<li><a class="secondary" href="#section-6">Dependencies</a></li>
<li><a class="secondary" href="#section-7">Maturity</a></li>
<li><a class="secondary" href="#section-8">Platforms</a></li>
<li><a class="secondary" href="#section-9">Licensing</a></li>
<li><a class="secondary" href="#section-10">Conclusions</a></li>
</ul>
</details>
</nav>
</aside>
<div id="content" role="document">
<section>
<article>
<h2>Where do we even start?<a href="#section-1" id="section-1" class="secondary" tabindex="-1">#</a></h2>
<p>
So...where do I even start? <br>
This is probably just an articulation of my multi-decade old opinion on
<code>How should C++ be written</code>&trade; that nobody has ever asked for 🤭.<br>
<iframe width="560" height="315"
src="https://www.youtube-nocookie.com/embed/5w1_rRXgyv0?si=vyQhUZ_vU5Rtn0pi" title="YouTube video player"
frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>

<h3>Modern C++ and Standard C++ Library</h3>
I find Modern C++ style problematic 😩, causing large increases in compile time and binary
size, frequent confusion caused to code completion engines, and micro-heap-allocations habits engraved in
a mountain of hard-to-understand code.<br>
Many of these (and other) problems are not easily avoidable when using the <i>Standard C++ Library</i>,
making it too easy descending into an endless hole of growing complexity.<br>

<h3>Handmade C</h3>
On the other side of the spectrum I observe so many <i>proudly handmade</i> developers sticking to C or
coming up with new languages sharing similar minimalistic spirit.<br>
I'm definitively more spiritually affine to readable and well written C 🧘🏻‍♂️, rather than Modern C++.<br>
I often feel however that such libraries are rare (<code>sqlite</code>, <code>sokol</code>,
<code>stb</code>, <code>raylib</code> etc.) and it takes a lot of discipline and experience to stick
successfully to such clean and coherent style.<br>
</p>

<h2>Other languages and libraries<a href="#section-2" id="section-2" class="secondary" tabindex="-1">#</a></h2>
<p>
Many programming languages come with a standard library designed to solve common user needs.<br>
That's not the case for C++ though, where any non trivial project will have to integrate
<i>third party libraries</i> to do anything significant.<br>
Integrating such libraries morphs C++ projects into a patchwork of incoherent programming styles,
as direct derivation of the subset of language features chosen by the authors.<br>
Sometimes these incoherences become actual bad practices producing hard to read and maintain code, bugs,
instabilities, inefficiencies and security issues.<br>
</p>

<h2>The holy <i>hidden subset</i> of C++<a href="#section-3" id="section-3" class="secondary" tabindex="-1">#</a></h2>
<p>
This project is a journey of defining and discovering a C++ subset that makes writing code with it enjoyable
😌.
Libraries should be working harmonically with each other while still making it possible to use them in
isolation or with minimum inter-dependencies.<br>
This holy hidden C++ subset should encourage writing readable programs that are efficient and fast to
compile while still being easy to develop / debug / deploy and reasonably safe on multiple platforms.<br>
The edit / recompile cycle should ideally be closer to the ones of <i>highly productive</i> languages
like Python and Javascript than the average C++ project / library.
</p>

<h2>Defining the scope<a href="#section-4" id="section-4" class="secondary" tabindex="-1">#</a></h2>
<p>
So what is the initial scope of the library?
<h3>Basic building blocks</h3>
The very first basic building blocks are a good API for: async IO / networking, file system and process
handling, serialization, text (with utf support), json and http.
<h3>Data structures and algorithms</h3>
Data structures and algorithms are for now secondary, but the library comes with a solid
<code>Vector T</code> implementation with support for custom inline storage
<code>SmallVector T, N</code>.
Proper arena allocation / release strategies will be explored too.
<h3>User Interfaces</h3>
User interfaces abstraction are excluded (for now).<br>
Once most of the libraries will be in <i>MVP</i> or <i>Stable</i> the topic will be revisited.
<h3>Integrations</h3>
It's very important showing how to integrate libraries inside such system specific GUI libraries /
toolkits.<br>
For example it could be not obvious how to properly integrate the Async IO event loop inside a GUI event
loop. Providing ready-made examples for such setups is going to be very useful to many users of the libraries.
<h3>Self-hosted build system</h3>
An optional to use build system, where build files are written in imperative C++ code (compiled on the fly) is
being worked on. The build system links the rest of library compiled as a single unity build.
</p>

<h2>Some rules<a href="#section-5" id="section-5" class="secondary" tabindex="-1">#</a></h2>
<p>
Some rules used in the project:
<ul>
<li>Libraries will not use C++ standard library at all.</li>
<li>Libraries will not need a build system to be integrated in existing projects.</li>
<li>Libraries will not increase build time when integrated into existing projects.</li>
<li>Libraries will compile free of warnings on all major C++ compilers (Clang, GCC, MSVC).</li>
<li>Libraries will try to avoid heap allocation and make efforts to let caller handle such memory.</li>
<li>Libraries will have proper tests and documentation.</li>
<li>Libraries will focus on common use cases rather than trying to cover every possible use case.</li>
</ul>
</p>

<h2>Dependencies<a href="#section-6" id="section-6" class="secondary" tabindex="-1">#</a></h2>
<p>
General advice is to avoid using 3rd party libraries as much as possible.<br>
<br>
There are some cases where it's simply unreasonable not using any third party library.<br>
Windows and macOS native APIs are being leveraged to avoid needing libraries (a good example is the
<code>Hashing</code> library).<br>
On Linux however some of these API are not part of the kernel, are typically part of user-space
libraries. Such libraries will need to be installed with <code>apt-get</code> or delivered by wrapping some
3rd party dependency.<br><br>

In any case if 3rd party libraries will be used, they will be made optional and properly wrapped in
a way that they will be an hidden implementation detail.<br>
Building the library will still not require a build system and it will still be fast to compile.<br>
No derogation will be made to these principles.
</p>

<h2>Maturity<a href="#section-7" id="section-7" class="secondary" tabindex="-1">#</a></h2>
<p>
The project is being open-sourced in its very early stages.<br>
Libraries have different level of maturity, stated in the documentations with a brief roadmap.<br>
As of today, when this post is written, they're mostly in <i>Draft</i> or <i>MVP</i> state.<br>
No guarantee is being done for API stability too for now.
</p>

<h2>Platforms<a href="#section-8" id="section-8" class="secondary" tabindex="-1">#</a></h2>
<p>
Initially, the only supported platforms are macOS and Windows.<br>
A partial port to Emscripten / WebAssembly is also being worked on.<br>
Linux support is one explicit bullet point in the roadmap of all libraries that use OS specific API.<br>
Compatibility on iOS will be explored too.<br>
</p>

<h2>Licensing<a href="#section-9" id="section-9" class="secondary" tabindex="-1">#</a></h2>
<p>
The project is MIT licensed, so it should make things easy for any potential adopter.
</p>

<h2>Conclusions<a href="#section-10" id="section-10" class="secondary" tabindex="-1">#</a></h2>
<p>
It'll be fun! 😎
</p>
</article>

</section>
</div>