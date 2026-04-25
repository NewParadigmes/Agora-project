import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowRight, CheckCircle, AlertCircle, BarChart2, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Trust Score Methodology",
  description:
    "Understand exactly how Agora NS calculates its AI-powered trust score. Our 50/30/20 algorithm combines Google Reviews, Reddit Sentiment, and BBB Records for an objective, ungameable rating.",
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type":    "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",        item: "https://agorans.ca" },
    { "@type": "ListItem", position: 2, name: "Trust Score", item: "https://agorans.ca/trust-score" },
  ],
};

const pillars = [
  {
    icon:   BarChart2,
    color:  "#0071E3",
    pct:    50,
    title:  "Google Reviews",
    desc:   "We pull every public review from Google Maps for each listed business. Our AI normalises star ratings, analyses review velocity (are they getting reviews consistently or in suspicious bursts?), and weighs recency so older reviews matter less than recent ones.",
    data:   ["Volume & velocity analysis", "Recency-weighted scoring", "Duplicate & spam detection", "Response rate tracking"],
  },
  {
    icon:   MessageSquare,
    color:  "#248A3D",
    pct:    30,
    title:  "Reddit Sentiment",
    desc:   "Reddit is the most authentic source of unfiltered consumer opinion. Our NLP model scans subreddits like r/NovaScotia, r/Halifax, and trade-specific communities for organic mentions, automatically classifying tone as positive, negative, or neutral.",
    data:   ["NLP sentiment classification", "Multi-subreddit coverage", "Context-aware analysis", "No self-promo detection"],
  },
  {
    icon:   ShieldCheck,
    color:  "#FF9F0A",
    pct:    20,
    title:  "BBB Records",
    desc:   "The Better Business Bureau maintains the most trusted formal complaint database in Canada. We integrate accreditation status, complaint history, resolution rates, and any government trade-board records directly into the score.",
    data:   ["Accreditation status", "Complaint count & resolution %", "Government trade records", "Licence verification"],
  },
];

const faqs = [
  {
    q: "How often is the trust score updated?",
    a: "Scores are recalculated monthly as our AI scans for new reviews, Reddit mentions, and BBB updates. Significant events (a flood of new reviews or a new complaint) can trigger a re-score within 48 hours.",
  },
  {
    q: "Can a business pay to improve their score?",
    a: "No. Agora NS is completely free for home buyers, and no business can purchase a higher score. The algorithm is the sole determinant. This is non-negotiable to our mission.",
  },
  {
    q: "What does a score of 80+ mean?",
    a: "A score of 80 or above indicates a professional with consistently positive reviews, no significant Reddit red flags, and a clean BBB record. We consider these elite-tier providers.",
  },
  {
    q: "Why is Reddit included at 30%?",
    a: "Google reviews can be incentivised or gamed through review farms. Reddit is pseudonymous and community-moderated, making it far harder to manipulate. It captures what people actually say about a contractor when they think no one is watching.",
  },
  {
    q: "What if a business has no BBB record?",
    a: "If a business has never registered with the BBB we score that dimension at 50/100 (neutral), not 0. Absence of a record is not a red flag — but accreditation and a clean record does reward them.",
  },
];

