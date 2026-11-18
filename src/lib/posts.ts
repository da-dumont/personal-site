import { getCollection, type CollectionEntry } from "astro:content";
import Markdoc from "@markdoc/markdoc";
import { config } from "./markdoc/markdoc.config";

export const POST_COLLECTIONS = ["blog", "reading"] as const;
export type PostCollection = (typeof POST_COLLECTIONS)[number];
export type Post = CollectionEntry<PostCollection>;

/** How each collection is named and where its index lives. */
export const COLLECTION_PAGES: Record<PostCollection, { label: string; href: string }> = {
  blog: { label: "Writing", href: "/blog" },
  reading: { label: "Reading", href: "/reading" },
};

/** Non-draft posts in a collection, newest first. */
export async function getPublishedPosts(collection: PostCollection): Promise<Post[]> {
  const posts = await getCollection(collection, ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Where a post lives: its page here, or the site an external post points to. */
export function postHref(post: Post): string {
  return post.data.external ? post.data.url : `/${post.collection}/${post.id}`;
}

/**
  The view-transition name a post's preview image shares between its list entry and its page,
  so the image morphs into place on navigation (pages opt in with @view-transition in PageLayout).
*/
export function imageTransitionName(postId: string): string {
  return `post-image-${postId}`;
}

/** Rough minutes to read a post's body, at about 230 words a minute. */
export function readingMinutes(post: Post): number {
  const words = (post.body ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
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
