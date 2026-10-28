import type { MetadataRoute } from "next";
import { sitePages, siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitePages.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: siteConfig.lastUpdated,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
