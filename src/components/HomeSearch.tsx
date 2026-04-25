"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { getRegionFromFSA } from "@/utils/fsaMapping";

export default function HomeSearch() {
  const [postalCode, setPostalCode] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = postalCode.trim();
    if (!query) return;

    let searchSlug = "";
    if (/\d/.test(query)) {
      searchSlug = query.replace(/\s+/g, "").substring(0, 3).toUpperCase();
    } else {
      searchSlug = query.toLowerCase().replace(/\s+/g, '-');
    }

    router.push(`/plumbing/${searchSlug}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostalCode(e.target.value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative group">
        <div className="relative flex items-center">
          <div className="absolute left-6 text-primary/30 group-focus-within:text-accent transition-colors">
            <Search className="w-6 h-6" />
          </div>
          <input
            id="postalCode"
            type="text"
            className="block w-full pl-16 pr-44 py-6 border-2 border-primary/10 rounded-2xl bg-white shadow-xl text-xl font-semibold placeholder:text-gray-400 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all text-primary uppercase"
            placeholder="Enter Postal Code (e.g. B3H)"
            value={postalCode}
            onChange={handleChange}
            autoComplete="off"
            aria-label="Enter your postal code to find local pros"
          />
          <div className="absolute right-2 inset-y-2">
            <button
              type="submit"
              disabled={postalCode.length < 3}
              className="h-full bg-primary hover:bg-primary-accent text-white font-bold px-8 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-[1.02] active:scale-95"
            >
              Search
              <ArrowRight className="w-5 h-5 text-accent" />
            </button>
          </div>
        </div>
      </form>
      <div className="mt-4 flex justify-center gap-6 text-sm font-medium text-primary/60">
        <p className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
          Trusted in Halifax
        </p>
        <p className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
          Verified in Dartmouth
        </p>
        <p className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
          Available in Sydney
        </p>
      </div>
    </div>
  );
}
