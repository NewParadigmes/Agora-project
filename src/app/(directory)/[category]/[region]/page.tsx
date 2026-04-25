import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import DirectoryClient from "@/components/DirectoryClient";
import { NS_REGIONS, getFSAsForRegion } from "@/utils/fsaMapping";
import type { Metadata } from 'next';
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ category: string, region: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const isFSA = /^[A-Z][0-9][A-Z]$/i.test(resolvedParams.region);
  const regionName = isFSA ? resolvedParams.region.toUpperCase() : (NS_REGIONS[resolvedParams.region]?.name || resolvedParams.region.replace(/-/g, ' '));
  const capitalizedCategory = resolvedParams.category.charAt(0).toUpperCase() + resolvedParams.category.slice(1);

  return {
    title: `Top ${capitalizedCategory} in ${regionName} | Agora`,
    description: `Find verified, top-rated ${resolvedParams.category} professionals serving ${regionName}.`,
    alternates: {
      canonical: `https://agorans.ca/${resolvedParams.category}/${resolvedParams.region}`
    }
  };
}

export default async function HubPage({ params }: { params: Promise<{ category: string, region: string }> }) {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const isFSA = /^[A-Z][0-9][A-Z]$/i.test(resolvedParams.region);
  const regionFsas = getFSAsForRegion(resolvedParams.region);

  // Base query
  let query = supabase
    .from("businesses")
    .select(`
      id,
      slug,
      name,
      phone,
      website,
      fsa,
      is_verified,
      is_bbb_accredited,
      is_efficiency_ns_partner,
      ai_reputation_score,
      categories!inner ( name )
    `)
    .ilike('categories.name', resolvedParams.category);

  if (regionFsas) {
    query = query.in('fsa', regionFsas);
  } else {
    const searchTerm = resolvedParams.region.replace(/-/g, ' ');
    query = query.or(`fsa.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`);
  }

  query = query.order("ai_reputation_score", { ascending: false, nullsFirst: false }).limit(20);

  const { data: businesses, error } = await query;

  if (error) {
    console.error("Error fetching hub businesses:", error);
  }

  const formattedBusinesses = businesses || [];

  const { data: saData } = await supabase.from("businesses").select("fsa");
  const uniqueFSAs = Array.from(new Set(saData?.map((s: any) => s.fsa).filter(Boolean))) as string[];

  const capitalizedCategory = resolvedParams.category.charAt(0).toUpperCase() + resolvedParams.category.slice(1);
  const regionName = isFSA ? resolvedParams.region.toUpperCase() : (NS_REGIONS[resolvedParams.region]?.name || resolvedParams.region.replace(/-/g, ' '));

  return (
    <main className="min-h-screen bg-white flex flex-col items-center">
      <section className="w-full bg-[#E4E9F0] border-b border-slate-200 py-12 md:py-16 px-6 text-center flex flex-col items-center justify-center">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center justify-center space-x-2 text-sm text-slate-500 font-medium">
            <li><Link href="/" className="hover:text-slate-900 transition-colors">Home</Link></li>
            <li><span className="mx-2 text-slate-300">/</span></li>
            <li><Link href={`/${resolvedParams.category}`} className="hover:text-slate-900 transition-colors capitalize">{resolvedParams.category}</Link></li>
          </ol>
        </nav>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-4 capitalize">
          {capitalizedCategory} in {regionName}
        </h1>
        <p className="text-slate-600 text-lg md:text-xl max-w-2xl font-medium">
          Find trusted, top-rated local professionals mapped to your region.
        </p>
      </section>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:-mt-8">
        <DirectoryClient initialBusinesses={formattedBusinesses} fsas={uniqueFSAs.sort()} initialRegionSlug={resolvedParams.region} initialCategory={resolvedParams.category} />
      </div>
    </main>
  );
}
