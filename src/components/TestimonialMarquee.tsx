"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck } from "lucide-react";

const TESTIMONIALS = [
  {
    name:  "Sarah M.",
    role:  "Home Buyer — Dartmouth, NS",
    quote: "Found a plumber in 10 minutes. The trust score made the decision completely effortless.",
    score: 5,
  },
  {
    name:  "James T.",
    role:  "Homeowner — Halifax, NS",
    quote: "Agora caught a contractor with unresolved BBB complaints before I hired them. Saved me thousands.",
    score: 5,
  },
  {
    name:  "Priya S.",
    role:  "First-Time Buyer — Sydney, NS",
    quote: "As someone new to Nova Scotia, I had zero local connections. Agora gave me total confidence.",
    score: 5,
  },
  {
    name:  "David C.",
    role:  "House Renovator — Truro, NS",
    quote: "Three projects, three verified pros. Zero problems. This is what the industry needed.",
    score: 5,
  },
  {
    name:  "Linda K.",
    role:  "Condo Owner — Bedford, NS",
    quote: "The map feature helped me find someone actually in my neighbourhood. Booked same day.",
    score: 5,
  },
  {
    name:  "Tom F.",
    role:  "Property Flipper — Antigonish, NS",
    quote: "I hire weekly. Agora's AI score shaves hours off my vetting process every single time.",
    score: 5,
  },
  {
    name:  "Marie-Claire B.",
    role:  "Home Buyer — Kentville, NS",
    quote: "The Reddit sentiment data was the feature that sealed it for me. Organic reviews don't lie.",
    score: 5,
  },
  {
    name:  "Raj P.",
    role:  "Landlord — Dartmouth, NS",
    quote: "Multi-unit properties mean constant trades work. Agora is now my first stop, every time.",
    score: 5,
  },
];

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[0] }) {
  return (
    <div
      className="flex-shrink-0 mx-4 p-8 rounded-[24px] flex flex-col gap-5 border border-black/5 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]"
      style={{
        width: "360px",
      }}
    >
      {/* Stars */}
      <div className="flex items-center gap-1.5 text-[#FF9F0A]">
        {Array.from({ length: t.score }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-base leading-[1.6] text-[#1D1D1F] font-medium italic">
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Attribution */}
      <div className="flex items-center gap-4 pt-4 border-t border-black/[0.03]">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#248A3D]/10 border border-[#248A3D]/20 shadow-inner">
          <ShieldCheck className="w-5 h-5 text-[#248A3D]" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-[#1D1D1F]">{t.name}</span>
          <span className="text-xs text-[#86868B] font-medium">{t.role}</span>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialMarquee() {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        maskImage:         "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:   "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      <motion.div
        className="flex py-10"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 45,
          ease:     "linear",
          repeat:   Infinity,
        }}
        style={{ width: "max-content" }}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={i} t={t} />
        ))}
      </motion.div>
    </div>
  );
}
