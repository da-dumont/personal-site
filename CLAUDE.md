# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `yarn dev` or `yarn start` - Start development server on port 3000
- `yarn build` - Build the site for production
- `yarn typecheck` - Type-check `.astro` and `.ts` files (`astro check`; not `yarn check`, which is a built-in yarn 1 command)
- `yarn preview` - Preview the built site locally
- `yarn clean` - Remove the dist directory

## Architecture Overview

This is an Astro-based personal blog/portfolio site built with TypeScript and Markdoc for content authoring.

### Key Components

- **Content Management**: Uses Markdoc for markdown processing with custom components
- **Content Structure**: Astro content collections defined in `src/content.config.ts`
  - `content/blog/` - Blog posts (`blog` collection, pages at `/blog/<file-name>`)
  - `content/reading/` - Book reviews/notes (`reading` collection, pages at `/reading/<file-name>`)
  - `content/blog/extended-markdown-style-guide.md` - Draft test page that uses every custom Markdoc tag; set `draft: false` locally to check embeds render, never publish it
- **Custom Markdoc Tags**: YouTube embeds, Twitter embeds, CodePen embeds, GitHub Gist embeds, and preview images
- **Rendering**: Custom renderer at `src/components/Renderer.astro` handles Markdoc output

### File Structure

- `src/config.ts` - Site configuration (title, description, social handles)
- `src/content.config.ts` - Content collections and the frontmatter schema
- `src/lib/posts.ts` - Loading, sorting, date formatting and Markdoc rendering for posts
- `src/lib/markdoc/markdoc.config.ts` - Markdoc configuration for custom components
- `src/pages/[collection]/[slug].astro` - One page per post, for both collections
- `src/components/PostList.astro` - The post list shared by `/blog` and `/reading`
- `src/components/` - Astro components for UI and custom Markdoc renderers
- `astro.config.mjs` - Astro configuration (site URL, dev port, sitemap)
- Content authored in markdown files using Markdoc syntax

### Environment Configuration

- Dev server: `http://localhost:3000`
- `site` in `astro.config.mjs` is always `https://ddumont.dev`, so SEO, RSS and sitemap URLs use the live address in dev and build alike (`SITE_URL` in `src/config.ts` reads it)

### Content Authoring

Add new content by creating `.md` files in the appropriate `content/` subdirectory. Use frontmatter for metadata and leverage custom Markdoc components like:
- `{% youtube url="..." label="..." /%}`
- `{% tweet url="..." /%}`
- `{% codepen url="..." title="..." /%}`
- `{% githubgist id="..." /%}`
- `{% previewimage src="/images/..." alt="..." /%}`

### Content Schema Reference

