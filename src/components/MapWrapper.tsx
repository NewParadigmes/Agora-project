"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const MapComponentNoSSR = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-slate-100 animate-pulse rounded-2xl flex flex-col items-center justify-center text-gray-500 shadow-xl border border-gray-200">
      <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
      <span className="font-semibold text-lg">Loading Map Engine...</span>
    </div>
  ),
});

export default function MapWrapper(props: any) {
  return <MapComponentNoSSR {...props} />;
}
