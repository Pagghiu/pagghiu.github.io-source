import { atomFeed, getPostsForTag } from "../../lib/blog-data";

export function GET() {
  return new Response(atomFeed(getPostsForTag("sanecpplibraries"), "Sane C++ Libraries"), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8"
    }
  });
}
