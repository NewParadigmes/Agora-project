import type { Metadata } from "next";
import Link from "next/link";
import { Wrench, Zap, Home, Paintbrush, MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Explore Home Services",
  description:
    "Browse all verified home service professionals in Nova Scotia by trade category and region. Find plumbers, electricians, contractors, and painters near you.",
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",    item: "https://agorans.ca" },
    { "@type": "ListItem", position: 2, name: "Explore", item: "https://agorans.ca/explore" },
  ],
};

const categoryList = [
  {
    name:  "Plumbing",
    slug:  "plumbing",
    icon:  Wrench,
    color: "#0071E3",
    desc:  "Licensed plumbers for residential and commercial work across Nova Scotia.",
    count: "200+",
  },
  {
    name:  "Electrical",
    slug:  "electrical",
    icon:  Zap,
    color: "#FF9F0A",
    desc:  "Certified electricians for panels, wiring, EV chargers & lighting.",
    count: "150+",
  },
  {
    name:  "Contracting",
    slug:  "general-contracting",
    icon:  Home,
    color: "#248A3D",
    desc:  "Trusted general contractors for renovations, additions & new builds.",
    count: "120+",
  },
  {
    name:  "Painting",
    slug:  "painting",
    icon:  Paintbrush,
    color: "#AF52DE",
    desc:  "Professional interior & exterior painters. Insured & verified.",
    count: "80+",
  },
];

const regions = [
  { name: "Halifax",     slug: "halifax",     fsa: "B3H" },
  { name: "Dartmouth",   slug: "dartmouth",   fsa: "B2W" },
  { name: "Truro",       slug: "truro",       fsa: "B2N" },
  { name: "Sydney",      slug: "sydney",      fsa: "B1A" },
  { name: "Bridgewater", slug: "bridgewater", fsa: "B4V" },
  { name: "Antigonish",  slug: "antigonish",  fsa: "B2G" },
  { name: "Kentville",   slug: "kentville",   fsa: "B4N" },
  { name: "Amherst",     slug: "amherst",     fsa: "B4H" },
];

export default function ExplorePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="flex flex-col min-h-screen bg-[#FBFBFD]">
        <Navbar />

        <main className="flex-grow pt-16">

          {/* Hero */}
          <section className="section-padding text-center relative overflow-hidden">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#0071E3]/5 blur-[100px] opacity-40 pointer-events-none"
            />
            <div className="max-w-3xl mx-auto relative px-4">
              <p className="text-sm font-bold tracking-[0.2em] text-[#248A3D] uppercase mb-4">
                Registry Index
              </p>
              <h1 className="text-4xl md:text-7xl font-bold text-[#1D1D1F] mb-6 tracking-tight">
                Nova Scotia&apos;s <br />
                <span className="text-[#0071E3]">Trade Directory</span>
              </h1>
              <p className="text-[#86868B] text-xl font-medium max-w-xl mx-auto leading-relaxed">
                Every listed professional has been vetted across 3 independent data sources for valid credentials and verified reputation.
              </p>
            </div>
          </section>

          {/* Browse by Category */}
          <section className="section-padding-sm bg-[#F5F5F7]">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-[#1D1D1F] mb-10 tracking-tight">
                Browse by Trade
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryList.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.slug}
                      href={`/${cat.slug}/halifax`}
                      className="apple-card group p-8 flex flex-col gap-6"
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
                          style={{
                            background: `${cat.color}10`,
                            color:      cat.color,
                          }}
                        >
                          <Icon className="w-7 h-7" />
                        </div>
                        <span
                          className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full"
                          style={{ background: `${cat.color}15`, color: cat.color }}
                        >
                          {cat.count} pros
                        </span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-[#1D1D1F] mb-2 group-hover:text-[#0071E3] transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-[#86868B] leading-relaxed font-medium">{cat.desc}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold mt-auto" style={{ color: cat.color }}>
                        View Registry <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Browse by Region */}
          <section className="section-padding">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                  <h2 className="text-3xl md:text-5xl font-bold text-[#1D1D1F] tracking-tight">
                    By Community
                  </h2>
                  <p className="text-[#86868B] text-lg font-medium mt-2">
                    Finding verified pros in every corner of the province.
                  </p>
                </div>
                <Link href="/#map" className="btn-primary text-sm px-6 py-3 rounded-full">
                  Interactive Map View <MapPin className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {regions.map((region) => (
                  <Link
                    key={region.slug}
                    href={`/plumbing/${region.slug}`}
                    className="apple-card group p-6 flex flex-col gap-2 hover:border-[#0071E3] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0071E3]/5 flex items-center justify-center text-[#0071E3]">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-[#1D1D1F] text-lg group-hover:text-[#0071E3] transition-colors">
                        {region.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#A1A1A6] font-black uppercase tracking-[0.2em] ml-11">FSA: {region.fsa}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Topic Map (Internal Linking) */}
          <section className="section-padding bg-[#F5F5F7]">
            <div className="max-w-7xl mx-auto px-4">
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-[#1D1D1F] tracking-tight">
                  Directory Index
                </h2>
                <p className="text-[#86868B] text-lg font-medium mt-2 max-w-xl">
                  Quick access to certified professional pages across all major Nova Scotia municipalities.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryList.map((cat) => (
                  <div key={cat.slug} className="apple-card p-8 bg-white/50 backdrop-blur-sm border-white/40">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${cat.color}10`, color: cat.color }}>
                         <ShieldCheck className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-[#1D1D1F] text-lg">{cat.name}</span>
                    </div>
                    <ul className="space-y-3">
                      {regions.slice(0, 5).map((r) => (
                        <li key={r.slug}>
                          <Link
                            href={`/${cat.slug}/${r.slug}`}
                            className="text-sm font-semibold text-[#86868B] hover:text-[#0071E3] transition-colors flex items-center gap-3 group"
                          >
                            <ArrowRight className="w-3.5 h-3.5 text-[#A1A1A6] group-hover:translate-x-1 transition-transform" />
                            {cat.name} in {r.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
