import Link from "next/link";
import { ShieldCheck, Wrench, Zap, Home, Paintbrush, ArrowRight, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgoraCanvas from "@/components/AgoraCanvas";
import MapWrapper from "@/components/MapWrapper";
import TestimonialMarquee from "@/components/TestimonialMarquee";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Business {
  name: string;
  slug: string | null;
  is_verified: boolean | null;
  ai_reputation_score: string | null;
  category: string | null;
}

interface Stats {
  total_businesses: number;
  total_service_areas: number;
  total_categories: number;
}

// ─── Data Fetching ────────────────────────────────────────────────────────────

import { NS_REGIONS } from "@/utils/fsaMapping";

async function fetchStats(): Promise<Stats> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const [biz, cat] = await Promise.all([
    supabase.from("businesses").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
  ]);
  return {
    total_businesses: biz.count ?? 0,
    total_service_areas: Object.keys(NS_REGIONS).length,
    total_categories: cat.count ?? 0,
  };
}

async function fetchTopPros(): Promise<Business[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("businesses")
    .select("name, slug, is_verified, ai_reputation_score, categories(name)")
    .order("ai_reputation_score", { ascending: false })
    .limit(10);

  return (data ?? []).map((b: Record<string, unknown>) => ({
    name: b.name as string,
    slug: b.slug as string | null,
    is_verified: b.is_verified as boolean | null,
    ai_reputation_score: b.ai_reputation_score as string | null,
    category: (b.categories as { name: string } | null)?.name ?? null,
  }));
}

// ─── Static data ─────────────────────────────────────────────────────────────

const categories = [
  { name: "Plumbing", icon: Wrench, slug: "plumbing", desc: "Verified plumbers for leaks, clogs & renovations." },
  { name: "Electrical", icon: Zap, slug: "electrical", desc: "Certified electricians for wiring, panels & lighting." },
  { name: "Painting", icon: Paintbrush, slug: "painting", desc: "Professional interior & exterior painting." },
  { name: "Contracting", icon: Home, slug: "general-contracting", desc: "General contractors for additions & remodelling." },
];

