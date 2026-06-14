Title: ❄️ Sane C++ January 24
Date: 2024-01-23
Category: SaneCppLibraries
Template: article_sanecpp
Image: 2024-01-23-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2024-01-23-SaneCppLibrariesUpdate
Summary: One month has passed since the initial release of Sane C++ Libraries 🎉🎉🎉<br>This post collects all relevant events happened during the first month of (public) life of the project.

<aside id="table-of-contents">
<nav class="is-sticky-above-lg ">
<details open="">
<summary>Content</summary>
<ul>
<li><a class="secondary" href="#section-0">Sane C++ February 2024</a></li>
<li><a class="secondary" href="#section-1">Code</a></li>
<li><a class="secondary" href="#section-2">Github Releases</a></li>
<li><a class="secondary" href="#section-3">Hacker News</a></li>
<li><a class="secondary" href="#section-4">Github</a></li>
<li><a class="secondary" href="#section-5">YouTube</a></li>
</ul>
</details>
</nav>
</aside>
<div id="content" role="document">
<section>
<article>
<h5>Code</h5>
Code is always the most important news!👨🏻‍💻<br>
This is the month marking official Linux support for all Libraries!! 🐧
<br>
<br>
✅ <a href="https://pagghiu.github.io/SaneCppLibraries/library_async.html" target="_blank">SC::Async</a> got an
epoll Linux backend.<br>
✅ <a href="https://pagghiu.github.io/SaneCppLibraries/library_file_system_watcher.html"
target="_blank">SC::FileSystemWatcher</a> got an inotify Linux backend.<br>
✅ <a href="https://pagghiu.github.io/SaneCppLibraries/library_process.html" target="_blank">SC::Process</a>
has been made more solid on Posix in general (including Linux).<br>
✅ <a href="https://pagghiu.github.io/SaneCppLibraries/library_build.html" target="_blank">SC::Build</a> got a
Makefile generator for Linux (and macOS).<br>
✅ <a href="https://pagghiu.github.io/SaneCppLibraries/library_strings.html"
target="_blank">SC::StringConverter</a> got UTF8 to / from UTF16 code path necessary on Linux.<br>
✅ <a href="https://pagghiu.github.io/SaneCppLibraries/library_plugin.html" target="_blank">SC::Plugin</a> got
necessary fixes to run on Linux.<br>

<h5>X (Twitter)</h5>
After the initial announcement I got a very warm social welcome on Twitter!<br>
This has been definitively the best way to start this journey!
<blockquote class="twitter-tweet">
<p lang="en" dir="ltr">Sane C++ Libraries has been open-sourced! 🎉<br><br>✅ Fast compile times<br>✅ Bloat
free<br>✅ Simple readable code<br>✅ Easy to integrate<br>⛔️ No C++ Standard Library / Exceptions<br>⛔️ No
third party dependencies<a href="https://t.co/D0DUDuAoSG">https://t.co/D0DUDuAoSG</a><br>Blog:<a
href="https://t.co/M8hyEQ9YWE">https://t.co/M8hyEQ9YWE</a><br><br>Retweet if you like it ❤️</p>&mdash;
Stefano Cristiano (@pagghiu_) <a
href="https://twitter.com/pagghiu_/status/1738349359266197892?ref_src=twsrc%5Etfw">December 23, 2023</a>
</blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<h5>Github</h5>
<p>
As of today, the Sane C++ Libraries has got 187 ⭐️ stars ⭐️ on <a
href="https://github.com/pagghiu/SaneCppLibraries" target="_blank">Github</a>
(<a href="https://github.com/pagghiu/SaneCppLibraries"><img
src="https://img.shields.io/github/stars/Pagghiu/SaneCppLibraries"></a>).<br>
The repo has also been in trending list for C++ for a couple of days!!<br>
This has been leaving me both completely mind-blown 🤯 and super happy about that 😎.<br>
<img src="{attach}/images/2024-01-23-SaneCppLibrariesUpdate/GithubTrending.jpg" alt="Sane C++ on Github Trending" />
</p>
<p>
For this reason I immediately went on the seaside to celebrate
(<a href="https://maps.app.goo.gl/53qgxUVyHuKHbuEx8" target="_blank">in Manfredonia</a>)!🍹<br>
</p>



