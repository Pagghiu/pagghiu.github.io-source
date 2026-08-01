Title: ☀️ Sane C++ July 26
Date: 2026-07-31
Category: SaneCppLibraries
Image: 2026-07-31-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2026-07-31-SaneCppLibrariesUpdate
Summary: Welcome to the July 2026 update!<br> This month introduces `Fibers` and `AsyncFibers`, and starts a careful benchmark evaluation of cooperative scheduling, worker pools, and stackless jobs.
TOC:    #section-0,July Updates
        #fibers,Fibers
        #asyncfibers,AsyncFibers
        #benchmark-evaluation-is-in-progress,Benchmark evaluation is in progress
        #stackless-jobs-and-scheduler-work,Stackless jobs and scheduler work
        #documentation-and-other-work,Documentation and other work

# Fibers

The biggest new library this month is <a href="https://pagghiu.github.io/SaneCppLibraries/library_fibers.html">`Fibers`</a>.

<a href="/images/2026-07-31-SaneCppLibrariesUpdate/2026-07-Dependencies.svg" target="_blank">
<img src="/images/2026-07-31-SaneCppLibrariesUpdate/2026-07-Dependencies.svg" alt="Sane C++ Libraries dependency graph for July 2026">
</a>

It is a stackful cooperative scheduler for code that wants synchronous-looking control flow without blocking an OS
thread. A fiber owns a stack, runs ordinary C++ functions, and can suspend at an explicit yield or cooperative wait.
The scheduler can then run another fiber and return to the original one later.

The design is deliberately shaped around the usual Sane C++ constraints. Tasks, stacks, pools, and worker storage are
caller-owned or backed by explicit `FiberAllocator` storage. Cancellation is cooperative, capacity is visible, and the
runtime does not need a hidden heap or a second event loop to make progress.

The first version already has a fair amount of surface area: scheduler, task-pool, worker-pool execution,
work stealing, task groups, counters, events, semaphores, mutexes, cancellation, diagnostics, and focused tests for
the context-switch and storage layers. It runs on the supported 64-bit macOS, Linux, and Windows targets, but it is
still a Draft library and the API will continue to move as the scheduler is exercised by real workloads.

The architecture notes (ADR) are part of the implementation rather than an afterthought. In particular, they spell out why
fiber stacks stay explicit, why logical state cannot depend on thread-local storage, and why spawn backpressure is an
ordinary capacity wait instead of an implicit allocation.

**Detailed list of commits:**