// ─── JSON-LD ─────────────────────────────────────────────────────────────────

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://agorans.ca" },
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [stats, topPros] = await Promise.all([fetchStats(), fetchTopPros()]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="flex flex-col min-h-screen bg-[#F5F7FA]">
        <Navbar />

        <main className="flex-grow">

          {/* ── 1. SCROLLYTELLING CANVAS (Rendered First) ──────────────── */}
          <section className="relative w-full bg-[#F5F7FA]">
            <AgoraCanvas />
          </section>

          {/* ── 2. STATIC HERO (Rendered after 3D element) ──────────── */}
          <section className="w-full bg-[#F5F7FA] pt-16 pb-16 md:pb-24">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
              <span className="text-[12px] md:text-xs font-black tracking-[0.3em] text-[#248A3D] uppercase mb-6">
                Nova Scotia&apos;s Professional Registry
              </span>
              <h1 className="text-5xl md:text-8xl font-bold text-[#1D1D1F] tracking-tighter leading-[0.95] mb-8 max-w-4xl">
                Find Trusted Pros <br />
                <span className="text-[#0071E3]">in Nova Scotia.</span>
              </h1>

              {/* Search Pill */}
              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <Link href="/#map" className="btn-primary text-xl px-12 py-5 shadow-2xl shadow-[#0071E3]/20">
                  Search Postal Code
                </Link>
                <Link href="/trust-score" className="btn-ghost text-xl px-10 py-5 bg-white border border-black/5 hover:bg-black/5 transition-colors">
                  Our Method <span className="ml-2 font-black">→</span>
                </Link>
              </div>
            </div>
          </section>


          {/* ── 2. STATS BAR ─────────────────────────────────────────── */}
          <section className="section-padding-sm border-y border-black/[0.03] bg-[#F5F5F7]">
            <div className="max-w-5xl mx-auto px-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                  <div className="text-4xl md:text-5xl font-bold text-[#1D1D1F] tabular-nums tracking-tighter">{stats.total_businesses}+</div>
                  <div className="text-sm font-semibold text-[#86868B] uppercase tracking-wider mt-1">Verified Pros</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-4xl md:text-5xl font-bold text-[#1D1D1F] tabular-nums tracking-tighter">{stats.total_service_areas}</div>
                  <div className="text-sm font-semibold text-[#86868B] uppercase tracking-wider mt-1">Service Zones</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-4xl md:text-5xl font-bold text-[#1D1D1F] tabular-nums tracking-tighter">{stats.total_categories}</div>
                  <div className="text-sm font-semibold text-[#86868B] uppercase tracking-wider mt-1">Trade Categories</div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 3. CATEGORIES ────────────────────────────────────────── */}
          <section id="categories" className="section-padding">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                <p className="text-sm font-bold tracking-[0.2em] text-[#0071E3] uppercase mb-4">
                  Scope of Service
                </p>
                <h2 className="text-4xl md:text-6xl font-bold text-[#1D1D1F] mb-6">
                  Browse by Trade
                </h2>
                <p className="text-[#86868B] text-lg md:text-xl max-w-xl mx-auto font-medium">
                  Select your requirement to discover top-tier specialists verified by the Agora Method.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.slug}
                      href={`/${cat.slug}/halifax`}
                      className="apple-card group flex flex-col items-start gap-6 p-8"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-[#0071E3]/5 flex items-center justify-center text-[#0071E3] group-hover:scale-110 transition-transform shadow-sm">
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">{cat.name}</h3>
                        <p className="text-sm text-[#86868B] leading-relaxed font-medium">{cat.desc}</p>
                      </div>
                      <div className="flex items-center gap-2 text-[#0071E3] text-sm font-bold mt-auto group-hover:gap-3 transition-all">
                        Explore <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── 4. TOP 10 PROS (live data) ───────────────────────────── */}
          <section id="top-pros" className="section-padding bg-[#F5F5F7]">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                  <p className="text-sm font-bold tracking-[0.2em] text-[#248A3D] uppercase mb-2">
                    Active Leaderboard
                  </p>
                  <h2 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] tracking-tight">
                    Nova Scotia&apos;s Elite Tier
                  </h2>
                </div>
                <Link href="/explore" className="btn-ghost text-sm font-bold">
                  Full Registry <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {topPros.map((pro, i) => (
                  <Link
                    key={pro.slug ?? i}
                    href={pro.slug ? `/plumbing/halifax/${pro.slug}` : "/explore"}
                    className="apple-card flex flex-col gap-4 p-6 group h-full"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-[#86868B]/40 uppercase tracking-widest">Rank #{i + 1}</span>
                      {pro.is_verified && (
                        <div className="verified-badge pulse scale-90 origin-right">
                          Verified
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full border-2 border-[#0071E3]/20 flex items-center justify-center text-xl font-bold text-[#0071E3] bg-[#0071E3]/5 flex-shrink-0">
                        {pro.ai_reputation_score ?? "85"}
                      </div>
                      <div>
                        <p className="text-[10px] text-[#86868B] font-bold uppercase tracking-wider">Trust Score</p>
                        <p className="text-xs font-bold text-[#0071E3]">{pro.category ?? "Professional"}</p>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-[#1D1D1F] leading-snug line-clamp-2 group-hover:text-[#0071E3] transition-colors flex-grow">
                      {pro.name}
                    </h3>

                    <div className="flex items-center gap-1 pt-3 border-t border-black/[0.03]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${s <= 4 ? "text-[#FF9F0A] fill-[#FF9F0A]" : "text-black/10"}`}
                        />
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ── 5. TRUST METHODOLOGY PREVIEW ─────────────────────────── */}
          <section id="how-it-works" className="section-padding">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <p className="text-sm font-bold tracking-[0.2em] text-[#0071E3] uppercase mb-4">
                  Objectivity First
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] mb-6 leading-[1.1]">
                  Trust Built on <br />
                  <span className="text-[#0071E3]">Math, Not Marketing.</span>
                </h2>
                <p className="text-[#86868B] text-lg mb-10 leading-relaxed font-medium">
                  We built our scoring engine to be ungameable. By cross-referencing three independent data sources, we ensure only true professionals reach the top.
                </p>

                <div className="space-y-6 mb-10">
                  {[
                    { label: "Google Public Reviews", pct: 50, color: "#0071E3" },
                    { label: "Reddit Organic Sentiment", pct: 30, color: "#248A3D" },
                    { label: "BBB Resolution Records", pct: 20, color: "#FF9F0A" },
                  ].map((item) => (
                    <div key={item.label} className="group">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-[#1D1D1F] text-sm">{item.label}</span>
                        <span className="text-sm font-black" style={{ color: item.color }}>{item.pct}%</span>
                      </div>
                      <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${item.pct}%`,
                            background: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/trust-score" className="btn-primary text-base px-8 py-3.5">
                  See Voting Algorithm <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              {/* Glassmorphism card for light mode */}
              <div className="apple-card p-10 bg-white/40 backdrop-blur-xl border-white/50 relative overflow-hidden">
                <div className="flex items-center gap-4 pb-6 border-b border-black/5 mb-8">
                  <div className="w-12 h-12 rounded-full bg-[#248A3D]/10 flex items-center justify-center border border-[#248A3D]/20">
                    <ShieldCheck className="w-6 h-6 text-[#248A3D]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1D1D1F] text-lg">Agora Verified</p>
                    <p className="text-xs font-bold text-[#86868B] uppercase tracking-wider">Standard Protocol v4.2</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {[
                    { step: "01", title: "Review Velocity", text: "We detect suspicious review bursts on Google Maps." },
                    { step: "02", title: "Natural Sentiment", text: "NLP scanning of Nova Scotia subreddits for organic trade mentions." },
                    { step: "03", title: "Bureau Records", text: "Direct sync with BBB complaint history and resolution rates." },
                    { step: "04", title: "Dynamic Scoring", text: "One objective 0–100 score, recalculated every 30 days." },
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-6">
                      <span className="text-3xl font-black text-[#0071E3]/20 tabular-nums">
                        {s.step}
                      </span>
                      <div>
                        <h4 className="font-bold text-[#1D1D1F] text-sm mb-1">{s.title}</h4>
                        <p className="text-sm text-[#86868B] leading-relaxed font-medium">{s.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── 6. INTERACTIVE MAP ───────────────────────────────────── */}
          <section id="map" className="section-padding bg-[#F5F5F7]">
            <div className="max-w-7xl mx-auto px-4 h-[80vh] min-h-[600px] flex flex-col">
              <div className="text-center mb-12">
                <p className="text-sm font-bold tracking-[0.2em] text-[#0071E3] uppercase mb-4">
                  Hyper-Local Search
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] mb-4">
                  Find pros near you.
                </h2>
                <p className="text-[#86868B] text-lg max-w-xl mx-auto font-medium">
                  Search by postal code to discover verified tradespeople serving your specific neighbourhood.
                </p>
              </div>

              <div className="flex-1 relative apple-card overflow-hidden">
                <MapWrapper />
              </div>
            </div>
          </section>

          {/* ── 7. TESTIMONIALS MARQUEE ──────────────────────────────── */}
          <section className="section-padding-sm bg-[#FBFBFD]">
            <div className="max-w-7xl mx-auto px-4 mb-2 text-center">
              <p className="text-sm font-bold tracking-[0.2em] text-[#FF9F0A] uppercase mb-4">
                Community Feedback
              </p>
              <h2 className="text-4xl md:text-6xl font-bold text-[#1D1D1F] tracking-tight">
                Trusted by Nova Scotians.
              </h2>
            </div>
            <TestimonialMarquee />
          </section>

          {/* ── 8. JOIN AS PRO CTA ───────────────────────────────────── */}
          <section className="section-padding">
            <div className="max-w-5xl mx-auto px-4">
              <div className="apple-card bg-neutral-900 overflow-hidden relative p-12 md:p-20 text-center">
                {/* Visual accent circles */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#0071E3]/20 blur-[100px] rounded-full -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#248A3D]/20 blur-[100px] rounded-full -ml-48 -mb-48" />

                <div className="relative z-10 max-w-2xl mx-auto">
                  <p className="text-sm font-bold tracking-[0.2em] text-[#248A3D] uppercase mb-6">
                    Professional Partners
                  </p>
                  <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Claim Your <br />
                    Professional Profile.
                  </h2>
                  <p className="text-white/60 text-lg md:text-xl mb-10 leading-relaxed font-medium">
                    Join {stats.total_businesses}+ verified pros. Gain visibility in the only trade marketplace Nova Scotians trust.
                  </p>
                  <Link href="/pro" className="btn-primary text-lg px-12 py-4">
                    Get Verified <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
