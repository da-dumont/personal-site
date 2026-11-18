import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  server: { port: 3000 },
  site: "https://ddumont.dev",
  integrations: [sitemap()],
});
