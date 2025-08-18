import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://bokemasho.hirokilab.com";
  const currentDate = new Date().toISOString();

  // 静的ページのサイトマップ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jokes`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/joke_topic/list`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/joke_topic/create`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/auth/forgot-password`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/auth/reset-password`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/auth/complete`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/profile/edit`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  // TODO: 動的ページの追加
  // 実際のアプリケーションでは、以下のようにAPIからデータを取得して
  // 動的にお題ページのURLを生成することができます
  /*
  try {
    const topicsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/joke-topics`)
    const topics = await topicsResponse.json()
    
    const topicPages: MetadataRoute.Sitemap = topics.data.map((topic: any) => ({
      url: `${baseUrl}/joke_topic/${topic.id}`,
      lastModified: topic.updated_at || currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
    
    return [...staticPages, ...topicPages]
  } catch (error) {
    console.error('Failed to fetch topics for sitemap:', error)
    return staticPages
  }
  */

  return staticPages;
}
