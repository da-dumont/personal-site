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