<figure>
<img src="{attach}/images/2024-01-23-SaneCppLibrariesUpdate/SaneCppCelebration.jpg" width=90%>
<figcaption>Nice sunny south Italy day for being in December ❄️ 🥂 ❄️!</figcaption>
</figure>


<h5>Contributing</h5>
I have been writing some documents to help figuring out how to contribute to the project.
<p>
📃 <a href="https://github.com/Pagghiu/SaneCppLibraries/blob/main/CONTRIBUTING.md"
target="_blank">CONTRIBUTING.md</a><br>
📃 <a href="https://github.com/Pagghiu/SaneCppLibraries/blob/main/Documentation/CodingStyle.md"
target="_blank">Coding Style</a>
</p>

I've also starting to create some <a href="https://github.com/Pagghiu/SaneCppLibraries/issues"
target="_blank">Github Issues</a> with some <b>good first issue</b> labels to
help a potential contributor trying to look for some task to start with.

<h5>Discord</h5>
I have created the <a href="https://discord.gg/tyBfFp33Z6">Sane Coding Discord</a>.
<a href="https://discord.gg/tyBfFp33Z6"><img src="https://img.shields.io/discord/1195076118307426384"></a>
<br>
This is a place where to discuss about the library but it's not limited to that.<br>
Let's see if it can become a place of aggregation for anyone sharing similar ideas as shown in the project.

<h5>Youtube </h5>
<p>
In addition to the <a href="https://www.youtube.com/watch?v=5w1_rRXgyv0&t=1170s"
target="_blank">presentation youtube video</a> to introduce the library,
I have been producing 8 additional ones in the <a href="https://www.youtube.com/@Pagghiu"
target="_blank">Sane Coding Youtube channel</a>, mostly as an experiment and to document the process of
porting the library to Linux.<br>
I would really like to receive some feedback on the format! 😅<br>
So far I'm filming myself talking when trying to implement a feature in a reasonable (kinda) amount of time,
after I've already done research on how
to implement the feature and I have a pretty clear idea of what to do.<br>
As there are no cuts in the videos, it's possible sometimes getting to know my ⁉️🤔⁉️ face when something
doesn't work and I need to debug it.
</p>
<iframe width="280" height="157" src="https://www.youtube-nocookie.com/embed/2ccW8TBAWWE?si=vyQhUZ_vU5Rtn0pi"
title="YouTube video player" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>

<iframe width="280" height="157" src="https://www.youtube-nocookie.com/embed/wYmT3xAzMxU?si=vyQhUZ_vU5Rtn0pi"
title="YouTube video player" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>

<iframe width="280" height="157" src="https://www.youtube-nocookie.com/embed/DUZeu6VDGL8?si=vyQhUZ_vU5Rtn0pi"
title="YouTube video player" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>

<iframe width="280" height="157" src="https://www.youtube-nocookie.com/embed/gu3x3Y1zZLI?si=vyQhUZ_vU5Rtn0pi"
title="YouTube video player" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>

<iframe width="280" height="157" src="https://www.youtube-nocookie.com/embed/-OiVELMxL6Q?si=vyQhUZ_vU5Rtn0pi"
title="YouTube video player" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>

<iframe width="280" height="157" src="https://www.youtube-nocookie.com/embed/4rC4aKCD0V8?si=vyQhUZ_vU5Rtn0pi"
title="YouTube video player" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>

<iframe width="280" height="157" src="https://www.youtube-nocookie.com/embed/uCsGpJcF2oc?si=vyQhUZ_vU5Rtn0pi"
title="YouTube video player" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>

<iframe width="280" height="157" src="https://www.youtube-nocookie.com/embed/92saVDCRnCI?si=vyQhUZ_vU5Rtn0pi"
title="YouTube video player" frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen></iframe>

<h5>Next</h5>
So what's next? I will continue improving the library to make it become solid on all platforms.<br>
When I will identify some interesting developments, I will make sure to record them in a video 👀.<br>
<br>
Thank you for reading this far!<br><br>
Bye!👋🏼<br>
Pagghiu
</article>

</section>
</div>