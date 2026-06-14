Title: ☔️ Sane C++ March 25
Date: 2025-03-31
Category: SaneCppLibraries
Image: 2025-03-31-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2025-03-31-SaneCppLibrariesUpdate
Summary: Welcome to the update post for March 2025!<br> This month has been mostly spent adding custom allocators support to all Containers!
TOC:    #section-0,Sane C++ March 25
        #scfoundation, SC::Foundation
        #custom-allocators, Custom Allocators
        #relative-pointers, Relative Pointers
        #inline-header, Inline Header
        #virtual-memory, Virtual Memory
        #memory-statistics, Memory Statistics
        #vector-growth-factor,Vector Growth Factor
        #debug-visualizers,Debug visualizers
        #scbuild, SC::Build
        #minor-changes, Minor Changes


### SC::Foundation

The big `Segment` refactoring from last month has left so many trails also during March in <a href="https://pagghiu.github.io/SaneCppLibraries/library_foundation.html">`SC::Foundation`</a>.  
Most notably `Segment` now:

1. Supports custom allocators (WIP)
2. Uses relative pointers to store _dynamically allocated_ block information
3. Stores its header inline instead of making it part of the _dynamic allocation_

#### Custom allocators
- Implementation differs from STL one of embedding allocator in the type, as a template parameter.  
- Keeping allocator out of the template parameters allows functions to just accept `Vector<T>&` without needing to care what allocator has been set for it and avoiding the _viral_ effect of needing to make also the method templated around the allocator (that is really bad for compile times).
- Allocators are not stored for each single container or dynamic allocation, they're by all means a global.
- They're arranged in a double-linked list and users can push / pop their custom one as needed.
- This makes it easy for example to create strategies where all allocations in a given sub-scope are sliced from a pre-allocated slab of memory that can be later on released all at once.  
- Custom allocators must be considered still WIP and their API will likely change.
Also documentation about their usage is insufficient and it will be expanded.

<a href="{attach}/images/2025-03-31-SaneCppLibrariesUpdate/CustomFixedAllocator.png" target="_blank">
<img src="{attach}/images/2025-03-31-SaneCppLibrariesUpdate/CustomFixedAllocator.png">
</a>

Detailed list of commits: 