All frontmatter is validated by Zod (Astro's bundled `astro/zod`) in `src/content.config.ts`; an invalid field fails the build with the field's message.

```
# Base fields (all content types)
title: string           # required
date: YYYY-MM-DD        # required — no quotes
draft: boolean          # default false — hides post from all listing pages
featured: boolean       # default false — NOT currently used in UI
previewImage: string    # optional — e.g. /images/foo.png — shown in blog listing

# Internal post (external: false)
external: false         # required literal
description: string     # optional — used in SEO meta description
ogImagePath: string     # optional — e.g. /images/foo.png — used as OG/Twitter card image
canonicalUrl: string    # optional — for content cross-posted from another site

# External post (external: true)
external: true          # required literal
url: string             # required — where the link in the blog listing points
```

External posts appear in the listing, linking to their `url`, but do NOT get their own page generated.

### Data Flow

```
content/<collection>/*.md
  → glob loader              # content.config.ts — Astro reads frontmatter + raw body
  → Zod validation           # content.config.ts — throws at build time on invalid fields
  → getPublishedPosts()      # lib/posts.ts — drops drafts, newest first
  → renderPost()             # lib/posts.ts — Markdoc.parse + validate + transform
  → Markdoc.parse()          # parses markdown into AST
  → Markdoc.transform()      # applies markdoc.config.ts (custom tags/nodes)
  → RenderableTree (AST)
  → Renderer.astro           # maps AST node names → Astro components
  → PostLayout → PageLayout
  → HTML
```

Key helper functions in `src/lib/posts.ts`:
- `getPublishedPosts(collection)` — non-draft posts, newest first; used by list pages, `[collection]/[slug].astro` and the RSS feed
- `renderPost(post)` — Markdoc tree for `Renderer.astro`; only published posts are rendered, so an invalid tag in a draft doesn't fail the build
- `formatPostDate(date)` — the "Sep 18, 2025" date format used across the site
- `postHref(post)` — a post's page, or the `url` of an external post
- `readingMinutes(post)` — the "N min read" on a post page
- `imageTransitionName(postId)` — the view-transition name a preview image shares between the list and the post
- `COLLECTION_PAGES` — each collection's label ("Writing", "Reading") and index path

Page-level data (like `getPublishedPosts`) is awaited in the page frontmatter, not inline in the template.

A post's preview image morphs from the list into the post with native cross-document view transitions (`@view-transition` in `PageLayout`). Both images set `view-transition-name` inline from `imageTransitionName()`; Astro's `transition:name` isn't used, because its styles are dropped for images rendered inside the Markdoc body.

### Adding a New Markdoc Tag (Two-Step Rule)

**Both files must be updated or the tag will throw a validation error at build time:**

1. `src/lib/markdoc/markdoc.config.ts` — add the tag definition to `config.tags`
2. `src/components/Renderer.astro` — import the Astro component and register it in the `components` map

See `youtube` / `YouTubeEmbed` as the canonical example of this pattern.

### Component Inventory

**Content rendering:**

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `PageIntro.astro` | Label, headline and optional lead at the top of `/blog` and `/reading` | `label`, `title`, `lead?` |
| `PostList.astro` | Post list for `/blog` and `/reading`: date, title, description, preview image (wide, or tall `book` covers) | `posts: Post[]`, `imageStyle?: "wide" \| "book"` |
| `Renderer.astro` | Maps Markdoc AST → Astro components | `content: Content` |
| `Heading.astro` | Renders h1–h6 from Markdoc heading node (text comes through the slot) | `level: number` |
| `CodeBlock.astro` | Syntax-highlighted code (Prism, Coldark Dark) | `content: string`, `language?: string` |
| `YouTubeEmbed.astro` | YouTube iframe embed | `url: string`, `label: string` |
| `TweetEmbed.astro` | Twitter embed via widgets.js | `url: string` |
| `CodePenEmbed.astro` | CodePen iframe embed | `url: string`, `title: string` |
| `GitHubGistEmbed.astro` | GitHub Gist via srcdoc iframe | `id: string` |
| `PreviewImageEmbed.astro` | Hero image with view transition (reads slug from `Astro.params`, not props) | `src: string`, `alt: string` |

**SEO / meta:**

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `BlogPostMeta.astro` | `<head>` tags for blog posts (OG, Twitter, canonical) | `title`, `description`, `publishDate`, `pagePath`, `ogImageAbsoluteUrl` |
| `PageMeta.astro` | `<head>` tags for list pages | `title`, `description` |

**Layout:**

| Component | Purpose | Slots |
|-----------|---------|-------|
| `BaseHead.astro` | `<head>` basics every page shares: charset, viewport, favicons, manifest, fonts, `styles/base.css` | — |
| `PageLayout.astro` | Shell for `/blog`, `/reading` and posts: site header, still glow, footer | `meta`, default |
| `PostLayout.astro` | A post page on `PageLayout`: back link, title, date, reading time, then the body (`styles/prose.css`) — Props: `post: Post` | `meta`, default |
| `StoryLayout.astro` | The home page story (see "Home page story") | `meta`, default |

**UI:**

| Component | Purpose |
|-----------|---------|
| `Wordmark.astro` | The "D" mark and name linking home; used by `SiteHeader` and the story's `StoryBar` |
| `SiteHeader.astro` | Bar on writing/reading pages: wordmark, Writing, Reading, Say hello (`aria-current` on the current index) |
| `SiteFooter.astro` | Copyright, email and profile links (from `CONTACT` in `story/content.ts`) |

**Styles:** `styles/base.css` holds the design system every page shares (tokens, base elements, `.label`, `.accent`, `.type-headline`, `.type-statement`, `.scrim`, `.skip-link`). `styles/story.css` adds what only the story needs; `styles/prose.css` styles a post body (`.prose`, the `div` Markdoc's document node renders). Elements marked `.unset` keep their own link and blockquote styles.

**Favicons:** `public/favicon.svg` (switches fill for light browser chrome), `favicon.ico` (16/32), `apple-touch-icon.png` (180), `android-chrome-192x192.png`/`512x512.png`, linked from `BaseHead.astro`.

### Image Conventions

- All images live in `public/images/`
- Use `.avif` for images shown on the site (`previewImage`, `{% previewimage %}`)
- Use `.png` or `.jpeg` for `ogImagePath`: social networks don't render AVIF link previews (see `ship-daily-or-die-slowly.md`)
- `previewImage` and `ogImagePath` frontmatter values are root-relative (e.g. `/images/foo.avif`)
- In `[collection]/[slug].astro`, `ogImagePath` is converted to an absolute URL via `new URL(ogImagePath, SITE_URL)`

### RSS Feed

Available at `/rss.xml`, generated by `src/pages/rss.xml.ts`.

### Known Quirks

- **`PreviewImageEmbed.astro`** reads `slug` from `Astro.params` (the route context), not from props. Do not pass `slug` as a prop — it is ignored.
- **`featured` flag** exists in the Zod schema but is not consumed anywhere in the UI. Setting it has no effect.
- **External posts** appear in the blog listing but never have a `[slug].astro` page generated for them (filtered by `!frontmatter.external` in `getStaticPaths`).

## Home page story

The home page (`src/pages/index.astro`) is a scroll-driven story in chapters, with its own layout and design system. Blog and reading pages share its design system (`styles/base.css`) through `PageLayout`, without the motion.

**Where things live** (keep these separate):
- `src/story/content.ts` — every word on the page and the chapter list (`CHAPTERS`, nine chapters). Copy only; no markup or motion.
- `src/components/story/Chapter*.astro` — one component per chapter: semantic HTML and layout. All text is real HTML, so it works without JS or WebGL. `StoryHeading.astro` is the shared label + headline.
- `src/story/timelines/*.ts` — one GSAP timeline per chapter, built with `chapterTimeline(section)` (scrubbed by the chapter's scroll track, 0..1) and the helpers in `timelines/reveal.ts` (`revealHeading`, `fadeUp`, `fadeAway`, `showBetween`, `staggered`). Registered in the `TIMELINES` table in `main.ts`.
- `src/story/interactive/` — the optional explorers: `picker.ts` (one-of-several buttons ↔ notes; used by the AI loop), `loop.ts` (the AI loop's signal), `morph.ts` (diagram nodes moving between two layouts).
- `src/story/lib/layouts.ts` — diagram node positions, computed at build time with a seeded random (`lib/random.ts`), so the server-rendered SVG is already the final layout.
- `src/story/scene/` — the WebGL particle field (`ParticleField.ts`, `shaders.ts`) and the scene states keyed to chapter progress (`states.ts`, `SCENE_KEYS`).
- `src/story/motion/` — Lenis smooth scroll and the scene driver (scroll → interpolated scene state → particle field + CSS `--glow-*` variables).
- `src/story/main.ts` — boot order. Three.js loads as a separate chunk after the text is interactive.
- `src/styles/base.css` — tokens (palette, type scale) and shared type roles, used by every page; `src/styles/story.css` — `.line` reveals, chapter track/stage layout.

**Adding a chapter:** add it to `CHAPTERS` and its copy to `content.ts`; add `ChapterX.astro` (a `section.chapter` with `id` = chapter id and `--track` height, containing a `.stage`) and put it in `pages/index.astro`; add `timelines/x.ts` and register it in `TIMELINES` in `main.ts`; add `SCENE_KEYS` for how the light should look through it (`opacity` dims the ribbon for quiet chapters).

**Rules:**
- Motion runs only under `prefers-reduced-motion: no-preference` (the inline script in `StoryLayout` adds `html.story-motion`). Without it chapters are ordinary screens and the particle field is a still frame. Elements marked `data-reveal` start hidden only in motion mode.
- Scene state is a pure function of scroll position (`stateAt`), so scrolling back, jumping and reloading land on the same frame. Don't drive the scene from scroll *events* or accumulated state.
- Chapters overlap by one screen (`.chapter + .chapter { margin-top: -100svh }`) so there's no empty screen between them; a chapter's timeline starts when the previous one's stage lets go.
- Don't put CSS transforms on elements GSAP animates; GSAP owns their `transform`. Anything positioned against the stage must not sit inside an animated element (a transform makes that element the containing block).
- Never use GSAP's `stagger` in a scrubbed (chapter) timeline: it only applies the starting state to the first element, so the rest show early. Use `staggered()` from `timelines/reveal.ts`.
- Things that take turns on one stage use `showBetween` (`autoAlpha`), so hidden ones can't take keyboard focus.
- Astro scopes component styles: a chapter styling something inside `StoryHeading` (`.heading`, `.heading__title`) or a `> *` child selector needs `:global(...)`.
- Text over busy light gets the global `.scrim` class. Shared type roles live in `base.css` (`.type-headline`, `.type-statement`, `.label`, `.accent`); use them instead of repeating font stacks.
- Explorers (`picker`, `intelligenceLoop`) start in `main.ts` whether or not motion is on; timelines may drive them but must never be required for them to work. Without JS, every note in an explorer is visible as a plain list.
- Copy must be factual: use the supplied bio, the "working with me" doc and LinkedIn roles only. Family details stay exactly as they are in `content.ts` ("my wife and our three kids"): add nothing beyond them, and no names, town or phone number. "The work" covers Constant Contact and LinkSquares only; Harvard Business School Publishing is left out by choice. Keep Catalyst's "now" and "where it's going" separate; don't describe planned capabilities as shipped.
- "What's next" lists the latest real blog posts from `getPublishedPosts("blog")`; never add placeholder posts.
- The headshot is `src/assets/story/headshot-cutout.png`, cut out from the supplied photo with Apple Vision; Astro generates AVIF/WebP from it. Don't regenerate or alter the face.

## Typography Overview

Every page uses the same type, from `styles/base.css` (fonts self-hosted with Fontsource, imported in `BaseHead.astro`):

- **Display** — Inter Tight (`--font-display`): headlines, titles, labels. Tight tracking (`--tracking-display`, -0.045em) on large headlines.
- **Body** — Inter (`--font-body`): running text. Post bodies are 1.125rem / 1.75 (1.0625rem on phones) in a `--measure` (42rem) column.
- **Accent** — Instrument Serif italic (`--font-accent`): single accent words only (`.accent`, cyan → violet gradient).
- **Code** — Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace (Prism Coldark Dark in `CodeBlock.astro`).
- **Scale** — tokens in `:root`: `--fs-display`, `--fs-headline`, `--fs-lead`, `--fs-label`; colors `--text`, `--muted`, `--cyan`, `--violet`, `--blue`, `--amber` on `--obsidian`.
