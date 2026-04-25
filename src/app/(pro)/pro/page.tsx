import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Eye, Zap, ArrowRight, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Join as a Pro — Claim Your Free Profile",
  description:
    "Are you a Nova Scotia home service professional? Claim your free Agora NS profile and get discovered by verified home buyers in your area. No subscription. No hidden fees.",
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",        item: "https://agorans.ca" },
    { "@type": "ListItem", position: 2, name: "Join as Pro", item: "https://agorans.ca/pro" },
  ],
};

const benefits = [
  {
    icon:  Eye,
    color: "#0071E3",
    title: "Organic Visibility",
    desc:  "Your profile is indexed by our AI and surfaced to home buyers actively searching for your trade. Reach buyers when their intent is highest.",
  },
  {
    icon:  ShieldCheck,
    color: "#248A3D",
    title: "Verified Trust Seal",
    desc:  "Earn the Agora Verified badge — the premium trust signal Nova Scotia home buyers look for when choosing their next contractor.",
  },
  {
    icon:  Zap,
    color: "#FF9F0A",
    title: "Dynamic Rankings",
    desc:  "Your trust score updates automatically as you accumulate positive feedback. The best professionals naturally rise to the top.",
  },
];

const included = [
  "Public profile on Agora NS registry",
  "Searchable by FSA postal regions",
  "Monthly AI trust score refresh",
  "Agora Verified badge qualification",
  "Interactive map placement",
  "Semantic SEO linking for your brand",
  "No commission or hidden fees",
  "Zero-cost monthly listing",
];

