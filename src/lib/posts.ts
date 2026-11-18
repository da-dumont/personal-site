import { getCollection, type CollectionEntry } from "astro:content";
import Markdoc from "@markdoc/markdoc";
import { config } from "./markdoc/markdoc.config";

export const POST_COLLECTIONS = ["blog", "reading"] as const;
export type PostCollection = (typeof POST_COLLECTIONS)[number];
export type Post = CollectionEntry<PostCollection>;

/** Non-draft posts in a collection, newest first. */
export async function getPublishedPosts(collection: PostCollection): Promise<Post[]> {
  const posts = await getCollection(collection, ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** A post date as shown on the site, e.g. "Sep 18, 2025". */
export function formatPostDate(date: Date): string {
  return date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Parse a post's Markdoc body into a tree for Renderer.astro, failing the build on invalid tags. */
export function renderPost(post: Post) {
  const ast = Markdoc.parse(post.body ?? "");
  const errors = Markdoc.validate(ast, config);
  if (errors.length) {
    console.error(errors);
    throw new Error(`Markdoc validation error in ${post.filePath}`);
  }
  return Markdoc.transform(ast, config);
}
