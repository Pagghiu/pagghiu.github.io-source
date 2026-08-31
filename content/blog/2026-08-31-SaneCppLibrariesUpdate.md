Title: 🌊 Sane C++ August 26
Date: 2026-08-31
Category: SaneCppLibraries
Image: 2026-08-31-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2026-08-31-SaneCppLibrariesUpdate
Summary: Welcome to the August 2026 update!<br> This month introduces the new `Cryptography` library, adds native and optional OpenSSL backends, connects cryptography to `AsyncStreams`, and continues the `Fibers` work with incremental stacks and tighter scheduling evidence.
TOC:    #section-0,August Updates
        #cryptography,Cryptography
        #native-and-openssl-backends,Native and OpenSSL Backends
        #cryptography-and-asyncstreams,Cryptography and AsyncStreams
        #fibers-incremental-stacks-and-scheduling,Fibers: Incremental Stacks and Scheduling
        #contracts-tooling-and-ci,Contracts, Tooling and CI

# Cryptography

The biggest addition this month is the new
<a href="https://pagghiu.github.io/SaneCppLibraries/libraries/cryptography/">`Cryptography`</a> library.

It provides a small synchronous interface for secure random bytes, AES-GCM, HMAC, HKDF, and legacy AES-CBC with
PKCS#7 padding. Inputs and outputs are caller-owned spans, public objects keep provider state in fixed inline storage,
and the native implementation delegates primitive operations to the operating system instead of bundling a portable
cryptographic implementation.

The scope is intentionally narrow. This is a low-level primitive adapter, not a protocol library. It does not provide
password hashing, signatures, public-key cryptography, certificate validation, key storage, nonce allocation, or
protocol framing. AES-GCM is the preferred authenticated-encryption API; CBC remains available only for compatibility
with protocols that already specify the required authentication, IV, framing, and failure rules.

`Cryptography` is still Draft and has not received a formal cryptographic or side-channel audit. The implementation has
NIST known-answer vectors, mutation tests, deterministic stress coverage, and cross-platform CI, but those are not a
replacement for a security review. I want that boundary to stay visible while the API and backend coverage are still
evolving.

The AES-GCM coverage now also compares the native and OpenSSL backends directly. It exercises message and associated-data
boundary sizes, in-place operation, cross-backend decryption, and corrupted ciphertext, tags, and AAD. This catches
provider differences that known-answer vectors alone may not expose.

The API also makes provider capability discovery explicit. Applications query the active backend before selecting a
primitive instead of assuming that every algorithm is available just because the code compiled. This matters most on
Linux, where the native `AF_ALG` algorithms are runtime kernel capabilities rather than build-time guarantees.

**Detailed list of commits:**

