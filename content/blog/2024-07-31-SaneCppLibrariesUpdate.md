Title: 🏖️ Sane C++ July 24
Date: 2024-07-31
Category: SaneCppLibraries
Template: article_sanecpp
Image: 2024-07-31-SaneCppLibrariesUpdate/article.png
Slug: site/blog/2024-07-31-SaneCppLibrariesUpdate
Summary: Welcome to the update post for July 2024!<br>The focus of the month has been building a nicer showcase for <code>SC::Plugin</code> and <code>SC::Serialization</code> libraries.

<aside id="table-of-contents">
  <nav class="is-sticky-above-lg ">
    <details open="">
      <summary>Content</summary>
      <ul>
        <li><a class="secondary" href="#section-0">Sane C++ June 2024</a></li>
        <li><a class="secondary" href="#section-1">SCExample</a></li>
        <li><a class="secondary" href="#section-2">SC::Serialization</a></li>
        <li><a class="secondary" href="#section-3">SC::Plugin</a></li>
        <li><a class="secondary" href="#section-4">SC::Build</a></li>
        <li><a class="secondary" href="#section-5">Contributions</a></li>
        <li><a class="secondary" href="#section-6">Additional fixes</a></li>
      </ul>
    </details>
  </nav>
</aside>
<div id="content" role="document">

<section>
<h2>SCExample<a href="#section-1" id="section-1" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">Serializer example</p>
<p>
The hot-reload system of SCExample has been tuned so that each internal example is just an hot-reloaded Plugin.
It's now very convenient to iteratively build them and experiment!
A nice serialization example has been added to SCExample,  based on a very well known piece of code from the official imgui demo.
State of the canvas control is saved to binary and json using the automatic serialization provided by the reflection system.
It's also showing a somewhat advanced usage of the Reflection system, that is how to wrap a "custom" vector implementation (ImVector<T>)


<iframe width="700" height="400" src="https://github.com/user-attachments/assets/2a38310c-6a28-4f86-a0f3-665dc15b126d" frameborder="0" allowfullscreen>
</iframe>

There is a video where I've been recording the most important bits of this development:                    
<p>
  <iframe width="560" height="314" src="https://www.youtube-nocookie.com/embed/d7DXxC6xG_A?si=vyQhUZ_vU5Rtn0pi"
  title="YouTube video player" frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen></iframe>  
</p>

And as a last nicety, SCExample has been fully ported to iOS!
Hot-reload obviously requires root access to install clang compiler and a sysroot on iOS, so it will work only if you have an active jailbreak.

Also here I've been recording a video on finalizing porting SCExample to iOS.


<p>
  <iframe width="560" height="314" src="https://www.youtube-nocookie.com/embed/6DfykfYCQdY?si=vyQhUZ_vU5Rtn0pi"
  title="YouTube video player" frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen></iframe>  
</p>


This is the list of SCExample related commits:
<ul>

<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/85e6352b" target="_new">SCExample: Port to iOS</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/c839d17f" target="_new">SCExample: Show compile errors when hovering examples</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/641c9276" target="_new">SCExample: Refactoring hot-reload plugins as examples</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/b14ef5ed" target="_new">SCExample: Add Serialization example</a></li>
</ul>
</p>
</section>


<section>
<h2>SC::Serialization<a href="#section-2" id="section-2" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">Serialize all the things</p>
<p>

While building the Serialization example, a few fixes have been made necessary to 
<code><a href="https://pagghiu.github.io/SaneCppLibraries/library_serialization_binary.html" target="_blank">SC::SerializationBinary</a></code>.
The first has been supporting the bool data type that for some obscure reason was missing from the primitive types.
Some helpers to read and write the schema together with serialized data have been added to make it easy supporting versioned binary serialization.
Fields can be added or removed, and the serializer will still try to load data that can be converted assuming a matching order.
There is also some support for changing field types. For example a float field that is converted to int (or vice-versa) will receive a truncated value on deserialization.

