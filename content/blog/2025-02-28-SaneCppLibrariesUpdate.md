Title: 🎠 Sane C++ February 25
Date: 2025-02-28
Category: SaneCppLibraries
Image: 2025-02-28-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2025-02-28-SaneCppLibrariesUpdate
Summary: Welcome to the update post for February 2025!<br> This month has been mostly spent re-writing <code>Containers</code> and <code>SC::Build</code> libraries!
TOC:    #section-0,Sane C++ February 25
        #containers, Containers
        #scbuild, SC::Build
        #scfoundation, SC::Foundation
        #minor-changes, Minor Changes

### Containers

Re-writing <a href="https://pagghiu.github.io/SaneCppLibraries/library_containers.html">`Containers`</a>...what could be going wrong?

Sane C++ Libraries tag-line is "Platform Abstraction Libraries". 
The main reason for that is that the project doesn't try or want to be a STL replacement.
There is an hard requirement not to depend on the Standard C++ Library because the standard totally disrespects one of the fundamental pillars of the project, namely _Fast Compile Times_.

In general STL-like containers may not be the best or most efficient abstraction in many cases.
Using them (or not) it's really an application choice that should not dictated by a _Platform Abstraction_ library.

A lot of effort is often spent avoiding or at least reducing Containers usage in other Sane C++ Libraries API.
The problem is that ``Vector<T>`` containers were used both by ``Strings`` library and just as Buffers for ``File`` and other libraries.

For this reason I've decided to re-write the entire set of <a href="https://pagghiu.github.io/SaneCppLibraries/library_containers.html">`Containers`</a> with a few objectives

1. Cleaning-up the quite messy and verbose code for ``Vector<T>`` and ``SmallVector<T>`` and ``Array<T,N>``
2. Provide a base implementation that works for ``char`` buffers but concise enough to be included in ``Foundations`` library.
3. Share as much code as possible to implement  ``Vector<T>`` and ``SmallVector<T>`` that are still in ``Containers``
4. Create a _byte buffer_ implementation that should not leak in the headers

The results are quite satisfying, there is now a ``Buffer`` and ``SmallBuffer<N>`` that replace all ``Vector<char>`` usages and are implemented in ``Foundation.cpp`` file.
All the other Vector-like containers share most of the code and they're delivered as _header only_ library as one can expect from a templated library.

Probably a next step could be evolving them to use custom memory allocators and arenas, but that will happen maybe in some future update.

This is the detailed list of commits:

