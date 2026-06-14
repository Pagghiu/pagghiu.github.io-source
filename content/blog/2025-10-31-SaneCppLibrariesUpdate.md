Title: 🌧️ Sane C++ October 25
Date: 2025-10-31
Category: SaneCppLibraries
Image: 2025-10-31-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2025-10-31-SaneCppLibrariesUpdate
Summary: Welcome to the October 2025 update!<br> This month internal dependencies have been further removed.
TOC:    #section-0,October Updates
        #reducing-internal-dependencies,Reducing Internal Dependencies
        #bring-your-own-containers,Bring Your Own Containers
        #tools-new-bootstrap,Tools new bootstrap
        #build,Build
        #test-coverage,Test Coverage
        #ci,CI
        #miscellaneous,Miscellaneous

# Reducing Internal Dependencies

The first part of the month month has been focused on continuing breaking **internal** dependencies between libraries.

The goal is for Sane C++ Libraries to be a collection of libraries that *work well together*, rather than a monolithic *framework*.
Users should be able to use a single library in isolation without being forced to adopt the entire ecosystem.

`Plugin`, `FileSystemWatcher`, `Async` and `Http` libraries have seen their dependencies reduced, and the resulting dependencies graph is now starting to look a lot nicer!

<a href="https://pagghiu.github.io/SaneCppLibraries/page_dependencies.html" target="_blank">
<img src="{attach}/images/2025-10-31-SaneCppLibrariesUpdate/2025-10-Dependencies.svg">
</a>

**Detailed list of commits:**

