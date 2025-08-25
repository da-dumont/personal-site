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

The site features three main content areas:

- **Blog**: Technical articles and engineering leadership insights
- **Projects**: Showcase of development work and open source contributions
- **Reading**: Book reviews and notes on professional development

## Tech Stack

- **Framework**: [Astro](https://astro.build) for static site generation
- **Content**: [Markdoc](https://markdoc.dev) for enhanced markdown authoring
- **Styling**: Plain CSS with dark/light mode support
- **Hosting**: Deployed on Netlify
- **Language**: TypeScript throughout

## Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

## Custom Components

The blog supports custom Markdoc components for rich content:

- YouTube video embeds
- Twitter/X post embeds  
- CodePen embeds
- GitHub Gist embeds
- Preview images

See [markdoc.config.ts](src/lib/markdoc/markdoc.config.ts) for component definitions.

## Built With

This site started from the excellent [Blogster](https://github.com/flexdinesh/blogster) Astro template by [Dinesh Pandiyan](https://github.com/flexdinesh), customized and extended for my personal needs.

## License

MIT © [Dan Dumont](https://github.com/ddumont-mac)
