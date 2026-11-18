# Dan Dumont | Engineering Leader

> Sharing software development insights based on 15+ years in the industry.

Welcome to the source code of my personal portfolio and blog! This site showcases my thoughts on engineering leadership, software development practices, and industry insights.

🌐 **Live Site**: [ddumont.dev](https://ddumont.dev)  
🐦 **Twitter**: [@EngLeader_](https://twitter.com/EngLeader_)

## About This Site

This is a modern, high-performance blog built with [Astro](https://astro.build) and [Markdoc](https://markdoc.dev), focusing on:

- **Performance First**: Zero JavaScript runtime, minimal CSS, perfect Lighthouse scores
- **Content-Focused**: Clean, accessible design that puts writing first  
- **Developer Experience**: Markdown-based authoring with custom components
- **SEO Optimized**: Proper meta tags, sitemap, and RSS feed

## Content

The site features two content areas:

- **Blog**: Technical articles and engineering leadership insights
- **Reading**: Book reviews and notes on professional development

## Tech Stack

- **Framework**: [Astro 7](https://astro.build) for static site generation, with content collections for posts
- **Content**: [Markdoc](https://markdoc.dev) for enhanced markdown authoring
- **Styling**: Plain CSS with custom properties (dark theme)
- **Fonts**: Barlow (body), Oswald (headings) via Google Fonts
- **Hosting**: Deployed on Netlify (Node version pinned in `.nvmrc`; Astro 7 needs Node 22.23.4+)
- **Language**: TypeScript throughout
- **Schema Validation**: Zod (Astro's bundled `astro/zod`) for frontmatter validation at build time

## Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Type-check .astro and .ts files
yarn typecheck

# Preview production build
yarn preview
```

## Custom Markdoc Components

The blog supports rich embeds via custom Markdoc tags:

| Tag | Usage |
|-----|-------|
| YouTube | `{% youtube url="..." label="..." /%}` |
| Twitter/X | `{% tweet url="..." /%}` |
| CodePen | `{% codepen url="..." title="..." /%}` |
| GitHub Gist | `{% githubgist id="..." /%}` |
| Preview image | `{% previewimage src="/images/..." alt="..." /%}` |

Adding a new embed requires updating both [`markdoc.config.ts`](src/lib/markdoc/markdoc.config.ts) and [`Renderer.astro`](src/components/Renderer.astro).

## Built With

This site started from the excellent [Blogster](https://github.com/flexdinesh/blogster) Astro template by [Dinesh Pandiyan](https://github.com/flexdinesh), customized and extended for my personal needs.

## License

MIT © [Dan Dumont](https://github.com/ddumont-mac)
