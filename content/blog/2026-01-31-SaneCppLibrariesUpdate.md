Title: ❄️ Sane C++ January 26
Date: 2026-01-31
Category: SaneCppLibraries
Image: 2026-01-31-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2026-01-31-SaneCppLibrariesUpdate
Summary: Welcome to the January 2026 update!<br> It looks like AI is taking over the world (starting from writing code better and faster than humans). Probably this entire project is now totally useless and obsolete, but let's do one more monthly update (maybe the last?) !
TOC:    #section-0,January Updates
        #http,Http
        #asyncstreams,AsyncStreams
        #async,Async
        #others,Others

# Http

The `Http` library is being tested with more care and is slowly rising from its 🟥 Draft status to something better.  
It's still not time to declare it 🟨 MVP, but we're making progress.
There is now support for `Keep-Alive` (reusing server connections for multiple requests) and for payloads in PUT/POST.  
Support for `multipart/form-data` has also been partially implemented; it's still an initial implementation and may not handle all edge cases.  
What's cool about these new payload/request types is that the library remains allocation-free!  
Everything is streamed through the `AsyncStreams` using user-provided initial buffers.  
This has been quite challenging, as the async state machine required to handle these interactions — with many flags that can alter the lifecycle of an async client/connection — is quite complicated.

A new sample has been added called `AsyncWebServer`.
There is also a simple pair of `.bat` / `.sh` scripts to compile and launch it on the fly without generating projects or setting up anything from the repo.

```
~/Developer/Projects/SC> ./Examples/AsyncWebServer/BuildAndRun.sh
Building and running AsyncWebServer example (DEBUG)...
Address: 127.0.0.1:8090
Folder : ~/SC/Examples/AsyncWebServer
```

A benchmark has been added to measure the performance of the fully self-hosted HTTP server against the Python HTTP server; the results vary significantly depending on the OS.

On Windows I couldn't get it to run; it hangs and needs investigation.

On my macOS (M1 Pro 16GB RAM) `AsyncWebServer` is about 200% faster than the Python Simple HTTP Server.

```
Support/Benchmarks/Http/.venv/bin/python Support/Benchmarks/Http/http_benchmark.py --directory "~/SC/_Build/_Documentation/docs" --port 8090 --concurrent 10 --mode directory
Assuming AsyncWebServer is running on http://localhost:8090
Make sure to start it with:
./SC.sh build run AsyncWebServer Debug -- --directory "~/SC/_Build/_Documentation/docs"


=== Benchmarking AsyncWebServer ===
Server URL: http://localhost:8090
Directory: ~/SC/_Build/_Documentation/docs
Mode: directory
Concurrent requests: 10
Iterations: 5 (with 2 warmup runs)
Found 1245 files to benchmark

Running 2 warmup iterations...

Running 5 measurement iterations...
Iteration 1/5... 12750.263
Iteration 2/5... 10553.894
Iteration 3/5... 8616.982
Iteration 4/5... 9615.676
Iteration 5/5... 10540.048

--- Results ---
Median Requests/sec: 10540.05
Median Throughput: 131.36 MB/s
Response time - Min: 0.000s, Max: 0.022s, Median: 0.001s
Stability - RPS CV: 0.147, Throughput CV: 0.147
Warning: High variability detected (>10% CV). Consider increasing --iterations or --delay.
Starting Python HTTP server on port 8000 serving ~/SC/_Build/_Documentation/docs

=== Benchmarking Python HTTP Server ===
Server URL: http://localhost:8000
Directory: ~/SC/_Build/_Documentation/docs
Mode: directory
Concurrent requests: 10
Iterations: 5 (with 2 warmup runs)
Found 1245 files to benchmark

Running 2 warmup iterations...

Running 5 measurement iterations...
Iteration 1/5... 3567.009
Iteration 2/5... 3589.241
Iteration 3/5... 3341.547
Iteration 4/5... 3420.329
Iteration 5/5... 3430.469

--- Results ---
Median Requests/sec: 3430.47
Median Throughput: 42.76 MB/s
Response time - Min: 0.001s, Max: 0.127s, Median: 0.002s
Stability - RPS CV: 0.030, Throughput CV: 0.030

=== COMPARISON ===
AsyncWebServer: 10540.05 requests/sec, 131.36 MB/s
Python HTTP Server: 3430.47 requests/sec, 42.76 MB/s
AsyncWebServer is 207.2% faster in requests/sec
AsyncWebServer has 207.2% higher throughput
```

On Linux (in a VM) the situation is reversed: the Python Simple HTTP Server is about 400% faster than AsyncWebServer.  
No investigation has been done yet into why the performance is so much worse on Linux.  
I suspect the Python server may be using `sendfile` or similar optimizations, but one would need to spend some time to improve the benchmark.


