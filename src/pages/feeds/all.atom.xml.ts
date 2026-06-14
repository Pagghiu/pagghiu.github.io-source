import { atomFeed, getBlogPosts } from "../../lib/blog-data";

export function GET() {
  return new Response(atomFeed(getBlogPosts()), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8"
    }
  });
}
