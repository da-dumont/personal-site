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
  → ContentLayout / PageLayout
  → HTML
```

Key helper functions in `src/lib/posts.ts`:
- `getPublishedPosts(collection)` — non-draft posts, newest first; used by list pages, `[collection]/[slug].astro` and the RSS feed
- `renderPost(post)` — Markdoc tree for `Renderer.astro`; only published posts are rendered, so an invalid tag in a draft doesn't fail the build
- `formatPostDate(date)` — the "Sep 18, 2025" date format used across the site

Page-level data (like `getPublishedPosts`) is awaited in the page frontmatter, not inline in the template: awaiting inside the template makes Astro drop the `transition:name` styles of the list images.

### Adding a New Markdoc Tag (Two-Step Rule)

**Both files must be updated or the tag will throw a validation error at build time:**

1. `src/lib/markdoc/markdoc.config.ts` — add the tag definition to `config.tags`
2. `src/components/Renderer.astro` — import the Astro component and register it in the `components` map

See `youtube` / `YouTubeEmbed` as the canonical example of this pattern.

### Component Inventory

**Content rendering:**

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `PostList.astro` | Post list for `/blog` and `/reading` (round images, or small square `book` covers) | `posts: Post[]`, `imageStyle?: "round" \| "book"` |
| `Renderer.astro` | Maps Markdoc AST → Astro components | `content: Content` |
| `Heading.astro` | Renders h1–h6 from Markdoc heading node | `level: number` |
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
| `PageLayout.astro` | Shell for list pages (blog, reading, home) | `meta`, `main` |
| `ContentLayout.astro` | Shell for content pages (posts) — Props: `title: string`, `date: Date` | `meta`, `content` |

**UI:**

| Component | Purpose |
|-----------|---------|
| `Header.astro` | Top nav with social icon links |
| `HeaderLink.astro` | Active-aware nav link (`href: string`) |
| `Footer.astro` | Copyright footer |
| `Favicon.astro` | Favicon and manifest `<link>` tags |

**Icons** (in `src/components/ui/icons/`): `github.astro`, `twitter.astro`, `linkedin.astro`, `external-link.astro`

### Image Conventions

- All images live in `public/images/`
- Use `.avif` for images shown on the site (`previewImage`, `{% previewimage %}`, backgrounds)
- Use `.png` or `.jpeg` for `ogImagePath`: social networks don't render AVIF link previews (see `ship-daily-or-die-slowly.md`)
- `previewImage` and `ogImagePath` frontmatter values are root-relative (e.g. `/images/foo.avif`)
- In `[collection]/[slug].astro`, `ogImagePath` is converted to an absolute URL via `new URL(ogImagePath, SITE_URL)`

### RSS Feed

Available at `/rss.xml`, generated by `src/pages/rss.xml.ts`.

### Known Quirks

- **`PreviewImageEmbed.astro`** reads `slug` from `Astro.params` (the route context), not from props. Do not pass `slug` as a prop — it is ignored.
- **`featured` flag** exists in the Zod schema but is not consumed anywhere in the UI. Setting it has no effect.
- **`ViewTransitions`** is imported inside `BlogPostMeta.astro` rather than in the layout — intentional for per-page opt-in.
- **External posts** appear in the blog listing but never have a `[slug].astro` page generated for them (filtered by `!frontmatter.external` in `getStaticPaths`).

## Home page story

The home page (`src/pages/index.astro`) is a scroll-driven story in chapters, with its own layout and design system. Blog and reading pages are unaffected and still use `PageLayout`/`ContentLayout` and the typography below.

**Where things live** (keep these separate):
- `src/story/content.ts` — every word on the page and the chapter list (`CHAPTERS`, ten chapters). Copy only; no markup or motion.
- `src/components/story/Chapter*.astro` — one component per chapter: semantic HTML and layout. All text is real HTML, so it works without JS or WebGL. `StoryHeading.astro` is the shared label + headline.
- `src/story/timelines/*.ts` — one GSAP timeline per chapter, built with `chapterTimeline(section)` (scrubbed by the chapter's scroll track, 0..1) and the helpers in `timelines/reveal.ts` (`revealHeading`, `fadeUp`, `fadeAway`, `showBetween`, `staggered`). Registered in the `TIMELINES` table in `main.ts`.
- `src/story/interactive/` — the optional explorers: `picker.ts` (one-of-several buttons ↔ notes; used by the architecture layers and the AI loop), `loop.ts` (the AI loop's signal), `morph.ts` (diagram nodes moving between two layouts).
- `src/story/lib/layouts.ts` — diagram node positions, computed at build time with a seeded random (`lib/random.ts`), so the server-rendered SVG is already the final layout.
- `src/story/scene/` — the WebGL particle field (`ParticleField.ts`, `shaders.ts`) and the scene states keyed to chapter progress (`states.ts`, `SCENE_KEYS`).
- `src/story/motion/` — Lenis smooth scroll and the scene driver (scroll → interpolated scene state → particle field + CSS `--glow-*` variables).
- `src/story/main.ts` — boot order. Three.js loads as a separate chunk after the text is interactive.
- `src/styles/story.css` — tokens (palette, type scale), `.line` reveals, chapter track/stage layout.

**Adding a chapter:** add it to `CHAPTERS` and its copy to `content.ts`; add `ChapterX.astro` (a `section.chapter` with `id` = chapter id and `--track` height, containing a `.stage`) and put it in `pages/index.astro`; add `timelines/x.ts` and register it in `TIMELINES` in `main.ts`; add `SCENE_KEYS` for how the light should look through it (`opacity` dims the ribbon for quiet chapters).

**Rules:**
- Motion runs only under `prefers-reduced-motion: no-preference` (the inline script in `StoryLayout` adds `html.story-motion`). Without it chapters are ordinary screens and the particle field is a still frame. Elements marked `data-reveal` start hidden only in motion mode.
- Scene state is a pure function of scroll position (`stateAt`), so scrolling back, jumping and reloading land on the same frame. Don't drive the scene from scroll *events* or accumulated state.
- Chapters overlap by one screen (`.chapter + .chapter { margin-top: -100svh }`) so there's no empty screen between them; a chapter's timeline starts when the previous one's stage lets go.
- Don't put CSS transforms on elements GSAP animates; GSAP owns their `transform`. Anything positioned against the stage must not sit inside an animated element (a transform makes that element the containing block).
- Never use GSAP's `stagger` in a scrubbed (chapter) timeline: it only applies the starting state to the first element, so the rest show early. Use `staggered()` from `timelines/reveal.ts`.
- Things that take turns on one stage use `showBetween` (`autoAlpha`), so hidden ones can't take keyboard focus.
- Astro scopes component styles: a chapter styling something inside `StoryHeading` (`.heading`, `.heading__title`) or a `> *` child selector needs `:global(...)`.
- Text over busy light gets the global `.scrim` class. Shared type roles live in `story.css` (`.type-headline`, `.type-statement`, `.label`, `.accent`); use them instead of repeating font stacks.
- Explorers (`picker`, `intelligenceLoop`) start in `main.ts` whether or not motion is on; timelines may drive them but must never be required for them to work. Without JS, every note in an explorer is visible as a plain list.
- Copy must be factual: use the supplied bio, the "working with me" doc and LinkedIn roles only. Family details stay exactly as they are in `content.ts` ("my wife and our three kids"): add nothing beyond them, and no names, town or phone number. "The work" covers Constant Contact and LinkSquares only; Harvard Business School Publishing is left out by choice. Keep Catalyst's "now" and "where it's going" separate; don't describe planned capabilities as shipped.
- "What's next" lists the latest real blog posts from `getPublishedPosts("blog")`; never add placeholder posts.
- The headshot is `src/assets/story/headshot-cutout.png`, cut out from the supplied photo with Apple Vision; Astro generates AVIF/WebP from it. Don't regenerate or alter the face.

## Typography Overview

The following applies to blog and reading pages; the home page story has its own type system in `src/styles/story.css`.

### Font Families
- **Primary (Body)**: "Barlow" with sans-serif fallback
  - Used for: body text, paragraphs, general content, blockquotes
  - Weight: 400 (regular)
  - Supports weights: 100-900 (with italic variants)
- **Secondary (Headings)**: "Oswald" with serif fallback  
  - Used for: all headings (h1-h6)
  - Weight: 500 (medium)
  - Variable font supporting weights 200-700
- **Monospace (Code)**: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace
  - Used for: code blocks and inline code

### Font Loading Strategy
- **Google Fonts**: Loaded via stylesheet link in both PageLayout.astro and ContentLayout.astro
- **Preconnect**: Uses `rel="preconnect"` for fonts.googleapis.com and fonts.gstatic.com (ContentLayout only)
- **Display Strategy**: `&display=swap` parameter for faster font loading
- **Font URL**: `https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Oswald:wght@200..700&display=swap`

### Type Scale
- **Base font size**: 18px (body)
- **Line height**: 1.65rem (body)
- **Body max-width**: 70ch (increased from 60ch for better readability)
- **Heading sizes**:
  - h1: 2.5em (line-height: 1.2)
  - h2: 1.6666667em (line-height: 1.3333333)  
  - h3: 1.3333333em (line-height: 1.5)
  - h4-h6: inherit size (line-height: 1.5555556)
- **Component-specific sizes**:
  - Blog post date: 0.875em
  - Footer: 0.875rem
  - Blockquotes: 1.125rem (with Barlow font family)

### Responsive Font Behavior
- **Blog posts**: 16px base on mobile, 18px on desktop (min-width: 640px)
- **ContentLayout**: Uses media queries for responsive font scaling

### Typography Variables
- **Text colors**: CSS custom properties in `:root`
  - `--text`: #ffffff (body text)
  - `--text-muted`: #d2d3d7 (secondary text)
  - `--text-heading`: #fafafa (headings)
  - `--text-link`: #20bdff (links)
  - `--code-text`: #cbd5e0 (code text)

### Font Properties
- **Font smoothing**: `-webkit-font-smoothing: antialiased` on body
- **Font optical sizing**: `auto` for both Barlow and Oswald
- **Font style**: `normal` for headings
- **Font weight consistency**: 400 for body text, 500 for headings