```
=== Benchmarking AsyncWebServer ===
Server URL: http://localhost:8090
Directory: /home/stefano/docs_test
Mode: directory
Concurrent requests: 10
Iterations: 5 (with 2 warmup runs)
Found 1245 files to benchmark

Running 2 warmup iterations...

Running 5 measurement iterations...
Iteration 1/5... 225.220
Iteration 2/5... 224.785
Iteration 3/5... 225.823
Iteration 4/5... 222.086
Iteration 5/5... 225.241

--- Results ---
Median Requests/sec: 225.22
Median Throughput: 2.81 MB/s
Response time - Min: 0.001s, Max: 0.057s, Median: 0.044s
Stability - RPS CV: 0.007, Throughput CV: 0.007
Starting Python HTTP server on port 8000 serving /home/stefano/docs_test

=== Benchmarking Python HTTP Server ===
Server URL: http://localhost:8000
Directory: /home/stefano/docs_test
Mode: directory
Concurrent requests: 10
Iterations: 5 (with 2 warmup runs)
Found 1245 files to benchmark

Running 2 warmup iterations...

Running 5 measurement iterations...
Iteration 1/5... 1140.778
Iteration 2/5... 1124.244
Iteration 3/5... 1118.280
Iteration 4/5... 1124.568
Iteration 5/5... 1135.039

--- Results ---
Median Requests/sec: 1124.57
Median Throughput: 14.02 MB/s
Response time - Min: 0.001s, Max: 1.078s, Median: 0.002s
Stability - RPS CV: 0.008, Throughput CV: 0.008

=== COMPARISON ===
AsyncWebServer: 225.22 requests/sec, 2.81 MB/s
Python HTTP Server: 1124.57 requests/sec, 14.02 MB/s
Python HTTP Server is 399.3% faster in requests/sec
Python HTTP Server has 399.3% higher throughput
```

**Detailed list of commits:**