export default function TrustScorePage() {
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
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#0071E3]/5 blur-[100px] rounded-full pointer-events-none"
            />
            <div className="max-w-3xl mx-auto relative px-4">
              <div className="inline-flex items-center gap-2 bg-[#248A3D]/10 border border-[#248A3D]/20 text-[#248A3D] px-6 py-2.5 rounded-full text-sm font-bold mb-8">
                <ShieldCheck className="w-5 h-5" />
                Engineering Transparency
              </div>
              <h1 className="text-4xl md:text-7xl font-bold text-[#1D1D1F] mb-8 leading-[1.05] tracking-tight">
                Trust Built on <br />
                <span className="text-[#0071E3]">Objective Science.</span>
              </h1>
              <p className="text-xl text-[#86868B] leading-relaxed max-w-2xl mx-auto font-medium">
                We believe you deserve to know exactly how we evaluate tradespeople.
                No black boxes. No paid rankings. Here&apos;s every technical detail.
              </p>
            </div>
          </section>

          {/* Score Visual */}
          <section className="section-padding-sm bg-[#F5F5F7]">
            <div className="max-w-5xl mx-auto px-4">
              <div className="apple-card p-10 md:p-16">
                <h2 className="text-3xl font-bold text-[#1D1D1F] text-center mb-12">
                  The 50 / 30 / 20 Algorithm
                </h2>
                <div className="space-y-12">
                  {pillars.map((p) => {
                    const Icon = p.icon;
                    return (
                      <div key={p.title}>
                        <div className="flex items-center gap-4 mb-4">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `${p.color}15` }}
                          >
                            <Icon className="w-6 h-6" style={{ color: p.color }} />
                          </div>
                          <span className="text-lg font-bold text-[#1D1D1F]">{p.title}</span>
                          <span className="ml-auto text-3xl font-black tabular-nums" style={{ color: p.color }}>
                            {p.pct}%
                          </span>
                        </div>
                        <div className="h-3 w-full bg-black/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${p.pct}%`,
                              background: p.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Pillar Deep-Dives */}
          <section className="section-padding">
            <div className="max-w-6xl mx-auto px-4 space-y-24">
              {pillars.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                      idx % 2 === 1 ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    <div className={idx % 2 === 1 ? "lg:order-2" : ""}>
                      <div
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-6"
                        style={{ background: `${p.color}10`, color: p.color, border: `1px solid ${p.color}20` }}
                      >
                        <Icon className="w-4 h-4" /> {p.pct}% Influence
                      </div>
                      <h2 className="text-3xl md:text-5xl font-bold text-[#1D1D1F] mb-6">
                        {p.title}
                      </h2>
                      <p className="text-lg text-[#86868B] leading-relaxed mb-8 font-medium">{p.desc}</p>
                      <ul className="space-y-4">
                        {p.data.map((d) => (
                          <li key={d} className="flex items-center gap-3 text-base text-[#1D1D1F] font-semibold">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: p.color }} />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div
                      className={`apple-card p-12 bg-white flex flex-col items-center justify-center text-center ${idx % 2 === 1 ? "lg:order-1" : ""}`}
                      style={{ borderTop: `4px solid ${p.color}` }}
                    >
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
                        style={{ background: `${p.color}08` }}
                      >
                        <Icon className="w-10 h-10" style={{ color: p.color }} />
                      </div>
                      <p className="text-6xl font-black mb-2 tabular-nums" style={{ color: p.color }}>
                        {p.pct}
                        <span className="text-2xl text-[#86868B] font-medium ml-1">/100</span>
                      </p>
                      <p className="text-[#86868B] font-bold text-sm uppercase tracking-widest">Weight Multiplier</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* What Disqualifies */}
          <section className="section-padding-sm">
            <div className="max-w-4xl mx-auto px-4">
              <div className="apple-card p-10 bg-[#FF3B30]/5 border-[#FF3B30]/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-[#FF3B30]/10 flex items-center justify-center">
                    <AlertCircle className="w-7 h-7 text-[#FF3B30]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1D1D1F]">Automatic Disqualifiers</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    "Unresolved BBB complaint in the last year",
                    "Reddit scanning detects 3+ scam reports",
                    "Suspicious review farming patterns found",
                    "Expired or unverifiable trade licensing",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-[#FF3B30] flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span className="text-white text-xs font-black">✕</span>
                      </div>
                      <p className="text-base text-[#1D1D1F] font-semibold">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="section-padding bg-[#F5F5F7]">
            <div className="max-w-3xl mx-auto px-4">
              <h2 className="text-4xl font-bold text-[#1D1D1F] text-center mb-16">
                Common Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <details
                    key={faq.q}
                    className="apple-card group [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between cursor-pointer p-8 font-bold text-[#1D1D1F] hover:text-[#0071E3] transition-colors select-none">
                      <span className="text-lg">{faq.q}</span>
                      <ArrowRight className="w-5 h-5 flex-shrink-0 group-open:rotate-90 transition-transform text-[#0071E3]" />
                    </summary>
                    <div className="px-8 pb-8 pt-0 text-[#86868B] text-lg leading-relaxed font-medium">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="section-padding text-center">
            <div className="max-w-2xl mx-auto px-4">
              <h2 className="text-3xl md:text-5xl font-bold text-[#1D1D1F] mb-6">
                Ready to find a trusted pro?
              </h2>
              <p className="text-xl text-[#86868B] mb-10 font-medium leading-relaxed">
                Every business you see is vetted by this exact methodology. Browse with final confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/explore" className="btn-primary text-xl px-12 py-5">
                  Explore Pros <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/pro" className="btn-ghost text-xl px-8 py-5">
                  Register as Pro
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
