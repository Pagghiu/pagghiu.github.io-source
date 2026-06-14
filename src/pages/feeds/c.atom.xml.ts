import { atomFeed, getPostsForTag } from "../../lib/blog-data";

export function GET() {
  return new Response(atomFeed(getPostsForTag("c"), "C++"), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8"
    }
  });
}
