// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Dan Dumont | Engineering leader";
export const SITE_DESCRIPTION =
  "Sharing software development insights based on 15+ years in the industry.";
export const TWITTER_HANDLE = "@EngLeader_";
export const MY_NAME = "Dan Dumont";

// setup in astro.config.mjs
const BASE_URL = new URL(import.meta.env.SITE);
export const SITE_URL = BASE_URL.origin;
