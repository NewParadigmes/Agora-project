"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ShieldCheck, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Trust Score", href: "/trust-score" },
  { label: "Explore", href: "/explore" },
  { label: "Join as Pro", href: "/pro" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-[#F5F7FA]"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group decoration-0"
            aria-label="Agora NS — Home"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0071E3] flex items-center justify-center shadow-sm transition-all group-hover:scale-110">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-[#1D1D1F] tracking-tight">
              Agora<span className="text-[#0071E3]">NS</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-[#1D1D1F]/80 hover:text-[#0071E3] transition-colors"
                style={{ letterSpacing: '0' }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/explore"
              className="ml-4 btn-primary text-sm px-6 py-2.5"
            >
              Find a Pro
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#1D1D1F]/80 hover:text-[#0071E3] rounded-lg transition-colors"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100 shadow-xl" : "max-h-0 opacity-0"
          }`}
      >
        <div className="bg-[#F5F7FA] border-t border-black/5 px-4 pt-3 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-4 py-3 text-[#1D1D1F]/80 hover:text-[#0071E3] hover:bg-black/5 rounded-xl transition-all font-medium"
            >
              {link.label}
              <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
            </Link>
          ))}
          <div className="pt-2 px-4">
            <Link
              href="/explore"
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full text-sm py-3"
            >
              Find a Pro
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
