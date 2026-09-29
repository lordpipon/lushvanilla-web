import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The status endpoint is polled by the site itself, not useful to crawlers.
      disallow: "/api/",
    },
    sitemap: "https://lushvanilla.net/sitemap.xml",
  };
}
