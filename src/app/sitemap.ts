import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getApprovedVoiceEntries } from "@/lib/voces";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/voces`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/escribir`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/apoyo`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const voices = await getApprovedVoiceEntries();
  const voiceRoutes: MetadataRoute.Sitemap = voices.map((voice) => ({
    url: `${siteUrl}/voces/${voice.id}`,
    lastModified: new Date(voice.created_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...voiceRoutes];
}
