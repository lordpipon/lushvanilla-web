import type { MetadataRoute } from "next";

import { allRoutes } from "@/lib/site";

const BASE_URL = "https://lushvanilla.net";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    ...allRoutes
      .filter((item) => item.href !== "/")
      .map((item) => ({
        url: `${BASE_URL}${item.href}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
  ];
}
