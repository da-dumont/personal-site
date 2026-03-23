# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `yarn dev` or `yarn start` - Start development server on port 3000
- `yarn build` - Build the site for production
- `yarn preview` - Preview the built site locally
- `yarn clean` - Remove the dist directory

## Architecture Overview

This is an Astro-based personal blog/portfolio site built with TypeScript and Markdoc for content authoring.

### Key Components

- **Content Management**: Uses Markdoc for markdown processing with custom components
- **Content Structure**: 
  - `content/blog/` - Blog posts
  - `content/projects/` - Project showcases  
  - `content/reading/` - Book reviews/notes
- **Custom Markdoc Tags**: YouTube embeds, Twitter embeds, CodePen embeds, GitHub Gist embeds, and preview images
- **Rendering**: Custom renderer at `src/components/Renderer.astro` handles Markdoc output

### File Structure

- `src/config.ts` - Site configuration (title, description, social handles)
- `src/lib/markdoc/markdoc.config.ts` - Markdoc configuration for custom components
- `src/components/` - Astro components for UI and custom Markdoc renderers
- `astro.config.mjs` - Astro configuration with environment-based URL handling
- Content authored in markdown files using Markdoc syntax

### Environment Configuration

The site uses dynamic URL configuration:
- Development: `http://localhost:3000`  
- Production: `https://ddumont.dev`
- URLs automatically switch based on build vs dev mode

### Content Authoring

Add new content by creating `.md` files in the appropriate `content/` subdirectory. Use frontmatter for metadata and leverage custom Markdoc components like:
- `{% youtube url="..." label="..." /%}`
- `{% tweet url="..." /%}`
- `{% codepen url="..." title="..." /%}`
- `{% githubgist id="..." /%}`
- `{% previewimage src="/images/..." alt="..." /%}`

### Unused Dependencies (do not use)
- `slugify` — listed in `package.json` but not imported anywhere in `src/`
- `astro-imagetools` — listed in `package.json` but not imported anywhere in `src/`

### Content Schema Reference

All frontmatter is validated by Zod in `src/lib/markdoc/frontmatter.schema.ts`.

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

External posts appear in the blog listing but do NOT get their own page generated.

### Data Flow

```
content/*.md
  → gray-matter              # extracts YAML frontmatter + raw markdown body
  → Zod validation           # frontmatter.schema.ts — throws at build time on invalid fields
  → Markdoc.parse()          # parses markdown into AST
  → Markdoc.transform()      # applies markdoc.config.ts (custom tags/nodes)
  → RenderableTree (AST)
  → Renderer.astro           # maps AST node names → Astro components
  → ContentLayout / PageLayout
  → HTML
```

Key helper functions in `src/lib/markdoc/read.ts`:
- `readAll({ directory, frontmatterSchema })` — reads all `.md` files in a content subdirectory; used by listing pages
- `readOne({ directory, slug, frontmatterSchema })` — reads one file by slug; used by `[slug].astro` dynamic pages

### Adding a New Markdoc Tag (Two-Step Rule)

**Both files must be updated or the tag will throw a validation error at build time:**

1. `src/lib/markdoc/markdoc.config.ts` — add the tag definition to `config.tags`
2. `src/components/Renderer.astro` — import the Astro component and register it in the `components` map

See `youtube` / `YouTubeEmbed` as the canonical example of this pattern.

### Component Inventory

**Content rendering:**

| Component | Purpose | Key Props |
|-----------|---------|-----------|
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
| `Intro.astro` | Hero section with headshot and bio (home page) |
| `Favicon.astro` | Favicon and manifest `<link>` tags |

**Icons** (in `src/components/ui/icons/`): `github.astro`, `twitter.astro`, `linkedin.astro`, `external-link.astro`

### Image Conventions

- All images live in `public/images/`
- Use `.png` format — `.avif` was previously used but has been migrated away from
- `previewImage` and `ogImagePath` frontmatter values are root-relative (e.g. `/images/foo.png`)
- In `[slug].astro`, `ogImagePath` is converted to an absolute URL via `new URL(ogImagePath, SITE_URL)`

### RSS Feed

Available at `/rss.xml`, generated by `src/pages/rss.xml.ts`.

### Known Quirks

- **`PreviewImageEmbed.astro`** reads `slug` from `Astro.params` (the route context), not from props. Do not pass `slug` as a prop — it is ignored.
- **`featured` flag** exists in the Zod schema but is not consumed anywhere in the UI. Setting it has no effect.
- **`ViewTransitions`** is imported inside `BlogPostMeta.astro` rather than in the layout — intentional for per-page opt-in.
- **External posts** appear in the blog listing but never have a `[slug].astro` page generated for them (filtered by `!frontmatter.external` in `getStaticPaths`).

## Typography Overview

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
  - Intro hero: 2.25rem (mobile), 4rem (desktop)
  - Blog post date: 0.875em
  - Footer: 0.875rem
  - Blockquotes: 1.125rem (with Barlow font family)

### Responsive Font Behavior
- **Blog posts**: 16px base on mobile, 18px on desktop (min-width: 640px)
- **ContentLayout**: Uses media queries for responsive font scaling
- **Intro component**: Significant size increase on larger screens (2.25rem → 4rem for hero text)

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