export default async function ProPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { count: bizCount } = await supabase
    .from("businesses")
    .select("id", { count: "exact", head: true });
  const { count: areaCount } = await supabase
    .from("service_areas")
    .select("id", { count: "exact", head: true });

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
          <section className="section-padding relative overflow-hidden bg-[#F5F5F7] border-b border-black/[0.03]">
            <div
              className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#248A3D]/5 blur-[100px] rounded-full pointer-events-none"
            />
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#248A3D]/10 border border-[#248A3D]/20 text-[#248A3D] px-6 py-2 rounded-full text-sm font-bold mb-8">
                  <ShieldCheck className="w-5 h-5" />
                  Professional Partner Program
                </div>
                <h1 className="text-4xl md:text-7xl font-bold text-[#1D1D1F] mb-6 leading-[1.05] tracking-tight">
                  Claim Your <br />
                  <span className="text-[#248A3D]">Verification Seal.</span>
                </h1>
                <p className="text-xl text-[#86868B] leading-relaxed mb-10 font-medium">
                  Join {bizCount ?? 597}+ verified professionals on the only marketplace Nova Scotians trust. 
                  Home buyers in your community are searching for you—be found.
                </p>
                <div className="flex flex-col sm:flex-row gap-5">
                  <a href="#claim-form" className="btn-primary text-xl px-10 py-4 bg-[#248A3D] hover:bg-[#1E7233]">
                    Claim Profile <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                  <Link href="/trust-score" className="btn-ghost text-xl px-8 py-4">
                    How We Score
                  </Link>
                </div>
              </div>

              {/* Stats card */}
              <div className="apple-card p-10 bg-white space-y-8 shadow-[0_30px_60px_rgba(0,0,0,0.06)]">
                <h2 className="text-[11px] font-black text-[#86868B] uppercase tracking-[0.25em] border-b border-black/5 pb-6">
                  Platform Snapshot
                </h2>
                <div className="grid grid-cols-2 gap-10">
                  {[
                    { label: "Verified Pros",      value: `${bizCount ?? 597}+`, color: "#248A3D" },
                    { label: "Active FSAs",        value: `${areaCount ?? 325}`, color: "#0071E3" },
                    { label: "Algorithm v4",       value: "50/30/20",            color: "#FF9F0A" },
                    { label: "Subscription",       value: "Free",               color: "#1D1D1F" },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-3xl md:text-4xl font-black tabular-nums" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-xs font-bold text-[#86868B] mt-1 uppercase tracking-widest">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-black/5">
                  <p className="text-xs text-[#A1A1A6] leading-relaxed font-medium">
                    Agora scores are calculated algorithmically from Google, Reddit, and BBB records. 
                    Listings are strictly non-incentivized. Verification is earned, not purchased.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="section-padding">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-[#1D1D1F] tracking-tight mb-4">
                  Why Register?
                </h2>
                <p className="text-lg text-[#86868B] font-medium">Objective discovery for the province&apos;s best trades.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {benefits.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={b.title}
                      className="apple-card p-10 flex flex-col gap-6"
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner"
                        style={{ background: `${b.color}10`, color: b.color }}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">{b.title}</h3>
                        <p className="text-sm text-[#86868B] leading-relaxed font-medium">{b.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* What's Included */}
          <section className="section-padding-sm bg-[#F5F5F7]">
            <div className="max-w-5xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-[#1D1D1F] mb-6 tracking-tight">
                    Professional Suite
                  </h2>
                  <p className="text-lg text-[#86868B] mb-10 font-medium">Every tool you need to build trust with local buyers, included by default.</p>
                  <ul className="grid grid-cols-1 gap-4">
                    {included.map((item) => (
                      <li key={item} className="flex items-center gap-4 text-base text-[#1D1D1F] font-semibold">
                        <CheckCircle className="w-5 h-5 text-[#248A3D] flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Claim Form */}
                <div id="claim-form" className="apple-card p-10 space-y-6">
                  <h3 className="text-2xl font-bold text-[#1D1D1F]">
                    Registry Application
                  </h3>
                  <p className="text-sm text-[#86868B] font-medium leading-relaxed mb-4">
                    Submit your business details for verification. Our team cross-references licensure and reputation records within 72 hours.
                  </p>

                  <div className="space-y-5">
                    <div>
                      <label htmlFor="pro-name" className="block text-[10px] font-black text-[#86868B] uppercase tracking-[0.2em] mb-2">
                        Business Name
                      </label>
                      <input
                        id="pro-name"
                        type="text"
                        placeholder="e.g. Halifax Electrical Specialists"
                        className="w-full bg-[#FBFBFD] border border-black/5 rounded-2xl px-5 py-4 text-[#1D1D1F] font-semibold placeholder-[#A1A1A6] text-base focus:outline-none focus:ring-4 focus:ring-[#0071E3]/5 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="pro-trade" className="block text-[10px] font-black text-[#86868B] uppercase tracking-[0.2em] mb-2">
                        Core Trade
                      </label>
                      <select
                        id="pro-trade"
                        className="w-full bg-[#FBFBFD] border border-black/5 rounded-2xl px-5 py-4 text-[#1D1D1F] text-base font-semibold focus:outline-none focus:ring-4 focus:ring-[#0071E3]/5 transition-all"
                      >
                        <option value="">Select Category</option>
                        <option value="plumbing">Plumbing</option>
                        <option value="electrical">Electrical</option>
                        <option value="general-contracting">General Contracting</option>
                        <option value="painting">Painting</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="pro-email" className="block text-[10px] font-black text-[#86868B] uppercase tracking-[0.2em] mb-2">
                        Professional Email
                      </label>
                      <input
                        id="pro-email"
                        type="email"
                        placeholder="verified@company.ca"
                        className="w-full bg-[#FBFBFD] border border-black/5 rounded-2xl px-5 py-4 text-[#1D1D1F] font-semibold placeholder-[#A1A1A6] text-base focus:outline-none focus:ring-4 focus:ring-[#0071E3]/5 transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      id="pro-claim-btn"
                      className="w-full btn-primary text-xl py-4 bg-[#248A3D] hover:bg-[#1E7233] mt-2 shadow-lg"
                    >
                      Apply for Verification <ShieldCheck className="w-5 h-5 ml-2" />
                    </button>
                    <p className="text-[10px] text-[#A1A1A6] font-bold text-center uppercase tracking-widest pt-2">
                      Terms & Conditions Apply • Data Vetting Required
                    </p>
                  </div>
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
