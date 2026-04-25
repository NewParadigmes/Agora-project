"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { ShieldCheck, Phone, Globe, Search, MapPin, Loader2, Star, Leaf, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { getRegionFromFSA } from "@/utils/fsaMapping";
import MapWrapper from "@/components/MapWrapper";

export default function DirectoryClient({ initialBusinesses, fsas, initialFsa = "", initialRegionSlug = "", initialCategory = "" }: { initialBusinesses: any[], fsas: string[], initialFsa?: string, initialRegionSlug?: string, initialCategory?: string }) {
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [search, setSearch] = useState("");
  const [fsa, setFsa] = useState(initialFsa);
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);
  const [isEfficiencyOnly, setIsEfficiencyOnly] = useState(false);
  const [minScore, setMinScore] = useState(0);
  const [offset, setOffset] = useState(20);
  const [hasMore, setHasMore] = useState(initialBusinesses.length === 20);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(false);

  const supabase = createClient();

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const fetchFiltered = async () => {
      setIsLoading(true);
      const queryStr = `id, slug, name, phone, website, fsa, is_verified, is_bbb_accredited, is_efficiency_ns_partner, ai_reputation_score, categories${initialCategory ? '!inner' : ''}(name)`;

      let query = supabase
        .from("businesses")
        .select(queryStr)
        .order("ai_reputation_score", { ascending: false, nullsFirst: false });

      if (search) query = query.ilike("name", `%${search}%`);
      if (fsa) {
        query = query.eq("fsa", fsa);
      } else if (initialRegionSlug) {
        import("@/utils/fsaMapping").then(({ getFSAsForRegion }) => {
          const regionFsas = getFSAsForRegion(initialRegionSlug);
          if (regionFsas) query = query.in("fsa", regionFsas);
        });
      }
      if (initialCategory) query = query.ilike("categories.name", initialCategory);
      if (isVerifiedOnly) query = query.eq("is_verified", true);
      if (isEfficiencyOnly) query = query.eq("is_efficiency_ns_partner", true);
      if (minScore > 0) query = query.gte("ai_reputation_score", minScore);

      const { data, error } = await query.limit(20);

      if (!error && data) {
        setBusinesses(data);
        setOffset(20);
        setHasMore(data.length === 20);
      }
      setIsLoading(false);
    };

    const debounce = setTimeout(() => {
      fetchFiltered();
    }, 300);

    return () => clearTimeout(debounce);
  }, [search, fsa, isVerifiedOnly, isEfficiencyOnly, minScore]);

  const loadMore = async () => {
    setIsLoading(true);
    const queryStr = `id, slug, name, phone, website, fsa, is_verified, is_bbb_accredited, is_efficiency_ns_partner, ai_reputation_score, categories${initialCategory ? '!inner' : ''}(name)`;
    let query = supabase
      .from("businesses")
      .select(queryStr)
      .order("ai_reputation_score", { ascending: false, nullsFirst: false })
      .range(offset, offset + 19);

    if (search) query = query.ilike("name", `%${search}%`);
    if (fsa) {
      query = query.eq("fsa", fsa);
    } else if (initialRegionSlug) {
      const { getFSAsForRegion } = await import("@/utils/fsaMapping");
      const regionFsas = getFSAsForRegion(initialRegionSlug);
      if (regionFsas) query = query.in("fsa", regionFsas);
    }
    if (initialCategory) query = query.ilike("categories.name", initialCategory);
    if (isVerifiedOnly) query = query.eq("is_verified", true);
    if (isEfficiencyOnly) query = query.eq("is_efficiency_ns_partner", true);
    if (minScore > 0) query = query.gte("ai_reputation_score", minScore);

    const { data, error } = await query;
    if (!error && data) {
      setBusinesses((prev) => [...prev, ...data]);
      setOffset((prev) => prev + 20);
      setHasMore(data.length === 20);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full flex flex-col space-y-8 relative -top-12 z-10 px-2 sm:px-0">
      {/* Filter and Search Bar Card */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/60 p-6 sm:p-8 flex flex-col gap-6 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl text-slate-900 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-[15px]"
              placeholder="Search providers by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative md:w-72 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <select
              className="block w-full pl-12 pr-10 py-4 border border-slate-200 rounded-2xl text-slate-900 bg-slate-50 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-[15px] appearance-none"
              value={fsa}
              onChange={(e) => setFsa(e.target.value)}
            >
              <option value="">All Regions (Any FSA)</option>
              {fsas.map((region) => (
                <option key={region} value={region}>
                  FSA: {region}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Advanced Trust Filters */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4 pt-6 border-t border-slate-100 flex-wrap">
          <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm uppercase tracking-wider mr-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className={`flex items-center space-x-2.5 cursor-pointer px-4 py-3 rounded-xl border transition-all duration-200 select-none ${isVerifiedOnly ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}>
              <input
                type="checkbox"
                className="hidden"
                checked={isVerifiedOnly}
                onChange={(e) => setIsVerifiedOnly(e.target.checked)}
              />
              <ShieldCheck className={`w-5 h-5 ${isVerifiedOnly ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="text-[14px] font-semibold">BBB Accredited (A+)</span>
            </label>

            <label className={`flex items-center space-x-2.5 cursor-pointer px-4 py-3 rounded-xl border transition-all duration-200 select-none ${isEfficiencyOnly ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}>
              <input
                type="checkbox"
                className="hidden"
                checked={isEfficiencyOnly}
                onChange={(e) => setIsEfficiencyOnly(e.target.checked)}
              />
              <Leaf className={`w-5 h-5 ${isEfficiencyOnly ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="text-[14px] font-semibold">Efficiency NS Partner</span>
            </label>
          </div>

          <div className="flex-1 xl:ml-auto w-full xl:w-auto flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 bg-slate-50 px-5 py-4 rounded-xl border border-slate-200 min-w-[280px]">
            <span className="text-[14px] font-semibold text-slate-700 whitespace-nowrap min-w-[110px]">
              Min. Score: <span className="text-blue-600 ml-1">{minScore || "Any"}</span>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={minScore}
              onChange={(e) => setMinScore(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
              aria-label="Minimum Reputation Score filter"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full">
        <div className="flex-1 min-w-0">
          {/* Grid Layout of Businesses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {businesses.map((business) => {
              const catStr = business.categories?.name?.toLowerCase() || 'professional';
              const regStr = business.fsa ? getRegionFromFSA(business.fsa) : 'nova-scotia';

              return (
                <div key={business.id} className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 hover:border-slate-300 transition-all duration-200 flex flex-col justify-between h-full p-6 relative overflow-hidden">
                  <div>
                    {/* Top Section */}
                    <Link href={`/${catStr}/${regStr}/${business.slug || business.id}`}>
                      <h3 className="text-xl font-bold tracking-tight text-slate-900 line-clamp-2 mb-2 group-hover:text-slate-700 transition-colors">
                        {business.name}
                      </h3>
                    </Link>

                    {/* Middle Section: Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {business.is_bbb_accredited && (
                        <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold tracking-wide">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-800" />
                          <span>BBB A+ Verified</span>
                        </div>
                      )}
                      {business.is_efficiency_ns_partner && (
                        <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-800 text-xs font-bold tracking-wide">
                          <Leaf className="w-3.5 h-3.5 text-green-800" />
                          <span>Efficiency NS Partner</span>
                        </div>
                      )}
                      {business.is_verified && !business.is_bbb_accredited && !business.is_efficiency_ns_partner && (
                        <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-800 text-xs font-bold tracking-wide">
                          <ShieldCheck className="w-3.5 h-3.5 text-green-800" />
                          <span>Verified Pro</span>
                        </div>
                      )}
                    </div>

                    {/* Middle Section: Details */}
                    <div className="space-y-2 text-sm text-slate-500 mt-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="capitalize">{business.city || 'Nova Scotia'}, NS</span>
                      </div>
                      {business.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>{business.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Section: Actions */}
                  <div className="border-t border-slate-100 mt-4 pt-4 flex flex-row gap-3">
                    <Link href={`/${catStr}/${regStr}/${business.slug || business.id}`} className="flex-1 text-center py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors">
                      View Profile
                    </Link>
                    {business.website && (
                      <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors flex items-center justify-center">
                        Website
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {businesses.length === 0 && !isLoading && (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No businesses found {initialRegionSlug ? `in ${initialRegionSlug.toUpperCase().replace(/-/g, ' ')}` : "here"} yet.
              </h3>
              <p className="text-gray-500">Try adjusting your trust filters or expanding your search to a nearby region.</p>
            </div>
          )}

          {/* Pagination Load More */}
          {hasMore && (
            <div className="mt-8 flex justify-center pb-12">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isLoading ? "Loading..." : "Load More Plumbers"}
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Map Component */}
        <div className="w-full lg:w-[450px] xl:w-[500px] h-[600px] lg:h-[calc(100vh-120px)] lg:sticky top-24 rounded-3xl overflow-hidden border border-gray-200 shadow-xl z-10 flex-shrink-0">
          <MapWrapper businesses={businesses} />
        </div>
      </div>
    </div>
  );
}