- [Plugin: Refactoring to isolate FileSystemIterator usage](https://github.com/Pagghiu/SaneCppLibraries/commit/e03402cc)
- [Plugin: Remove Plugin dependency on FileSystem](https://github.com/Pagghiu/SaneCppLibraries/commit/d44ce07e)
- [Plugin: Remove Plugin dependency on FileSystemIterator](https://github.com/Pagghiu/SaneCppLibraries/commit/e252e18c)
- [Plugin: Remove Plugin dependency on Time](https://github.com/Pagghiu/SaneCppLibraries/commit/5d4b050e)
- [FileSystemWatcher: Remove dependency on Threading](https://github.com/Pagghiu/SaneCppLibraries/commit/abc2abc8)
- [Http: Remove Http dependency on Strings](https://github.com/Pagghiu/SaneCppLibraries/commit/10c9b893)
- [Async: Remove dependency on Time](https://github.com/Pagghiu/SaneCppLibraries/commit/2db0ebc6)


# Bring Your Own Containers

A new example called [InteropSTL](https://github.com/Pagghiu/SaneCppLibraries/tree/main/Tests/InteropSTL) has been added to show how to use `std::string` and `std::vector<char>` with some Sane C++ Libraries.
You don't need to use the STL containers, this is only showing that you can absolutely _Bring Your Own Containers_ (including strings) if for whatever reason one is not interested in using `String` and `Vector<>` variations already included in the project.  

Some details about how how this works: as a consequence of the dependencies reduction, in the past months a new virtual interface has been introduced (named `IGrowableBuffer`) abstracting strings and writable byte buffers, allowing for all libraries not to depend on the `Strings` or `Memory` libraries.  
This month one more step has been done, by further optimizing it so that the only _virtual_ function call is done when physically requiring an allocation if the available growable buffer capacity is insufficient.  
Callers can always avoid this indirect function call by properly sizing the buffer before using some library.  
Previously a second virtual call was always done in the `IGrowableBuffer` destructor, but now this has been optimized.
As the number of potential _virtual_ methods has become just one, the interface has been changed from a virtual one into a regular plain struct with a function pointer, reducing the additional indirection required by the C++ vtable dereferencing!  

So now it's up to you to bring your own containers!!

**Detailed list of commits:**

- [Everywhere: De-virtualize IGrowableBuffer destruction](https://github.com/Pagghiu/SaneCppLibraries/commit/a2bcb9d2)
- [Strings: Obtain encoding from GrowableBuffer<T> in StringBuilder](https://github.com/Pagghiu/SaneCppLibraries/commit/5f70908a)
- [InteropSTL: Show std::string and std::vector<char> usage with File and FileSystem libraries](https://github.com/Pagghiu/SaneCppLibraries/commit/cb8bca41)
- [InteropSTL: Show std::string and std::vector<char> usage with Strings library](https://github.com/Pagghiu/SaneCppLibraries/commit/e1467be9)


# Tools new bootstrap

[SC::Tools](https://pagghiu.github.io/SaneCppLibraries/page_tools.html) are self contained single C++ source files that are (automatically) compiled on the fly and linked to Sane C++ to be immediately executed.  
The mechanism used to compile them was historically involving both `Make` on Posix and `NMake` on Windows to rebuild `SC.cpp` _library_ and the `SC-${TOOL_NAME}.cpp` _script_ separately, link them and also to rebuild them only when some of their dependencies change.  
Both `Make` and `NMake` have now been replaced by a native `ToolsBootstrap.cpp` that doesn't use any of the project's libraries.  
The new bootstrap does the same work as `Make` but hardcoded on compiling the `SC.cpp` plus the `SC-${TOOL_NAME}.cpp` on Posix/Windows.  

**Detailed list of commits:**

- [Tools: Add ToolsBootstrap to get rid of the Makefiles](https://github.com/Pagghiu/SaneCppLibraries/commit/ef36596e)
- [Tools: Fix time tracking for compiling Tools on older macOS](https://github.com/Pagghiu/SaneCppLibraries/commit/da3cc54d)
- [Tools: Fix time tracking for compiling Tools on Windows](https://github.com/Pagghiu/SaneCppLibraries/commit/0051b6dd)
- [Tools: Improve ToolsBootstrap code clarity](https://github.com/Pagghiu/SaneCppLibraries/commit/532f3a14)
- [Tools: Print how much time is being spent compiling a Tool on Windows](https://github.com/Pagghiu/SaneCppLibraries/commit/8bca9513)
- [Tools: Print how much time is being spent compiling a Tool](https://github.com/Pagghiu/SaneCppLibraries/commit/f646f509)
- [Tools: Support folder with spaces and unicode code points in ToolsBootstrap](https://github.com/Pagghiu/SaneCppLibraries/commit/c37ddc9e)

# Build

The [SC::Build](https://pagghiu.github.io/SaneCppLibraries/page_build.html) is a [tool](https://pagghiu.github.io/SaneCppLibraries/page_tools.html) implementing a build system generator where builds are imperatively described in C++.  

This month it gets:

- switches to change the C++ standard used by projects
- some fixes for enabling exceptions on VS Projects
- makefiles avoiding to use the (quite dangerous) `rm -rf` to remove intermediates and output directory as that was incompatible with building multiple projects in the same output folder.
- Also now custom arguments can be passed when using the run verb so for example, parsed after the first `--` appended to the commandline

```sh
./SC.sh build run SCTest Debug -- --arg1 --arg2
```

The above invokes the SCTest executable, as built by the SCTest project with the `--arg1` and `--arg2` arguments.

**Detailed list of commits:**

- [Build: Add support to switch the C++ standard](https://github.com/Pagghiu/SaneCppLibraries/commit/92b9fe17)
- [Build: Fix enabling Exception handling on Visual Studio projects](https://github.com/Pagghiu/SaneCppLibraries/commit/7f82a06a)
- [Build: Only remove generated files in the 'clean' Makefile target](https://github.com/Pagghiu/SaneCppLibraries/commit/b6e82ce2)
- [Build: Support passing custom arguments when using the run verb](https://github.com/Pagghiu/SaneCppLibraries/commit/8fb4ac8d)

# Test Coverage

[Test coverage](https://pagghiu.github.io/SaneCppLibraries/coverage/) has been going down a little bit over the course of the past months, so a few commits have been done with the specific target of bringing it back in the ~85% range.

**Detailed list of commits:**

- [Everywhere: Increase test coverage](https://github.com/Pagghiu/SaneCppLibraries/commit/2e3dbf08)
- [Process: Increase test coverage](https://github.com/Pagghiu/SaneCppLibraries/commit/fce72f48)
- [AsyncStreams: Increase test coverage](https://github.com/Pagghiu/SaneCppLibraries/commit/578d9207)

# CI

CI was suffering from some flakiness on `FileSystemWatcher` macOS tests.  
I suspect this has to do with how github is handling macOS VM as tests never fail locally but anyway, they are less flaky now.  
Also the new [InteropSTL](https://github.com/Pagghiu/SaneCppLibraries/tree/main/Tests/InteropSTL) is now compiled on all supported platforms to make sure it doesn't regress.

**Detailed list of commits:**

- [CI: Build with Xcode on macOS in Release configurations](https://github.com/Pagghiu/SaneCppLibraries/commit/b370c72a)
- [CI: Compile and test InteropSTL on all platforms](https://github.com/Pagghiu/SaneCppLibraries/commit/c1ebc74e)
- [CI: Extend windows runners timeout](https://github.com/Pagghiu/SaneCppLibraries/commit/5b2d7528)
- [FileSystemWatcherAsync: Reduce test flakiness on macOS (2nd attempt)](https://github.com/Pagghiu/SaneCppLibraries/commit/d0cf32f1)
- [FileSystemWatcherAsync: Reduce test flakiness on macOS](https://github.com/Pagghiu/SaneCppLibraries/commit/f17d0504)

# Miscellaneous

And as always a bunch of fixes and minor additions throughout all libraries that are not sizable enough to have their own section in the blog post!
One thing to note is that the `ContainersSerialization` library has been renamed to [ContainersReflection](https://pagghiu.github.io/SaneCppLibraries/library_containers_reflection.html) as it was depending on [Containers](https://pagghiu.github.io/SaneCppLibraries/library_containers.html) and [Reflection](https://pagghiu.github.io/SaneCppLibraries/library_reflection.html) libraries.  
I want to thank [Francesco (cozis) Cozzuto](http://coz.is) for reporting on [Discord](https://discord.com/invite/tyBfFp33Z6) a couple of issues he has been finding with Valgrind!

**Detailed list of commits:**

- [Async: Preserve timeouts scheduling order and clamp their expiration time](https://github.com/Pagghiu/SaneCppLibraries/commit/fb1f4f58)
- [AsyncStreams: Refcount ZLibAPI](https://github.com/Pagghiu/SaneCppLibraries/commit/c4a40c43)
- [ContainersReflection: Rename ContainersSerialization to ContainersReflection](https://github.com/Pagghiu/SaneCppLibraries/commit/67479112)
- [Everywhere: Use wide characters versions of the __FILE__ macro](https://github.com/Pagghiu/SaneCppLibraries/commit/ea85685f)
- [Foundation: Fully qualify SC::forward to avoid confusion with std::forward](https://github.com/Pagghiu/SaneCppLibraries/commit/fcbe7837)
- [Process: Do not close Process::handle like a file descriptor](https://github.com/Pagghiu/SaneCppLibraries/commit/f020a3be)
- [SCExample: Fix printing plugin names on Windows](https://github.com/Pagghiu/SaneCppLibraries/commit/18ea45fa)
- [Socket: Fix Socket test including IPV6 option for localhost](https://github.com/Pagghiu/SaneCppLibraries/commit/c0c5e771)
- [Socket: Make SocketIPAddress::isValid() return false for invalid socket addresses](https://github.com/Pagghiu/SaneCppLibraries/commit/aac5e572)
- [Strings: Add Console::flush](https://github.com/Pagghiu/SaneCppLibraries/commit/1d4b2eaa)
- [Strings: Make StringView::operator== accept a StringView](https://github.com/Pagghiu/SaneCppLibraries/commit/5a5c1274)
- [Strings: Remove consecutive path separators in Path::normalize](https://github.com/Pagghiu/SaneCppLibraries/commit/4421c8ed)
- [Testing: Flush every printed line](https://github.com/Pagghiu/SaneCppLibraries/commit/c16d7143)
- [Testing: Get rid of the trailing 0 when printing red/green emoji](https://github.com/Pagghiu/SaneCppLibraries/commit/ebca6076)