<ul>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/fe203bb1" target="_new">Reflection: Add vector manipulation methods to ExtendedTypeInfo</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/0419d749" target="_new">Reflection: Support bool primitive type</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/f83bb784" target="_new">SerializationBinary: Add writeWithSchema and loadVersionedWithSchema</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/03ef3a13" target="_new">SerializationBinary: Reduce boilerplate needed to wrap a custom vector container</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/18d871c2" target="_new">SerializationBinary: Support bool primitive type</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/89814957" target="_new">SerializationText: Reduce boilerplate needed to wrap a custom vector container</a></li>
</ul>


</p>
</section>


<section>
<h2>SC::Plugin<a href="#section-3" id="section-3" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">Hot-Reload like there is no tomorrow</p>
<p>

<code><a href="https://pagghiu.github.io/SaneCppLibraries/library_plugin.html" target="_blank">SC::Plugin</a></code>  library has received a few improvements, 
like the ability to specify a path for the sysroot under clang (needed on iOS), and it's capturing compiler and linker outputs.
This last one allows showing compile errors in the plugin host app, that is a nice addition to SCExample.
Finally some dynamic export clauses have been added to many libraries in order for Plugins to find symbols in the host application that is loading them.
This will for sure increase the executable size as the linker will not be able to trim such classes as "unused" code, even if they're not referenced by any Plugin.
Probably some macro to disable this "export by default" behavior will be added for anyone that wants to use Sane C++ Libraries without the Plugin Library or without 
needing to use Sane C++ Libraries type across dynamic library boundaries.

<ul>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/e6d21a84" target="_new">Plugin: Allow overriding isysroot path</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/61b89284" target="_new">Plugin: Capture compiler and linker output</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/1ffb8749" target="_new">Everywhere: Add export clause for use across Plugin boundaries</a></li>
</ul>


</p>
</section>



<section>
<h2>SC::Build<a href="#section-4" id="section-4" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">Actually got a promotion!</p>
<p>
<code><a href="https://pagghiu.github.io/SaneCppLibraries/library_build.html" target="_blank">SC::Build</a></code> library has 
received some improvements too, supporting generation of iOS project and application icon for Xcode app bundle.
There are still many missing features and too many hardcoded defaults but I feel that the library deserves more than a Draft status.
For this reason I've been promoting it to MVP status: maybe this will become an incentive to add more features to make it usable!

<ul>

<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/d865cc41" target="_new"> Build: Add iOS storyboard generation</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/ca0fb7b6" target="_new"> Build: Elevate to MVP status</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/6551c1e3" target="_new"> Build: Support application icon in Xcode app bundles</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/70d32b7d" target="_new"> Build: Support iOS</a></li>
</ul>

</p>
</section>


<section>
<h2>Contributions<a href="#section-5" id="section-5" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">Together we can build more!</p>
<p>          
This month <a href="https://x.com/_plop_" target="_new">Jeremy Laumon</a> has been adding <code>.natvis</code> support for Arrays!

<ul>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/415dc323" target="_new">DebugVisualizers: Add natvis for SegmentedItems and Array</a></li>
</ul>          
</p>
</section>



<section>
<h2>Additional fixes<a href="#section-6" id="section-6" class="secondary" tabindex="-1">#</a></h2>
<p class="chapter">Fix fix fix</p>
<p>

And then the usual amount of monthly fixes!
I can never stress how important is to use the libraries in a real project or even just in an example app to trigger issues and identify missing bits!
<ul>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/050bad6a" target="_new">Strings: Export String and some SmallString<N> for use across Plugin boundaries</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/1d485307" target="_new">Containers: Fix some incorrect Array member functions</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/20f2dd9b" target="_new">FileSystemWatcher: Add internal header with FSEvents declarations for iOS</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/54fb28bc" target="_new">Documentation: Improve README and fix descriptions of some libraries</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/5a72dcf1" target="_new">FileSystem: Add read and write overloads for uint8_t</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/915367a5" target="_new">Strings: Fix doubles parsing</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/a176a3e7" target="_new">Everywhere: Add lifetime bound attribute for StringViews and Spans</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/e3121af6" target="_new">Foundation: Add Span::reinterpret_as_array_of<T>()</a></li>
<li><a href="https://github.com/Pagghiu/SaneCppLibraries/commit/e5475aff" target="_new">Tools: Use Github to download doxygen releases</a></li>

</ul>


</p>
</section>

</div>