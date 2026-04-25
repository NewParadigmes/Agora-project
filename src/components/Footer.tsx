import Link from "next/link";
import { Mail, MapPin, ShieldCheck, Zap, Users } from "lucide-react";

const categories = [
  { label: "Plumbing",            href: "/plumbing/halifax" },
  { label: "Electrical",          href: "/electrical/halifax" },
  { label: "General Contracting", href: "/general-contracting/halifax" },
  { label: "Painting",            href: "/painting/halifax" },
];

const quickLinks = [
  { label: "Home",          href: "/" },
  { label: "Trust Score",   href: "/trust-score" },
  { label: "Explore",       href: "/explore" },
  { label: "Join as Pro",   href: "/pro" },
  { label: "Service Map",   href: "/#map" },
];

export default function Footer() {
  return (
    <footer className="bg-[#F5F5F7] border-t border-black/[0.03] text-[#1D1D1F]">
      {/* Trust Banner */}
      <div className="border-b border-black/[0.03]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck className="w-6 h-6 text-[#248A3D]" />,
                title: "AI-Verified Pros",
                desc: "50/30/20 trust weighting across Google, Reddit & BBB.",
              },
              {
                icon: <Users className="w-6 h-6 text-[#0071E3]" />,
                title: "593+ Professionals",
                desc: "Nova Scotia-wide network of verified tradespeople.",
              },
              {
                icon: <Zap className="w-6 h-6 text-[#FF9F0A]" />,
                title: "Always Free",
                desc: "No subscription, no upsells. Just trusted connections.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-black/5">
                  {item.icon}
                </div>
                <div>
                  <div className="font-bold text-sm text-[#1D1D1F]">{item.title}</div>
                  <div className="text-xs text-[#86868B] mt-1 font-medium leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-2 group" aria-label="Agora NS">
              <div className="w-8 h-8 rounded-lg bg-[#0071E3] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                Agora<span className="text-[#0071E3]">NS</span>
              </span>
            </Link>
            <p className="text-[#86868B] text-sm leading-relaxed font-medium max-w-xs">
              Nova Scotia&apos;s AI-powered marketplace for verified home service professionals.
              Community-driven. Mathematically trusted.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-black text-[#1D1D1F] uppercase tracking-[0.25em] mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm font-semibold text-[#86868B] hover:text-[#0071E3] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[10px] font-black text-[#1D1D1F] uppercase tracking-[0.25em] mb-6">
              Expertise
            </h4>
            <ul className="space-y-3">
              {categories.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="text-sm font-semibold text-[#86868B] hover:text-[#248A3D] transition-colors">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-black text-[#1D1D1F] uppercase tracking-[0.25em] mb-6">
              Resources
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm font-semibold text-[#86868B]">
                <Mail className="w-4 h-4 text-[#0071E3] flex-shrink-0" />
                <span>support@agorans.ca</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-[#86868B]">
                <MapPin className="w-4 h-4 text-[#0071E3] flex-shrink-0" />
                <span>Halifax, Nova Scotia</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-black/[0.03]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-[#A1A1A6]">
            &copy; {new Date().getFullYear()} Agora NS. Dedicated to quality workmanship.
          </p>
          <div className="flex items-center gap-6">
             <p className="text-xs font-bold text-[#A1A1A6] uppercase tracking-widest">
                AI Audit System v4.2
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
