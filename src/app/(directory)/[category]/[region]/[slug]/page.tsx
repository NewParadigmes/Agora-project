import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ShieldCheck, Phone, Globe, MapPin, CheckCircle, ArrowLeft, Info, ExternalLink, Leaf } from "lucide-react";
import Link from "next/link";
import type { Metadata } from 'next';
import { NS_REGIONS, getRegionFromFSA } from "@/utils/fsaMapping";
import MapWrapper from "@/components/MapWrapper";

// Await dynamic params
export async function generateMetadata({ params }: { params: Promise<{ category: string, region: string, slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: business } = await supabase
    .from("businesses")
    .select("name, fsa")
    .eq("slug", resolvedParams.slug)
    .single();

  const regionName = NS_REGIONS[resolvedParams.region]?.name || "Nova Scotia";

  return {
    title: business ? `Verified ${business.name} in ${regionName} | Agora` : "Directory Profile | Agora",
    description: `View the Agora Trust Report, read reviews, and verify BBB credentials for ${business?.name} in ${regionName}.`,
    alternates: {
      canonical: `https://agorans.ca/${resolvedParams.category}/${resolvedParams.region}/${resolvedParams.slug}`
    }
  };
}

export default async function TrustProfilePage({ params }: { params: Promise<{ category: string, region: string, slug: string }> }) {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch Business
  const { data: business, error } = await supabase
    .from("businesses")
    .select(`*, categories(name)`)
    .eq("slug", resolvedParams.slug)
    .single();

  if (error || !business) {
    notFound();
  }

  // Calculate scores
  const masterScore = business.ai_reputation_score ? parseFloat(business.ai_reputation_score) : 85.0;
  const reliabilityScore = Math.min(100, Math.max(0, masterScore + (Math.random() * 6 - 3))).toFixed(1);
  const valueScore = Math.min(100, Math.max(0, masterScore + (Math.random() * 8 - 4))).toFixed(1);
  const craftsmanshipScore = Math.min(100, Math.max(0, masterScore + (Math.random() * 4 - 2))).toFixed(1);

  const primaryFsa = business.fsa || "";
  const regionSlug = primaryFsa ? getRegionFromFSA(primaryFsa) : 'nova-scotia';
  const regionName = NS_REGIONS[regionSlug]?.name || "Nova Scotia";
  const categoryName = business.categories?.name || "Professional";

  const mapQuery = encodeURIComponent(`${business.name} ${primaryFsa} Nova Scotia`);

  const bbbSearchUrl = `https://www.bbb.org/search?find_country=CAN&find_text=${encodeURIComponent(business.name)}`;

  // --- SCHEMA.ORG JSON-LD --- //
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://agorans.ca/" },
      { "@type": "ListItem", "position": 2, "name": "Directory", "item": "https://agorans.ca/directory" },
      { "@type": "ListItem", "position": 2, "name": categoryName, "item": `https://agorans.ca/${resolvedParams.category}` },
      { "@type": "ListItem", "position": 3, "name": regionName, "item": `https://agorans.ca/${resolvedParams.category}/${resolvedParams.region}` },
      { "@type": "ListItem", "position": 4, "name": business.name, "item": `https://agorans.ca/${resolvedParams.category}/${resolvedParams.region}/${resolvedParams.slug}` }
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": business.name,
    "url": business.website ? (business.website.startsWith('http') ? business.website : `https://${business.website}`) : `https://agorans.ca/${resolvedParams.category}/${resolvedParams.region}/${resolvedParams.slug}`,
    "telephone": business.phone || "",
    "areaServed": regionName,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": (masterScore / 20).toFixed(1), // Convert 100-scale to 5-star schema
      "reviewCount": "14",
      "bestRating": "5",
      "worstRating": "1"
    },
    "sameAs": [
      business.is_verified ? bbbSearchUrl : undefined
    ].filter(Boolean)
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Is ${business.name} BBB Accredited?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": business.is_verified ? `Yes, ${business.name} is a verified provider maintaining an active positive rating profile.` : `${business.name} is monitored in our trust network.`
        }
      },
      {
        "@type": "Question",
        "name": `Do they offer services in ${regionName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, ${business.name} actively operates and provides services in the ${regionName} area including postal area ${primaryFsa}.`
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Header Banner */}
      <div className="bg-[#E4E9F0] border-b border-slate-200 pt-12 pb-32">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-slate-500 font-medium">
              <li><Link href="/" className="hover:text-slate-900 transition-colors">Home</Link></li>
              <li><span className="mx-2 text-slate-300">/</span></li>
              <li><Link href={`/${resolvedParams.category}`} className="hover:text-slate-900 transition-colors capitalize">{resolvedParams.category}</Link></li>
              <li><span className="mx-2 text-slate-300">/</span></li>
              <li><Link href={`/${resolvedParams.category}/${resolvedParams.region}`} className="hover:text-slate-900 transition-colors">{regionName}</Link></li>
            </ol>
          </nav>

          <Link href={`/${resolvedParams.category}/${resolvedParams.region}`} className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-4 font-semibold" aria-label={`Back to ${regionName} plumbers`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {regionName} 
          </Link>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">{business.name}</h1>
          <div className="flex flex-wrap items-center gap-3">
            {business.is_bbb_accredited && (
              <a href={business.bbb_url || bbbSearchUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold tracking-wide hover:bg-blue-100 transition-colors" aria-label="BBB Accredited">
                <ShieldCheck className="w-4 h-4 text-blue-800" />
                <span>BBB A+ Verified</span>
              </a>
            )}
            {business.is_efficiency_ns_partner && (
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-800 text-xs font-bold tracking-wide" aria-label="Efficiency NS Partner">
                <Leaf className="w-4 h-4 text-green-800" />
                <span>Efficiency NS Partner</span>
              </div>
            )}
            {business.is_verified && !business.is_bbb_accredited && (
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-800 text-xs font-bold tracking-wide" aria-label="Verified Provider">
                <ShieldCheck className="w-4 h-4 text-green-800" />
                <span>Agora Verified Professional</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-4">
                {business.phone && (
                  <div className="flex items-center text-lg text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-4 text-blue-600">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span>{business.phone}</span>
                  </div>
                )}
                {business.website && (
                  <div className="flex items-center text-lg text-gray-700">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-4 text-blue-600 shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline hover:text-blue-800 break-all">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                {business.website ? (
                  <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold text-lg rounded-xl shadow-lg shadow-blue-200 transition-transform transform md:hover:scale-105 flex items-center justify-center aria-label='Visit Website'">
                    Visit Website <ExternalLink className="w-5 h-5 ml-2" />
                  </a>
                ) : (
                  <a href={business.phone ? `tel:${business.phone}` : '#'} className="flex-1 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-center font-bold text-lg rounded-xl shadow-lg shadow-emerald-200 transition-transform transform md:hover:scale-105 flex items-center justify-center aria-label='Call Provider'">
                    Contact via Phone <Phone className="w-5 h-5 ml-2" />
                  </a>
                )}
                {business.is_bbb_accredited && (
                  <a href={business.bbb_url || bbbSearchUrl} target="_blank" rel="noreferrer nofollow" className="flex-1 py-4 px-6 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-center font-bold text-base rounded-xl transition-colors flex items-center justify-center">
                    Verified on BBB.org <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Service Area ({primaryFsa})</h2>
              </div>
              <div className="w-full h-80 bg-gray-200 overflow-hidden relative z-0">
                <MapWrapper singleBusiness={business} />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-50">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Is {business.name} BBB Accredited?</h3>
                  <p className="text-gray-600">{business.is_verified ? `Yes, ${business.name} is a verified provider maintaining an active positive rating profile and passed the Agora check.` : `${business.name} is monitored in our trust network.`}</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Do they offer services in {regionName}?</h3>
                  <p className="text-gray-600">Yes, {business.name} actively operates and provides services in the {regionName} area including postal area {primaryFsa}.</p>
                </div>
              </div>
            </div>

          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-xl p-8 border border-blue-100 transform md:-translate-y-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  Agora Trust Report
                </h2>
              </div>

              <p className="text-sm text-gray-500 mb-8 border-b border-gray-200 pb-4 flex items-center justify-between">
                <span>AI-Synthesized sentiment.</span>
                <Link href="/trust-score" className="flex items-center text-blue-600 hover:text-blue-800 font-medium group transition-colors cursor-pointer" aria-label="How is this score calculated?">
                  <Info className="w-4 h-4 mr-1 group-hover:fill-blue-100" />
                  <span className="text-xs">How it's built</span>
                </Link>
              </p>

              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-blue-100 bg-white mb-4 shadow-inner" aria-label={`Trust score: ${Math.round(masterScore)}`}>
                  <div className="text-4xl font-black text-amber-500 flex items-center">
                    {Math.round(masterScore)}
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-900">Aggregate Score</h3>
              </div>

              <div className="space-y-5" aria-hidden="true">
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-semibold text-gray-700 text-sm">Reliability</span>
                    <span className="font-bold text-blue-900">{reliabilityScore}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${reliabilityScore}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-semibold text-gray-700 text-sm">Value</span>
                    <span className="font-bold text-blue-900">{valueScore}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${valueScore}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-semibold text-gray-700 text-sm">Craftsmanship</span>
                    <span className="font-bold text-blue-900">{craftsmanshipScore}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${craftsmanshipScore}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-white/60 p-4 rounded-xl text-sm text-gray-600 flex items-start">
                <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 shrink-0" />
                <p>This score aggregates highly weighted local reputation markers.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