- [Cryptography: Add native symmetric cryptography library](https://github.com/Pagghiu/SaneCppLibraries/commit/30c307c2)
- [Cryptography: Add deterministic CBC streaming stress coverage](https://github.com/Pagghiu/SaneCppLibraries/commit/4aa30751)
- [Cryptography: Harden Draft contracts and test coverage](https://github.com/Pagghiu/SaneCppLibraries/commit/4c7ae30f)
- [Cryptography: Expose maximum AEAD associated data size in Features](https://github.com/Pagghiu/SaneCppLibraries/commit/5e345569)
- [Cryptography: Distinguish Windows authentication failures from parameter errors](https://github.com/Pagghiu/SaneCppLibraries/commit/bc25f954)
- [Cryptography: Widen NIST GCM corpus and pin HMAC long-key behavior](https://github.com/Pagghiu/SaneCppLibraries/commit/90e6bf5d)
- [Cryptography: Add AES-GCM backend differential testing](https://github.com/Pagghiu/SaneCppLibraries/commit/dfc0508f)
- [Cryptography: Fix Windows build broken by ntstatus.h include](https://github.com/Pagghiu/SaneCppLibraries/commit/33142803)
- [Cryptography: Complete Draft capability coverage](https://github.com/Pagghiu/SaneCppLibraries/commit/07b205d9)
- [Cryptography: Add public umbrella header](https://github.com/Pagghiu/SaneCppLibraries/commit/0bb57bb9)

# Native and OpenSSL Backends

The native backend uses the platform facilities already present on each operating system: CommonCrypto on Apple, CNG
on Windows, and `getrandom()` plus `AF_ALG` on Linux. The public API stays the same, while `queryFeatures()` reports
what the selected backend can actually provide in the running process.

AES-GCM took the most platform-specific work. Linux uses the kernel AEAD interface with a bounded associated-data
contract. Apple now has a narrowly scoped GCM composition over CommonCrypto AES because CommonCrypto does not expose a
public GCM interface. The implementation keeps that construction private and exercises both key sizes with shared NIST
vectors and corruption tests. Windows uses the native CNG authenticated-cipher path.

An optional OpenSSL 3 backend is also available on macOS, Windows, and Linux. It is selected explicitly and loaded at
runtime, so Sane C++ still has no OpenSSL header or link-time dependency. A missing or policy-restricted OpenSSL library
simply reports its features as unavailable and does not change the native backend.

There is an important allocation distinction here. The native Sane adapters use fixed storage and caller-owned buffers.
When OpenSSL is selected, OpenSSL may allocate provider, algorithm, process, thread, and session state internally. The
backend choice is therefore visible in both capability reporting and the end-to-end allocation contract.

The CI matrix now exercises OpenSSL cryptography on all three platforms. Windows uses a bundled OpenSSL 3 package so
the optional backend is tested from the same repeatable setup rather than relying on an arbitrary machine installation.
The Debug jobs also run the native, OpenSSL, `AsyncStreams`, and transform-stream cryptography suites under ASan and
UBSan on macOS and Linux.

**Detailed list of commits:**

- [Cryptography: Add Linux AES-GCM backend](https://github.com/Pagghiu/SaneCppLibraries/commit/6eaf2d5f)
- [CI: Require Linux AES-GCM cryptography coverage](https://github.com/Pagghiu/SaneCppLibraries/commit/a2794e0b)
- [Cryptography: Add Apple AES-GCM backend](https://github.com/Pagghiu/SaneCppLibraries/commit/28ece212)
- [Cryptography: Record Swift interoperability boundary](https://github.com/Pagghiu/SaneCppLibraries/commit/e53e09fd)
- [Cryptography: Treat Linux primitives as runtime capabilities](https://github.com/Pagghiu/SaneCppLibraries/commit/036af4dc)
- [Cryptography: Offer OpenSSL alongside Linux AF_ALG](https://github.com/Pagghiu/SaneCppLibraries/commit/bae77729)
- [Cryptography: Load OpenSSL on Apple and Windows](https://github.com/Pagghiu/SaneCppLibraries/commit/5b42ade4)
- [Cryptography: Stabilize OpenSSL single-file coverage](https://github.com/Pagghiu/SaneCppLibraries/commit/13723129)
- [CI: Exercise OpenSSL cryptography on all platforms](https://github.com/Pagghiu/SaneCppLibraries/commit/233d3656)
- [CI: Use bundled Windows OpenSSL 3](https://github.com/Pagghiu/SaneCppLibraries/commit/341e4e3f)
- [CI: Gate Cryptography with sanitizers](https://github.com/Pagghiu/SaneCppLibraries/commit/a274a308)

# Cryptography and AsyncStreams

The new library also connects to
<a href="https://pagghiu.github.io/SaneCppLibraries/libraries/async-streams/">`AsyncStreams`</a> without creating a
hard dependency between them.

`CryptographyTransformStreams.h` contains header-only templates that can adapt a caller-selected cipher or HMAC
session. An application includes both libraries and instantiates the concrete type only where it builds the pipeline.
That keeps `Cryptography` synchronous, keeps `AsyncStreams` independent from a specific cryptography implementation,
and still allows encrypted or authenticated data to participate in a bounded asynchronous pipeline.

The cipher transform supports the incremental CBC interface, while the HMAC adapter is a sink that can share source
buffers with a file or network destination through normal pipeline fan-out. The same adapters can receive an explicitly
selected native or OpenSSL session.

There is deliberately no generic AES-GCM byte-stream transform. Safe AEAD decryption needs a bounded record protocol
that defines nonces, tags, AAD, framing, and when plaintext may be released. Those policy decisions should not be
hidden inside something that looks like an ordinary stream transform.

**Detailed list of commits:**

- [AsyncStreams: Add templated cryptography adapters](https://github.com/Pagghiu/SaneCppLibraries/commit/43cd3279)

# Fibers: Incremental Stacks and Scheduling

August also continued the work on
<a href="https://pagghiu.github.io/SaneCppLibraries/libraries/fibers/">`Fibers`</a>.

The largest addition is opt-in incremental stack commitment. A `FiberStackClass` can reserve the full virtual range but
initially commit only a bounded portion, then grow that commitment when the active fiber reaches a protected page. Full
commitment remains the default and the simpler portable option.

This is necessarily platform-sensitive work. A process-wide `FiberStackGrowthRuntime` owns fault-handler integration,
and every OS thread that may execute an incremental stack registers thread-affine growth state. POSIX workers use
caller-owned alternate signal-stack storage; Windows uses native guard-page behavior. Migration republishes the active
slot on the new worker, teardown releases the actual committed interval, and unsupported debugger or sanitizer
configurations reject incremental execution rather than silently changing fault ownership.

The benchmarks can now compare full and incremental commitment at equal virtual reservation, separating metadata,
current and peak commitment, suspension, wake, and completion costs. There are also two more practical bounded examples:
`FibersMandelbrot` uses stackless jobs for image rows, while `AsyncFibersFileCopy` combines fiber-shaped control flow with
asynchronous file operations.

The scheduler and benchmark paths received another correctness pass too. External injection claims are transactional,
local job wakes are coalesced behind visible backlog, cancellation reuses the existing generation, and uncontended
batches avoid unnecessary wake generations. The Skynet benchmark now assigns deterministic breadth-first slots instead
of serializing the SC backends through a benchmark-only allocation counter. That correction makes the comparison more
useful, even though benchmark results still remain machine- and configuration-specific development evidence.

**Detailed list of commits:**

- [Fibers: Separate producer benchmark timing](https://github.com/Pagghiu/SaneCppLibraries/commit/64a1a1cf)
- [Fibers: Synchronize stack growth probe](https://github.com/Pagghiu/SaneCppLibraries/commit/3e900c0f)
- [Fibers: Focus scheduler benchmark workers](https://github.com/Pagghiu/SaneCppLibraries/commit/94366c09)
- [Fibers: Preserve benchmark symbols](https://github.com/Pagghiu/SaneCppLibraries/commit/dc8e0788)
- [Fibers: Isolate scheduler benchmark workloads](https://github.com/Pagghiu/SaneCppLibraries/commit/b7d17c79)
- [Fibers: Distribute injected task registries](https://github.com/Pagghiu/SaneCppLibraries/commit/61d40c85)
- [Fibers: Claim injection batches transactionally](https://github.com/Pagghiu/SaneCppLibraries/commit/776ffbf0)
- [Fibers: Define incremental stack ownership](https://github.com/Pagghiu/SaneCppLibraries/commit/c71c85e6)
- [Fibers: Add stack growth lifecycles](https://github.com/Pagghiu/SaneCppLibraries/commit/0adacd4d)
- [Fibers: Register stack growth workers](https://github.com/Pagghiu/SaneCppLibraries/commit/3265c1ff)
- [Fibers: Add incremental stack metadata](https://github.com/Pagghiu/SaneCppLibraries/commit/a5940ae0)
- [Fibers: Execute incremental stack classes](https://github.com/Pagghiu/SaneCppLibraries/commit/5d1be335)
- [Fibers: Guard incremental high-water scans](https://github.com/Pagghiu/SaneCppLibraries/commit/59c6f1d2)
- [Fibers: Compare stack commitment density](https://github.com/Pagghiu/SaneCppLibraries/commit/29249b1f)
- [Fibers: Coalesce local job batch wakes](https://github.com/Pagghiu/SaneCppLibraries/commit/a115e351)
- [Fibers: Add bounded consumer examples](https://github.com/Pagghiu/SaneCppLibraries/commit/e699ac7b)
- [Fibers: Cover nested stack fault forwarding](https://github.com/Pagghiu/SaneCppLibraries/commit/74302549)
- [Fibers: Preserve Windows guard dispatch space](https://github.com/Pagghiu/SaneCppLibraries/commit/5d62c79a)
- [Fibers: Keep Windows stack limit on guard](https://github.com/Pagghiu/SaneCppLibraries/commit/9e352a7a)
- [Fibers: Accept native terminal stack faults](https://github.com/Pagghiu/SaneCppLibraries/commit/68e25100)
- [Fibers: Forward nested POSIX stack faults](https://github.com/Pagghiu/SaneCppLibraries/commit/d4d1b0a2)
- [Fibers: Correct Skynet scheduling evidence](https://github.com/Pagghiu/SaneCppLibraries/commit/12a952da)
- [Fibers: Coalesce local single-job wakes](https://github.com/Pagghiu/SaneCppLibraries/commit/84143b7d)
- [Fibers: Preserve single-job parallelism](https://github.com/Pagghiu/SaneCppLibraries/commit/2110fae2)
- [Fibers: Streamline job cancellation preflight](https://github.com/Pagghiu/SaneCppLibraries/commit/28e37c52)
- [Fibers: Reuse cancellation generation for job stop](https://github.com/Pagghiu/SaneCppLibraries/commit/2c37d971)
- [Fibers: Avoid uncontended batch wake generations](https://github.com/Pagghiu/SaneCppLibraries/commit/01e1d633)

# Contracts, Tooling and CI

The remaining changes are smaller, but they tighten a few important edges.

`Async` can now remove loop timeouts synchronously from its userspace schedule. `FileSystemWatcher` tests preserve the
asynchronous event contract instead of allowing callback ordering to become accidental. The Fil-C package uses a more
reliable zlib source, and `AsyncStreams` has a Windows registry fallback for finding zlib.

The new cryptography work also exposed adjacent Windows integration issues. `Hashing` now links its CryptoAPI backend
correctly, and the CI jobs cover both native and OpenSSL cryptography paths rather than validating only compilation.
The generated library metrics and dependency documentation were refreshed as well, including the new `Cryptography`
dependency graph.

**Detailed list of commits:**

- [Documentation: Replace broken links for Fibers and AsyncFibers](https://github.com/Pagghiu/SaneCppLibraries/commit/8cc8976f)
- [Fibers: Fix Windows example discovery](https://github.com/Pagghiu/SaneCppLibraries/commit/4348a7d8)
- [FileSystemWatcher: Preserve async event semantics](https://github.com/Pagghiu/SaneCppLibraries/commit/22ded0e6)
- [Build: Use reliable Fil-C zlib source](https://github.com/Pagghiu/SaneCppLibraries/commit/6c6bf978)
- [Async: Unschedule loop timeouts synchronously](https://github.com/Pagghiu/SaneCppLibraries/commit/f2feff2f)
- [AsyncStreams: Link Windows zlib registry fallback](https://github.com/Pagghiu/SaneCppLibraries/commit/1281c5bd)
- [Hashing: Link Windows CryptoAPI backend](https://github.com/Pagghiu/SaneCppLibraries/commit/29b1d94c)
- [Documentation: Update LOC for August 2026](https://github.com/Pagghiu/SaneCppLibraries/commit/250d9f41)

See you next month!
