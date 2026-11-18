import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const requiredString = (field: string) =>
  z.string({
    error: (issue) =>
      issue.input === undefined
        ? `Required frontmatter missing: ${field}`
        : `${field} must be a string`,
  });

const baseSchema = z.object({
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  previewImage: z.string().optional(),
  title: requiredString("title"),
  date: z.date({
    error: (issue) =>
      issue.input === undefined
        ? "Required frontmatter missing: date"
        : "date must be written in yyyy-mm-dd format without quotes: For example, Jan 22, 2000 should be written as 2000-01-22.",
  }),
});

/*
  A post is either written here in markdown, or links out to an external site.
  External posts are listed but get no page of their own.
*/
const postSchema = z.discriminatedUnion("external", [
  baseSchema.extend({
    external: z.literal(false),
    description: z.string().optional(),
    ogImagePath: z.string().optional(),
    canonicalUrl: z.string().optional(),
  }),
  baseSchema.extend({
    external: z.literal(true),
    url: requiredString("url"),
  }),
]);

const postCollection = (directory: string) =>
  defineCollection({
    loader: glob({ pattern: "*.md", base: `./content/${directory}` }),
    schema: postSchema,
  });

export const collections = {
  blog: postCollection("blog"),
  reading: postCollection("reading"),
};