- [Foundation: Add FixedAllocator](https://github.com/Pagghiu/SaneCppLibraries/commit/50d184e5)
- [Foundation: Add global and thread-local allocators](https://github.com/Pagghiu/SaneCppLibraries/commit/703372d3)
- [Foundation: Add allocation ownership mechanism](https://github.com/Pagghiu/SaneCppLibraries/commit/f31955c)
- [Foundation: Add alignment support to allocators](https://github.com/Pagghiu/SaneCppLibraries/commit/938292a6)
- [Foundation: Add Global and Thread-Local enum](https://github.com/Pagghiu/SaneCppLibraries/commit/a61fba94)
- [Containers: Add thread-local Vector and SmallVector containers](https://github.com/Pagghiu/SaneCppLibraries/commit/4a3f51c)
- [Containers: Use Globals to allocate in ArenaMap](https://github.com/Pagghiu/SaneCppLibraries/commit/fc5fd77)
- [Documentation: Add initial documentation for Globals](https://github.com/Pagghiu/SaneCppLibraries/commit/4a3f51c)

#### Relative pointers
Relative pointers make it easier to create data structures that can be bulk serialized and restored skipping parsing entirely.
A specific demo featuring this must still be built but this is definitively on the `TODO` list.
Relative pointers are quite tricky to implement properly in C++ because it's very easy to trigger UB with this specific class of pointer arithmetics and this has been learned the hard way.
Some tests where failing on GCC (when compiling with `-fstrict-aliasing`) but it has been a good occasion to learn about `std::launder` and `std::start_lifetime_as` family of functions and in general creating optimization barriers with `volatile` specifier.  
For now relative pointers are used by default but at some point the performance impact due to their use will be assessed.
In case of a significant performance difference maybe it will be re-considered possible to opt-out their usage with some runtime or compile-time flag.

- [Foundation: Use relative pointers in Segment and make header inline](https://github.com/Pagghiu/SaneCppLibraries/commit/8a00000e)
- [Foundation: Launder Segment::data() returned pointer](https://github.com/Pagghiu/SaneCppLibraries/commit/ac70d9cc)
- [Foundation: Refactor Segment to reduce and isolate UB](https://github.com/Pagghiu/SaneCppLibraries/commit/7a97c14f)

<a href="{attach}/images/2025-03-31-SaneCppLibrariesUpdate/RelativePointer.png" target="_blank">
<img src="{attach}/images/2025-03-31-SaneCppLibrariesUpdate/RelativePointer.png">
</a>

#### Inline header
`SegmentHeader` is now part of `Segment` declaration. In other words it's no more part of its dynamically allocated part.
This is useful to know all properties of a segment like its inline storage and capacity or the use of custom allocators.
The inline header stores also information about needing to use the `Global` or the `Thread-Local` allocator.  
This helps avoiding unnecessary thread-local access because it's useless if all allocations are known to be done from the main thread (or from a specific thread).

- [Foundation: Explicitly reference header from VTable](https://github.com/Pagghiu/SaneCppLibraries/commit/0a17bd41)
- [Foundation: Fix Segment::isInline](https://github.com/Pagghiu/SaneCppLibraries/commit/76e56e5c)

<a href="{attach}/images/2025-03-31-SaneCppLibrariesUpdate/SegmentHeader.png" target="_blank">
<img src="{attach}/images/2025-03-31-SaneCppLibrariesUpdate/SegmentHeader.png">
</a>

#### Virtual Memory
A class called `VirtualMemory` enables reserving large amounts (max value) of memory and then committing the needed one keeping existing allocation address stable.
This is a big win in many cases because it avoids needing to move everything when a dynamic vector needs to expand, as long as it will be under the _max value_ guessed during the Virtual Memory initialization. This max value can be very large as long as it stays in the allowed virtual memory available range for the given architecture, and in case of 64 bits that's pretty big.

<a href="{attach}/images/2025-03-31-SaneCppLibrariesUpdate/VirtualMemoryTest.png" target="_blank">
<img src="{attach}/images/2025-03-31-SaneCppLibrariesUpdate/VirtualMemoryTest.png">
</a>

An associated `VirtualAllocator` enables using it with the Segment allocator subsystem.

<a href="{attach}/images/2025-03-31-SaneCppLibrariesUpdate/CustomVirtualAllocator.png" target="_blank">
<img src="{attach}/images/2025-03-31-SaneCppLibrariesUpdate/CustomVirtualAllocator.png">
</a>

- [Foundation: Add VirtualAllocator](https://github.com/Pagghiu/SaneCppLibraries/commit/e6d93749)
- [Foundation: Add VirtualMemory](https://github.com/Pagghiu/SaneCppLibraries/commit/0cdbeb1f)

#### Memory Statistics
All allocations, deallocations and reallocations are now being counted in a `Statistics` class providing useful information about how many allocations are done by a given section of code.
The `SCTest` is using such statistics to assert when detecting a mismatched number of `allocate` vs `release` calls.

- [Testing: Add global memory report](https://github.com/Pagghiu/SaneCppLibraries/commit/878f7627)
- [Foundation: Record statistics in MemoryAllocator](https://github.com/Pagghiu/SaneCppLibraries/commit/d22c7593)

<a href="{attach}/images/2025-03-31-SaneCppLibrariesUpdate/MemoryReport.png" target="_blank">
<img src="{attach}/images/2025-03-31-SaneCppLibrariesUpdate/MemoryReport.png">
</a>

#### Vector Growth Factor
This has been also been the occasion to feel ashamed about how many allocations where actually already done leading to make Segment grow by factor of `2` on append.

- [Foundation: Grow Segment capacity with factor 2 on append or insert](https://github.com/Pagghiu/SaneCppLibraries/commit/390ce729)

#### Debug visualizers
Debug visualizers have been updated to reflect changes in `Segment` data layout.  
Also a LLDB visualizer for `Array<T, N>` was missing and it has been added as well.

- [DebugVisualizer: Update Segment visualizers to use relative pointers](https://github.com/Pagghiu/SaneCppLibraries/commit/bfc0c827)

<a href="{attach}/images/2025-03-31-SaneCppLibrariesUpdate/DebugVisualizers.png" target="_blank">
<img src="{attach}/images/2025-03-31-SaneCppLibrariesUpdate/DebugVisualizers.png">
</a>

#### And more
Additional minor fixes that don't deserve a whole paragraph to describe them are listed below:

- [Foundation: Add no-except to all Segment related methods](https://github.com/Pagghiu/SaneCppLibraries/commit/e5c5041f)
- [Foundation: Enable creation of Span<void>](https://github.com/Pagghiu/SaneCppLibraries/commit/abb0b0b6)
- [Foundation: Extend Segment assign and insert to types convertible to T](https://github.com/Pagghiu/SaneCppLibraries/commit/1ed98c28)
- [Foundation: Fix memory Leak in Segment::shrink_to_fit](https://github.com/Pagghiu/SaneCppLibraries/commit/92eff60a)
- [Foundation: Split Foundation.cpp content in separate files](https://github.com/Pagghiu/SaneCppLibraries/commit/a6ad7dfd)
- [Containers: Move SmallVector to Vector header](https://github.com/Pagghiu/SaneCppLibraries/commit/0cffe20e)

### SC::Build

<a href="https://pagghiu.github.io/SaneCppLibraries/library_build.html">`SC::Build`</a> has received a small set of changes too.
It's now always using the C++ stdlib on GCC because only more recent GCC versions (> 13) support the `-nostdlib++` flag that makes it easy linking `libc` but not `libc++` or `libstdc++`.

Also Makefiles for apple and linux platforms are now created in separate sub-directories.
This makes it easier to manually invoke make for them as you don't need the flag to indicate a custom Makefile file name.

<a href="{attach}/images/2025-03-31-SaneCppLibrariesUpdate/SCBuildMarch25.png" target="_blank">
<img src="{attach}/images/2025-03-31-SaneCppLibrariesUpdate/SCBuildMarch25.png">
</a>

This is the detailed list of commits:

- [Build: Always link C++ stdlib on GCC](https://github.com/Pagghiu/SaneCppLibraries/commit/bbb46ea1)
- [Build: Create Makefiles in apple / linux subdirs](https://github.com/Pagghiu/SaneCppLibraries/commit/734b73b4)
- [Build: Fix enabling standard C++ library for gcc](https://github.com/Pagghiu/SaneCppLibraries/commit/9dc9792d)

### Minor Changes

And the obvious list of random fixes, with the notable mention of the one related to `SC::Async` that was randomly failing in the CI very often due to some bad copy and paste from the `io_uring` headers.

- [Everywhere: Fixes to compile under ClangCL](https://github.com/Pagghiu/SaneCppLibraries/commit/6d288b0d)
- [Async: Just fill the entire SQE with zero inside io_uring_prep_rw on Linux](https://github.com/Pagghiu/SaneCppLibraries/commit/59efa2fc)
- [Async: Set to zer all SQE fields for Linux on io_uring](https://github.com/Pagghiu/SaneCppLibraries/commit/9ef93dad)
- [Documentation: Fix some typos for build instructions](https://github.com/Pagghiu/SaneCppLibraries/commit/f60358e0)
- [SerializationBinary: Fix UB on buffer reader](https://github.com/Pagghiu/SaneCppLibraries/commit/443c38e9)
- [Containers: Use placementNew in ArenaMap](https://github.com/Pagghiu/SaneCppLibraries/commit/d003f221)
