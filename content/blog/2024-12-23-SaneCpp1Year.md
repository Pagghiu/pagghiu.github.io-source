Title: 1️⃣ Year of Sane C++
Date: 2024-12-23
Category: SaneCppLibraries
Image: 2024-12-23-SaneCpp1Year/article.png
Slug: site/blog/2024-12-23-SaneCpp1Year
Summary: Time flies, it's been already one year since the first public release of Sane C++ Libraries!
TOC:    #section-0,1️⃣ Year of Sane C++
        #scasync,🛜 SC::Async
        #scexample,📝 SCExample
        #sctools,🛠️ SC::Tools
        #scbuild,🔨SC::Build
        #scprocess,⚖️ SC::Process
        #scplugin,🔌 SC::Plugin
        #scfilesystemwatcher,👀 SC::FileSystemWatcher
        #scfilesystem,🗃️ SC::FileSystem
        #schashing,#️⃣ SC::Hashing
        #schttp,🕸️ SC::Http
        #scasyncstreams, 🚰 SC::AsyncStreams
        #continuous-integration,🤖 Continuous Integration
        #youtube,🤳 YouTube
        #blog,📒 Blog
        #whats-next,🛫 What's next

<a href="https://github.com/pagghiu/SaneCppLibraries" target="_new">`Sane C++ Libraries`</a> is a set of C++ platform abstraction libraries for macOS, Windows and Linux based on the following <a href="https://pagghiu.github.io/SaneCppLibraries/page_principles.html">Principles</a>:

✅ Fast compile times  
✅ Bloat free  
✅ Simple and readable code  
✅ Easy to integrate  
⛔️ No C++ Standard Library / Exceptions / RTTI  
⛔️ No third party build dependencies (prefer OS API)

<a href="https://github.com/pagghiu/SaneCppLibraries" target="_new">`Sane C++ Libraries`</a> can be used without the C++ Standard Library but it's **NOT** a STL replacement, and it doesn't try to be that.

Each library is color-coded to signal its status:

🟥 Draft (incomplete, WIP, works on basic case)  
🟨 MVP (minimum set of features have been implemented)  
🟩 Usable (a reasonable set of useful features has been implemented)  
🟦 Complete (all planned features have been implemented)  

### <mark>New</mark> 2024 additions  
<p class="chapter">Supported platforms and architectures</p>

- <mark>New</mark> Support for Linux
- <mark>New</mark> Support for iOS
- <mark>New</mark> `SC::AsyncStreams`
- <mark>New</mark> `SC::Tools`
- <mark>New</mark> `SCExample`

### 🟩 Usable Libraries
<p class="chapter">Promoted from 🟨 MVP to 🟩 Usable state</p>

🟩 <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_process.html">`SC::Process`</a>  
🟩 <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_file_system.html">`SC::FileSystem`</a>  
🟩 <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_file_system_iterator.html">`SC::FileSystemIterator`</a>  
🟩 <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_file_system_watcher.html">`SC::FileSystemWatcher`</a>  

### 🟨 MVP Libraries
<p class="chapter">Promoted from 🟥 Draft to 🟨 MVP state</p>

🟨 <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_build.html">`SC::Build`</a>  
🟨 <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_plugin.html">`SC::Plugin`</a>  
🟨 <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_file.html">`SC::File`</a>  

### 🛜 SC::Async 
<p class="chapter">🟨 Async I/O library (files, sockets, timers, processes, fs events, wake-up) </p>

See <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_async.html">`SC::Async`</a>

This is the most advanced library of the project, designed to do exactly 0 dynamic allocations and it got stability and quality of life improvements.

Think of a simplified libuv / Boost.ASIO that covers most of their features in a very compact codebase written according to the Sane C++ Principles!

🟢 No allocations!  
🟢 Socket operations (send/receive/connect/accept)  
🟢 File operations (read/write/close)  
🟢 Child process watcher  
🟢 Folder watcher  
🟢 Background Threaded Work  

Backends:

🟢 `epoll`  
🟢 `io_uring`  
🟢 `kqueue`  
🟢 `IOCP`  

Notes:

- It's slowly getting closer to libuv and/or Boost.Asio features set
- Easy to integrate in any GUI Event Loop (or another IO event loop)
- <a target="_new" href="https://pagghiu.github.io/SaneCppLibraries/page_examples.html">`SC::Example`</a> shows integration with GUI event loops


<a href="{attach}/images/2024-12-23-SaneCpp1Year/SCAsync.png" target="_blank">
<img src="{attach}/images/2024-12-23-SaneCpp1Year/SCAsync.png">
</a>

### 📝 SCExample
<p class="chapter">WIP example browser showcase for the library</p>

See <a target="_new" href="https://pagghiu.github.io/SaneCppLibraries/page_examples.html">`SC::Example`</a>

