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
- **Base font size**: 16px (body)
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