- [Containers: Handle edge case in copy insert](https://github.com/Pagghiu/SaneCppLibraries/commit/39ea983b)
- [Containers: Replace contains and find in Vector and Array using Span<T>](https://github.com/Pagghiu/SaneCppLibraries/commit/4ed5a47c)
- [Containers: Rewrite Vector and Array using Segment](https://github.com/Pagghiu/SaneCppLibraries/commit/c6d2e1da)
- [DebugVisualizers: Add Buffer and SmallBuffer visualizers for lldb and natvis](https://github.com/Pagghiu/SaneCppLibraries/commit/b5564bb3)
- [DebugVisualizers: Update String and SmallString visualizers](https://github.com/Pagghiu/SaneCppLibraries/commit/f1a7105b)
- [DebugVisualizers: Update Vector and SmallVector visualizers for lldb and natvis](https://github.com/Pagghiu/SaneCppLibraries/commit/3c239f6f)

An these are the commits were some dependencies from <a href="https://pagghiu.github.io/SaneCppLibraries/library_containers.html">`Containers`</a> have been removed

- [File: Remove dependency from Containers library](https://github.com/Pagghiu/SaneCppLibraries/commit/7167f4d3)
- [SerializationBinary: Replace Vector usages with Buffer](https://github.com/Pagghiu/SaneCppLibraries/commit/87b100df)
- [Strings: Remove dependency from Containers library](https://github.com/Pagghiu/SaneCppLibraries/commit/24898f6f)
- [Http: Use Buffer instead of Vector<char> in test](https://github.com/Pagghiu/SaneCppLibraries/commit/d5b7ec21)

### SC::Foundation

Changes in <a href="https://pagghiu.github.io/SaneCppLibraries/library_foundation.html">`SC::Foundation`</a> are connected to the ones just described in Containers, because ``Segment`` class and ``Buffer`` plus ``SmallBuffer`` are all defined there.
Two classes, specifically ``TaggedUnion`` and ``TaggedMap`` have been moved to <a href="https://pagghiu.github.io/SaneCppLibraries/library_foundation_extra.html">`SC::FoundationExtra`</a>.
The reason is that they're not used by any other library and feel a little bit too ``Modern C++`` to deserve a place in Sane C++ Libraries.

- [Foundation: Add Buffer and SmallBuffer<N>](https://github.com/Pagghiu/SaneCppLibraries/commit/8df0b5af)
- [Foundation: Add Segment::append overload for types convertible to T](https://github.com/Pagghiu/SaneCppLibraries/commit/8aba6435)
- [Foundation: Add function to register Memory globals](https://github.com/Pagghiu/SaneCppLibraries/commit/d5544f3a)
- [Foundation: Move Assert code to a dedicated Internal file](https://github.com/Pagghiu/SaneCppLibraries/commit/d88738d2)
- [FoundationExtra: Move TaggedUnion and TaggedMap to FoundationExtra](https://github.com/Pagghiu/SaneCppLibraries/commit/6d37a744)

### SC::Build

<a href="https://pagghiu.github.io/SaneCppLibraries/library_build.html">`SC::Build`</a> is the self-hosted build system used by Sane C++ Libraries to generate test and example projects.
It's not needed to _use_ the libraries, as they need no build system at all, but it's used when _developing_ the libraries.

It's not ready for general use (yet!), but it's progressing towards getting there someday.

In this month the build definition API has been cleaned up a little bit, with preference towards using _methods_ to configure the build rather than filling the data structure.


A new more precise flags resolution / merging system properly allows to override compile or link flags in configuration, so that they have priority over the ones set per-project.
It's also possible to set a compile flags for a specific set of files, including disabling warnings for them.

```cpp
Result buildTestProject(const Parameters& parameters, Project& project)
{
    project = {TargetType::ConsoleExecutable, TEST_PROJECT_NAME};

    // All relative paths are evaluated from this project root directory.
    project.setRootDirectory(parameters.directories.libraryDirectory.view());

    // Project Configurations
    project.addPresetConfiguration(Configuration::Preset::Debug, parameters);
    project.addPresetConfiguration(Configuration::Preset::Release, parameters);
    project.addPresetConfiguration(Configuration::Preset::DebugCoverage, parameters);

    // Defines
    // $(PROJECT_ROOT) expands to Project::setRootDirectory expressed relative to $(PROJECT_DIR)
    project.addDefines({"SC_LIBRARY_PATH=$(PROJECT_ROOT)", "SC_COMPILER_ENABLE_CONFIG=1"});

    // Includes
    project.addIncludePaths({
        ".",            // Libraries path (for PluginTest)
        "Tests/SCTest", // SCConfig.h path (enabled by SC_COMPILER_ENABLE_CONFIG == 1)
    });

    addSaneCppLibraries(project, parameters);
    project.addFiles("Tests/SCTest", "*.cpp"); // add all .cpp from SCTest directory
    project.addFiles("Tests/SCTest", "*.h");   // add all .h from SCTest directory
    project.addFiles("Tools", "SC-*.cpp");     // add all tools
    project.addFiles("Tools", "*.h");          // add tools headers
    project.addFiles("Tools", "*Test.cpp");    // add tools tests

    // This is a totally useless per-file define to test "per-file" flags SC::Build feature.
    SourceFiles specificFiles;
    // For testing purposes let's create a needlessly complex selection filter for "SC Spaces.cpp"
    specificFiles.addSelection("Tests/SCTest", "*.cpp");
    specificFiles.removeSelection("Tests/SCTest", "SCTest.cpp");
    // Add an useless define to be checked inside "SC Spaces.cpp" and "SCTest.cpp"
    specificFiles.compile.addDefines({"SC_SPACES_SPECIFIC_DEFINE=1"});
    specificFiles.compile.addIncludePaths({"../Directory With Spaces"});

    // For testing purposes disable some warnings caused in "SC Spaces.cpp"
    specificFiles.compile.disableWarnings({4100});                                 // MSVC only
    specificFiles.compile.disableWarnings({"unused-parameter"});                   // GCC and Clang
    specificFiles.compile.disableClangWarnings({"reserved-user-defined-literal"}); // Clang Only
    project.addSpecificFileFlags(specificFiles);

    return Result(true);
}
```

This is the detailed list of commits:

- [Build: Add basic support for disabling warnings on specific file](https://github.com/Pagghiu/SaneCppLibraries/commit/f9da0f75)
- [Build: Basic support of "per-file" compile flags](https://github.com/Pagghiu/SaneCppLibraries/commit/ae6689a2)
- [Build: Improve build definition API](https://github.com/Pagghiu/SaneCppLibraries/commit/9867844c)
- [Build: Refactor Makefile backend](https://github.com/Pagghiu/SaneCppLibraries/commit/34def2fe)
- [Build: Refactor Xcode writer](https://github.com/Pagghiu/SaneCppLibraries/commit/76aa65a9)
- [Build: Resolve compile / link options in project if not set on configuration](https://github.com/Pagghiu/SaneCppLibraries/commit/1ec566cc)
- [Build: Simplify defining compile and link settings getting rid of TaggedUnion](https://github.com/Pagghiu/SaneCppLibraries/commit/18a234ca)
- [Build: Use TargetType to configure console executables or graphical application](https://github.com/Pagghiu/SaneCppLibraries/commit/c2238d84)

### Minor Changes

And as always here is the list of random fixes scattered around the library!

This is the detailed list of commits for all minor changes:

- [Async: Remove variable length array in Linux backend](https://github.com/Pagghiu/SaneCppLibraries/commit/6ae335c2)
- [AsyncStreams: Disable tests requiring ZLib on Windows ARM64](https://github.com/Pagghiu/SaneCppLibraries/commit/956cdf96)
- [CI: Compile also SCExample](https://github.com/Pagghiu/SaneCppLibraries/commit/ee78587f)
- [Everywhere: Fix some spelling errors](https://github.com/Pagghiu/SaneCppLibraries/commit/b52a9280)
- [Plugin: Add close method to PluginRegistry](https://github.com/Pagghiu/SaneCppLibraries/commit/9e48369e)
- [Plugin: Move StringHashFNV to PluginHash](https://github.com/Pagghiu/SaneCppLibraries/commit/12f1d236)
- [SCTest: More properly group tests by library they belong to](https://github.com/Pagghiu/SaneCppLibraries/commit/a1254116)
- [Strings: Move implementations to internal](https://github.com/Pagghiu/SaneCppLibraries/commit/1614560f)