🟢 Based on Dear ImGui and sokol libraries ❤️  
🟢 Power Efficient: redraws on SC::Async IO or input events  
🟢 Hot-reloaded on the fly through  <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_plugin.html">`SC::Plugin`</a>  
🟢 Integrates <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_async.html">`SC::Async`</a> with native event Loop  
🟢 Supports macOS, iOS, Linux and Windows  

Running on macOS:
<div class="youtube youtube-16x9">
<iframe src="https://github.com/user-attachments/assets/2a38310c-6a28-4f86-a0f3-665dc15b126d" allowfullscreen seamless frameborder="0"></iframe>
</div>

<br>
Running on iOS:
<div class="youtube youtube-16x9">
<iframe src="https://github.com/Pagghiu/SaneCppLibraries/assets/5406873/5c7d4036-6e0c-4262-ad57-9ef84c214717" allowfullscreen seamless frameborder="0"></iframe>
</div>


### 🛠️ SC::Tools
<p class="chapter">Single C++ "scripts" compiled on the fly for immediate execution</p>

<a target="_new" href="https://pagghiu.github.io/SaneCppLibraries/page_tools.html">`SC::Tools`</a> replace all shell automation scripts in the project with real C++ programs dog-fooding <a href="https://github.com/pagghiu/SaneCppLibraries" target="_new">`Sane C++ Libraries`</a> themselves.

🟢 <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_build.html">`SC::Build`</a>

- Generates build projects for VStudio / XCode / Makefiles
- Builds Documentation (through Doxygen)
- Runs Coverage (using Clang)
- Runs executables executables

🟢 <a target="_new" href="https://pagghiu.github.io/SaneCppLibraries/page_tools.html">`SC::Package`</a>

- Primitive source code / binaries downloader for <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_build.html">`SC::Build`</a>

🟢 <a target="_new" href="https://pagghiu.github.io/SaneCppLibraries/page_tools.html">`SC::Format`</a>

- Downloads, installs and invokes clang-format (also for the CI)

<a href="{attach}/images/2024-12-23-SaneCpp1Year/SCTools.png" target="_blank">
<img src="{attach}/images/2024-12-23-SaneCpp1Year/SCTools.png">
</a>


### 🔨 SC::Build
<p class="chapter">🟨 Minimal self-hosted build system where builds are described in C++</p>
See <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_build.html">`SC::Build`</a>

🟢 Support generating multiple projects from a single definition  
🟢 Support generating Makefile for Linux and macOS  
🟢 Support generating macOS and iOS bundles with icons for XCode  
🟢 Support building specific configuration and architecture  
🟢 Support paths with spaces 😎  
🟢 Simplify build definition  
🟢 Support generating projects for Windows subsystem  
🟢 Add new actions:

- `generate` - generates project files
- `configure` - downloads third party dependencies
- `build` - invokes host build tool to build
- `run` - runs the default built executable
- `documentation` - Builds the doxygen documentation
- `coverage` - Generates coverage using clang

<a href="{attach}/images/2024-12-23-SaneCpp1Year/SCBuild.png" target="_blank">
<img src="{attach}/images/2024-12-23-SaneCpp1Year/SCBuild.png">
</a>

### ⚖️ SC::Process 
<p class="chapter">🟩 Create Child processes, chain them, read outputs.</p>

See <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_process.html">`SC::Process`</a>

🟢 Improve API ease of use  
🟢 Improve stability and reliability on Posix  
🟢 Support custom working directory  
🟢 Support custom environment variables  
🟢 Support ignoring child process stdout/stderr  

<a href="{attach}/images/2024-12-23-SaneCpp1Year/SCProcess.png" target="_blank">
<img src="{attach}/images/2024-12-23-SaneCpp1Year/SCProcess.png">
</a>

### 🔌 SC::Plugin
<p class="chapter">🟨 Minimal dependency based plugin system with hot-reload</p>

See <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_plugin.html">`SC::Plugin`</a>

🟢 Allow overriding sysroot path  
🟢 Capture compiler and linker output  
🟢 Intercept and use environment CFLAGS / LDFLAGS  
🟢 QueryInterface-like mechanism  
🟢 Multiple include paths  
🟢 Track number of reloads and load time for plugins  
🟢 Detect Visual Studio Path dynamically  

<a href="{attach}/images/2024-12-23-SaneCpp1Year/SCPlugin.png" target="_blank">
<img src="{attach}/images/2024-12-23-SaneCpp1Year/SCPlugin.png">
</a>

### 👀 SC::FileSystemWatcher 
<p class="chapter">🟩 Notifications {add, remove, rename, modified} for files and directories</p>

See <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_file_system_watcher.html">`SC::FileSystemWatcher`</a>

