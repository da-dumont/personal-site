import rss from "@astrojs/rss";
import { getPublishedPosts } from "../lib/posts";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../config";

export const GET = async () => {
  const posts = await getPublishedPosts("blog");

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: SITE_URL,
    items: posts.map(({ id, data }) =>
      data.external
        ? { title: data.title, pubDate: data.date, link: data.url }
        : {
            title: data.title,
            pubDate: data.date,
            description: data.description,
            link: `${SITE_URL}/blog/${id}`,
          }
    ),
  });
};