- [Http: Add a couple of font content types](https://github.com/Pagghiu/SaneCppLibraries/commit/fbd2b88c)
- [Http: Add a multipart/form-data parser](https://github.com/Pagghiu/SaneCppLibraries/commit/105c8c31)
- [Http: Add a multipart/form-data test](https://github.com/Pagghiu/SaneCppLibraries/commit/bf578832)
- [Http: Add postMultipart to test http client](https://github.com/Pagghiu/SaneCppLibraries/commit/51946723)
- [Http: Add some anti hang timeouts](https://github.com/Pagghiu/SaneCppLibraries/commit/415bca07)
- [Http: Add timeout for file test](https://github.com/Pagghiu/SaneCppLibraries/commit/2b3b0851)
- [Http: Destroy readable socket stream after body has been fully received](https://github.com/Pagghiu/SaneCppLibraries/commit/0573af8e)
- [Http: Detect Content-Type header in the parser](https://github.com/Pagghiu/SaneCppLibraries/commit/aa7ea9d6)
- [Http: Fix buffer memory leak when unshifting](https://github.com/Pagghiu/SaneCppLibraries/commit/b707209a)
- [Http: Forcefully disable keep-alive when running out of available connections](https://github.com/Pagghiu/SaneCppLibraries/commit/ab210ae8)
- [Http: Handle simple requests with body payloads (PUT / POST)](https://github.com/Pagghiu/SaneCppLibraries/commit/6b2c9b9a)
- [Http: Handle streaming requests with body payloads (PUT / POST)](https://github.com/Pagghiu/SaneCppLibraries/commit/cc3c87c4)
- [Http: Handle unexpected client disconnect on keep-alive requests](https://github.com/Pagghiu/SaneCppLibraries/commit/b99f18ec)
- [Http: Implement support for Keep-alive](https://github.com/Pagghiu/SaneCppLibraries/commit/7aba1f3b)
- [Http: Remove only the specifically added event listener](https://github.com/Pagghiu/SaneCppLibraries/commit/0ca40286)
- [Http: Return connection close according to HTTP 1.1 spec](https://github.com/Pagghiu/SaneCppLibraries/commit/a9a15fa3)
- [Http: Reuse connections only after full cancellation of async requests](https://github.com/Pagghiu/SaneCppLibraries/commit/5c887eca)
- [Benchmarks: Add http benchmark](https://github.com/Pagghiu/SaneCppLibraries/commit/ccab97dc)
- [Benchmarks: Fix http benchmark](https://github.com/Pagghiu/SaneCppLibraries/commit/6dbe3cde)
- [Examples: Add AsyncWebServer Example](https://github.com/Pagghiu/SaneCppLibraries/commit/e422fa84)

# AsyncStreams

`AsyncStreams` is the backbone of `Http`.  
It handles a fairly convoluted state machine (inspired by `node.js` streams), making it possible to stream sockets to files and vice versa.

The buffer management system can now create child views that reference a memory slice of the parent buffer.

It has gained a few functions like `unshift` to allow _putting back_ buffers that were popped from the stream unnecessarily.  

For example, the multipart parser pops a buffer, finds the end of the multipart header, creates a child view that points to the start of the binary data, and _unshifts_ it back to the stream so it can be piped to an `AsyncWritableFileStream` without worrying about HTTP protocol delimiters.

The destruction lifecycle is now more precise with the addition of an `autoDestroy` feature (which automatically destroys a stream when it's ended) and a clear distinction between the `end` event (EOF) and the `close` event (resource cleanup).

**Detailed list of commits:**

- [AsyncStreams: Add readable stream unshift](https://github.com/Pagghiu/SaneCppLibraries/commit/48b16eee)
- [AsyncStreams: Change func implementations to virtual functions](https://github.com/Pagghiu/SaneCppLibraries/commit/96e6a705)
- [AsyncStreams: Destroy writable streams only when not already ended or ending](https://github.com/Pagghiu/SaneCppLibraries/commit/b521a0b4)
- [AsyncStreams: Get rid of getFirstBodySlice by unshifting body buffers](https://github.com/Pagghiu/SaneCppLibraries/commit/3cdca1bc)
- [AsyncStreams: Implement child async buffers view](https://github.com/Pagghiu/SaneCppLibraries/commit/18ead745)
- [AsyncStreams: Listen to eventClose instead of eventEnd in Pipeline](https://github.com/Pagghiu/SaneCppLibraries/commit/954e3f4b)
- [AsyncStreams: Preserve order when removing listeners](https://github.com/Pagghiu/SaneCppLibraries/commit/9cb5df0c)
- [AsyncStreams: Stop async requests if they're not already cancelling](https://github.com/Pagghiu/SaneCppLibraries/commit/99ba6006)
- [AsyncStreams+Http: Implement async destruction](https://github.com/Pagghiu/SaneCppLibraries/commit/103e505e)

# Async

The `Async` library is maturing to handle more edge cases.
This example addresses `ERROR_INVALID_HANDLE`, which can be returned when trying to cancel async requests whose handle has already (incorrectly) been closed.  
It's great to see `SC::Async` handle such edge cases smoothly, making the user's programming experience easier.

**Detailed list of commits:**

[Async: Ignore ERROR_INVALID_HANDLE on Windows during cancellations](https://github.com/Pagghiu/SaneCppLibraries/commit/5fe7560d)

# Others

And as always, this is a list of miscellaneous fixes and improvements made for all the other libraries.

One nice addition to `Containers` is the `VirtualArray` class, which allows reserving a very large amount of virtual address space and committing only what's needed.
This keeps the memory location of the whole array stable while growing or shrinking it.
It has been used in the `AsyncWebServer` sample (and `SCExample`) to show how it can handle many connections at runtime, constrained only by OS resource limits such as RAM and the number of open handles.

Also, assertions on functions returning `SC::Result` now print the message embedded in the result.

**Detailed list of commits:**

- [Containers: Add VirtualArray class](https://github.com/Pagghiu/SaneCppLibraries/commit/7f04875b)
- [Everywhere: Add SC_COMPILER_EXPORT clause to some classes](https://github.com/Pagghiu/SaneCppLibraries/commit/eca08d76)
- [Everywhere: Compilation fixes for MSVC 32 bit](https://github.com/Pagghiu/SaneCppLibraries/commit/7c804b60)
- [File: Fix reading from file into fixed span until full or EOF](https://github.com/Pagghiu/SaneCppLibraries/commit/85dc9499)
- [Foundation: Print reason of failed assertion when using Result type](https://github.com/Pagghiu/SaneCppLibraries/commit/e8195e3e)
- [Memory: Use the correct pointer type for __cxa_guard_xxx declarations](https://github.com/Pagghiu/SaneCppLibraries/commit/dce51815)
- [Meta: Add .venv to .gitignore](https://github.com/Pagghiu/SaneCppLibraries/commit/88c02eb1)
- [Meta: Always checkout .sh files with LF and .bat with CRLF](https://github.com/Pagghiu/SaneCppLibraries/commit/40543e2d)
- [Meta: Ignore .cache and compile_commands.json](https://github.com/Pagghiu/SaneCppLibraries/commit/11142c9d)
- [Socket: Make SocketNetworking initNetworking method void](https://github.com/Pagghiu/SaneCppLibraries/commit/409fea5a)
- [Threading: Remove InterlockedExchange forward declarations](https://github.com/Pagghiu/SaneCppLibraries/commit/072137be)