🟢 Improve reliability  
🟢 Support iOS using the (private) FSEvents framework  
🟢 Can monitor files in a background thread or using SC::Async  

<a href="{attach}/images/2024-12-23-SaneCpp1Year/SCFileSystemWatcher.png" target="_blank">
<img src="{attach}/images/2024-12-23-SaneCpp1Year/SCFileSystemWatcher.png">
</a>

### 🗃️ SC::FileSystem
<p class="chapter">🟩 File System operations { exists, copy, delete } for { files and directories }</p>

See <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_file_system.html">`SC::FileSystem`</a>

🟢 Improve reliability  
🟢 Symlinks creation  

<a href="{attach}/images/2024-12-23-SaneCpp1Year/SCFileSystem.png" target="_blank">
<img src="{attach}/images/2024-12-23-SaneCpp1Year/SCFileSystem.png">
</a>

### #️⃣ SC::Hashing 
<p class="chapter">🟩 Compute MD5, SHA1 or SHA256 hashes for a stream of bytes</p>

See <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_hashing.html">`SC::Hashing`</a>

🟢 C Bindings

<a href="{attach}/images/2024-12-23-SaneCpp1Year/SCHashing2.png" target="_blank">
<img src="{attach}/images/2024-12-23-SaneCpp1Year/SCHashing2.png">
</a>

### 🕸️ SC::Http
<p class="chapter">🟥 HTTP parser, client and server</p>

See <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_http.html">`SC::Http`</a>

🟢 Improved to the level of self-hosting this website (non-production)

<a href="{attach}/images/2024-12-23-SaneCpp1Year/SCHttp.png" target="_blank">
<img src="{attach}/images/2024-12-23-SaneCpp1Year/SCHttp.png">
</a>

### 🚰 SC::AsyncStreams
<p class="chapter">🟥 Read / transform / write data concurrently from async sources to destinations.</p>

See <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_async_streams.html">`SC::AsyncStreams`</a>

🟢 Inspired from node.js streams  
🟢 Back-pressure handling  
🟢 Readable Streams (Sources)  
🟢 Writable Streams (Sinks / Destinations)  
🟢 Transform Streams  
🟢 Pipelines (Source -> Transforms -> Multiple Sinks)  

API is still very WIP

### 🤖 Continuous Integration

🟢 Runs using GitHub runners  
🟢 Tests run on Windows Server 2019 / 2022, Linux and macOS  
🟢 No shell scripting (uses <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/page_tools.html">`SC::Tools`</a>)  
🟢 No external dependencies other than doxygen for docs and clang  
🟢 Verifies code to be formatted properly on all Pull Requests  
🟢 Builds and publishes documentation at every commit  
🟢 Computes and publishes code coverage at every commit  

## 🤳 YouTube

🟢 32 YouTube videos produced  

I've always liked the idea of producing some videos to shed some light on the development process and get better at explaining myself.
This has been taking a little bit of time away from actual coding, but I enjoyed doing them!

Take a look at my <a href="https://www.youtube.com/@Pagghiu" target="_new">YouTube Channel</a> if you're interested!

## 📒 Blog

🟢 10 Blog Posts written  

Writing update blog post has also been consuming some time but it was worth it.  
I think it's a nice way to keep up to date with latest additions of the projects spending a very minimal amount of readers time.

## What's next

It's important not to lose focus and continuing to improve existing libraries.

- **MOAR** examples
- Try promoting all libraries in 🟥 Draft state to 🟨 MVP
- Improve testing and code coverage
- Create more C-API wrappers (similar to the sc_hashing prototype)
- **MOAR** examples
- Improve Documentation (maybe with Tutorials)
- **MOAR** examples

It feels like the most advanced functionality is already in the Async I/O capability of the libraries, but there is still so much to do.

It would be great improving <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_async.html">`SC::Async`</a> to make it competitive with more famous libraries like Boost.Asio and libuv.
Ideally <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_async.html">`SC::Async`</a> should cover 80% of common use cases but with a much smaller and faster to compile code base.
The C-API for <a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_async.html">`SC::Async`</a> should try to be close to libuv. 
Can we make it so that unmodified libuv programs can be compiled against such C-API? 

<a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_async_streams.html">`SC::AsyncStreams`</a> should be improved to bring higher level functionality that exists in successful server runtimes like node.js.

<a target="_new" href="http://pagghiu.github.io/SaneCppLibraries/library_http.html">`SC::Http`</a> should grow to support enough HTTP 1.1 to become useful at least to create a quick webserver when it's needed.
WebSocket should be implemented on top of it.
It would be great to implement HTTPS support without needing to include and link an external library like OpenSSL.
Exploring the proper Windows and macOS API to do proper handshake and cryptography will be very useful.

How much of these objectives will be achievable highly depends on if the *solo development* experience will continue to be the norm.  

See you soon!!🎊👋🏼