- [Fibers: Add Fibers library](https://github.com/Pagghiu/SaneCppLibraries/commit/8233a455)
- [Fibers: Define stack size classes](https://github.com/Pagghiu/SaneCppLibraries/commit/6c244af1)
- [Fibers: Add bounded scheduler injection](https://github.com/Pagghiu/SaneCppLibraries/commit/559a52e7)
- [Fibers: Publish task status atomically](https://github.com/Pagghiu/SaneCppLibraries/commit/91e67f7e)
- [Fibers: Reclaim tasks through worker registries](https://github.com/Pagghiu/SaneCppLibraries/commit/73a36e73)
- [Fibers: Stabilize shutdown and bridge lifetime](https://github.com/Pagghiu/SaneCppLibraries/commit/b00700c5)
- [Fibers: Enforce runtime call contexts](https://github.com/Pagghiu/SaneCppLibraries/commit/b27ec2a5)
- [Fibers: Retain task group results until reset](https://github.com/Pagghiu/SaneCppLibraries/commit/725f4a8f)

# AsyncFibers

The companion library started the month under the name `FibersAsync`. It is now called
<a href="https://pagghiu.github.io/SaneCppLibraries/library_async_fibers.html">`AsyncFibers`</a>, which describes the
direction more clearly: it is the bridge from `Fibers` to `Async`.

`AsyncFibers` lets a scheduled fiber wait for asynchronous sockets, files, timers, process exits, and other operations
using ordinary function calls. The bridge does not own another I/O runtime or scheduler. It joins a caller-owned
`AsyncEventLoop` to a caller-owned `FiberScheduler`, suspends the current fiber while an `AsyncRequest` is pending, and
wakes that fiber when the completion is ready.

That makes it useful for code that is easier to write as nested functions than as callbacks or coroutines. It also keeps
the trade-offs visible: every concurrent fiber needs an explicitly sized stack, the event loop remains owner-thread
affine, cross-thread commands use bounded caller-provided storage, and operation results are returned through small
explicit output records.

This is a different shape from both callback-style `Async` and C++20 `Await`. `AsyncFibers` does not turn arbitrary
blocking calls into cooperative waits, and it does not add a second hidden loop. It is a focused adapter for applications
that already want stackful cooperative tasks.

The rename happened at the end of the month, after the implementation and architecture had settled enough that the
public name could be corrected without hiding the history.

**Detailed list of commits:**

- [FibersAsync: Add FibersAsync library](https://github.com/Pagghiu/SaneCppLibraries/commit/51b68282)
- [AsyncFibers: Rename FibersAsync library](https://github.com/Pagghiu/SaneCppLibraries/commit/e9031e8b)

# Benchmark evaluation is in progress

The benchmark evaluation is still in progress, but the first conservative results are encouraging.

The safest baseline so far is a quiet-machine Release run on an Apple M1 Pro, using macOS 15.7.2 and Apple Clang 17.
Across five measured runs, one million reusable stackful `FiberTask` executions completed at a median rate above
700,000 tasks per second. The same baseline sustained more than 7.7 million cooperative yields per second, scaled
useful CPU work by 3.7x from one to four workers, and demonstrated 100,000 simultaneously suspended fibers.

These measurements use bounded, caller-controlled storage without hidden runtime allocation. They are useful numbers,
but they are measurements of a particular machine and build configuration, not a universal performance promise.

There is also a sneak peek at the work that followed. More recent optimization runs have crossed one million stackful
tasks per second, with one validated local checkpoint reaching approximately 1.46 million per second. The new
stackless `FiberJob` path has produced multi-million-job-per-second results, and the opt-in Skynet benchmark is making
the scheduler overhead easier to compare with an established task runtime.

The benchmark work is also useful as a design tool. It has exposed the cost of worker wake-ups, external task
injection, stack reservation, and scheduler coordination much more clearly than a single end-to-end timing ever could.

**Detailed list of commits:**

- [Fibers: Isolate scheduler throughput benchmarks](https://github.com/Pagghiu/SaneCppLibraries/commit/a490bd73)
- [Fibers: Stabilize micro-task benchmark samples](https://github.com/Pagghiu/SaneCppLibraries/commit/3207c65f)
- [Fibers: Add isolated density benchmark mode](https://github.com/Pagghiu/SaneCppLibraries/commit/e3fdbbc2)
- [Fibers: Add suspended density milestones](https://github.com/Pagghiu/SaneCppLibraries/commit/66fcde48)
- [Fibers: Report per-worker benchmark diagnostics](https://github.com/Pagghiu/SaneCppLibraries/commit/d082d600)
- [Fibers: Measure async stack high water](https://github.com/Pagghiu/SaneCppLibraries/commit/61ecdb14)
- [Fibers: Add scale-up benchmarks](https://github.com/Pagghiu/SaneCppLibraries/commit/11d74982)
- [Fibers: Add opt-in Skynet comparison](https://github.com/Pagghiu/SaneCppLibraries/commit/3c2376b6)
- [Fibers: Benchmark concurrent external producers](https://github.com/Pagghiu/SaneCppLibraries/commit/5361462b)

# Stackless jobs and scheduler work

Once the first stackful benchmarks were stable enough to guide the next experiments, the project started exploring a
second scheduling shape: stackless `FiberJob` records.

Stackful fibers are a good fit when a task needs to suspend through ordinary helper functions. Smaller CPU jobs do not
always need a private stack, so `FiberJob` keeps the job record and scheduling storage separate from `FiberTask`. July
added bounded job pools, job groups, worker records, work stealing, cancellation, retention rules, and a worker-pool
path with explicit storage.

The last part of the month focused on batching. Jobs can be published in contiguous batches, workers can retain their
state between waves, and local publication can wake a parked peer without broadcasting to every worker. This is still
active engineering, but the direction is promising: the benchmark becomes a way to test a specific scheduling policy,
not just a scoreboard.

The most interesting early result came from the Skynet workload. A four-worker depth-six sample moved from roughly
137.7 ms to 70.8 ms after the local-batch wake policy was tightened, with later samples around 46-48 ms. Taskflow was
around 31.8 ms in that particular comparison.

**Detailed list of commits:**

- [Fibers: Prototype bounded stackless jobs](https://github.com/Pagghiu/SaneCppLibraries/commit/5859a0ed)
- [Fibers: Add bounded job groups](https://github.com/Pagghiu/SaneCppLibraries/commit/75f263e0)
- [Fibers: Baseline pooled job lifecycle](https://github.com/Pagghiu/SaneCppLibraries/commit/86dd1818)
- [Fibers: Add stackless job worker pool](https://github.com/Pagghiu/SaneCppLibraries/commit/d4f051d4)
- [Fibers: Add stackless Skynet benchmark](https://github.com/Pagghiu/SaneCppLibraries/commit/60caa73d)
- [Fibers: Add sustained job benchmark](https://github.com/Pagghiu/SaneCppLibraries/commit/a1c0571c)
- [Fibers: Publish job batches transactionally](https://github.com/Pagghiu/SaneCppLibraries/commit/63bb3294)
- [Fibers: Batch Skynet child jobs](https://github.com/Pagghiu/SaneCppLibraries/commit/151d9205)
- [Fibers: Recruit local batch workers gradually](https://github.com/Pagghiu/SaneCppLibraries/commit/ef30a63e)
- [Fibers: Prove parked local batch wake](https://github.com/Pagghiu/SaneCppLibraries/commit/5c99e5ce)
- [Fibers: Expose Skynet idle spin policy](https://github.com/Pagghiu/SaneCppLibraries/commit/31be11f1)

# Documentation and other work

The new libraries also forced the documentation and examples to become more concrete.
`FibersDemo` now covers CPU fibers, `AsyncFibers` sleeps, and worker-pool I/O, while `FibersBenchmark` and the optional
Skynet benchmark make the performance experiments reproducible from the repository. The dependency graph copies for
both libraries are now part of the documentation inputs as well.

There was a broader documentation pass during the month: the practical guides and examples guide were rewritten, the
example videos were organized, user integration sizes were explained, and the library pages received styling and
content improvements.

On the HTTP side, TLS-related options were removed from the lower-level HTTP surface as the platform boundary becomes
clearer. 

**Detailed list of commits:**

- [Documentation: Improve library pages](https://github.com/Pagghiu/SaneCppLibraries/commit/4416d6f8)
- [Documentation: Rewrite practical guides](https://github.com/Pagghiu/SaneCppLibraries/commit/720e980b)
- [Documentation: Rewrite examples guide](https://github.com/Pagghiu/SaneCppLibraries/commit/20c18bd7)
- [Documentation: Explain user integration sizes](https://github.com/Pagghiu/SaneCppLibraries/commit/d876f37f)
- [Documentation: Feature example videos](https://github.com/Pagghiu/SaneCppLibraries/commit/4251a3e8)
- [Documentation: Copy Fibers and FibersAsync dependency graph SVG](https://github.com/Pagghiu/SaneCppLibraries/commit/f76eed9e)
- [Http: Remove TLS related options](https://github.com/Pagghiu/SaneCppLibraries/commit/248df387)

See you next month!
