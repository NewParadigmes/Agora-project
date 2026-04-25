import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getRegionFromFSA, NS_REGIONS } from '@/utils/fsaMapping';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const baseUrl = 'https://agorans.ca';

  // 1. Static Pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trust-methodology`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // 2. Fetch all businesses, their FSAs and categories for Profile Leaves
  const { data: businesses } = await supabase
    .from('businesses')
    .select('slug, service_areas(fsa), categories(name)');

  const generatedHubs = new Set<string>();

  if (businesses) {
    businesses.forEach((biz: any) => {
      const categoryName = biz.categories?.name?.toLowerCase() || 'professional';
      const primaryFsa = biz.service_areas?.[0]?.fsa;
      const regionSlug = primaryFsa ? getRegionFromFSA(primaryFsa) : 'nova-scotia';

      const hubPath = `${baseUrl}/${categoryName}/${regionSlug}`;
      const profilePath = `${hubPath}/${biz.slug}`;

      // Add Hub if we haven't seen it
      if (!generatedHubs.has(hubPath)) {
        generatedHubs.add(hubPath);
        routes.push({
          url: hubPath,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        });
      }

      // Add Profile Link
      routes.push({
        url: profilePath,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  }

  // 3. Add Category Hubs that cover "all" regions (e.g. /plumbing)
  // We can derive this simply by unique categories observed.
  const categories = Array.from(new Set(businesses?.map((b: any) => b.categories?.name?.toLowerCase() || 'professional')));
  categories.forEach(cat => {
      routes.push({
          url: `${baseUrl}/${cat}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.85
      });
  });

  return routes;
}
