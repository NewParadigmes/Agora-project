import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getRegionFromFSA, NS_REGIONS } from "@/utils/fsaMapping";
import type { Metadata } from 'next';
import { MapPin, Search } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const capitalizedCategory = resolvedParams.category.charAt(0).toUpperCase() + resolvedParams.category.slice(1);

  return {
    title: `Find ${capitalizedCategory} Professionals in Nova Scotia | Agora`,
    description: `Browse verified ${resolvedParams.category} professionals across all regions in Nova Scotia.`,
    alternates: {
      canonical: `https://agorans.ca/${resolvedParams.category}`
    }
  };
}

export default async function CategoryPillarPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch unique service areas (fsas) for this category
  const { data, error } = await supabase
    .from("businesses")
    .select(`
      fsa,
      categories!inner ( name )
    `)
    .ilike('categories.name', resolvedParams.category);

  if (error || !data || data.length === 0) {
    notFound();
  }

  // Extract all FSAs, map them to Region Slugs, and get unique active regions
  const activeRegions = new Set<string>();

  data.forEach((biz: any) => {
    if (biz.fsa) {
      activeRegions.add(getRegionFromFSA(biz.fsa));
    }
  });

  const capitalizedCategory = resolvedParams.category.charAt(0).toUpperCase() + resolvedParams.category.slice(1);

  // Sort regions alphabetically by their human-readable name
  const sortedRegionSlugs = Array.from(activeRegions).sort((a, b) => {
    const nameA = NS_REGIONS[a]?.name || a;
    const nameB = NS_REGIONS[b]?.name || b;
    return nameA.localeCompare(nameB);
  });

  return (
    <main className="min-h-screen bg-white flex flex-col items-center pb-24">
      <section className="w-full bg-[#E4E9F0] border-b border-slate-200 py-12 md:py-16 px-6 text-center flex flex-col items-center justify-center sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-slate-500 font-medium">
              <li><Link href="/" className="hover:text-slate-900 transition-colors">Home</Link></li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 capitalize">
            {capitalizedCategory} Professionals in Nova Scotia
          </h1>
          <p className="text-slate-600 text-lg md:text-xl font-medium">
            Select your region below to discover top-rated, verified {resolvedParams.category} professionals serving your local community.
          </p>
        </div>
      </section>

      <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-12 relative z-0">
        <div className="flex items-center mb-8 pb-4 border-b border-slate-200">
          <MapPin className="w-6 h-6 text-slate-600 mr-3" />
          <h2 className="text-2xl font-bold text-slate-900">Available Regions</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sortedRegionSlugs.map(slug => {
            const region = NS_REGIONS[slug];
            if (!region) return null;

            return (
              <Link
                key={slug}
                href={`/${resolvedParams.category}/${slug}`}
                className="flex items-center justify-between p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-200 group"
              >
                <span className="font-semibold text-slate-800 group-hover:text-blue-700">{region.name}</span>
                <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  );
}
