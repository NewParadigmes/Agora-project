"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { NS_REGIONS, getRegionFromFSA, serviceZones } from "@/utils/fsaMapping";
import Link from "next/link";
import { Search, Navigation, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

// ── Custom SF Blue pin icon ────────────────────────────────────────────────

const customIcon = new L.DivIcon({
  className: "",
  html: `<div style="
    width: 32px;
    height: 32px;
    background: #FFFFFF;
    border: 2px solid #0071E3;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 113, 227, 0.2);
  ">
    <div style="
      width: 12px;
      height: 12px;
      background: #0071E3;
      border-radius: 50%;
      transform: rotate(45deg);
    "></div>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -36],
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
}

const getCoordsForFSA = (fsa: string, index: number, exact: boolean = false): [number, number] | null => {
  if (!fsa) return null;
  const upperFsa = fsa.substring(0, 3).toUpperCase();
  const zoneData = serviceZones[upperFsa];

  if (zoneData) {
    if (exact) return [zoneData.lat, zoneData.lng];
    // Spiral offset for clustering
    const angle = index * Math.PI * 0.76; 
    const radius = 0.003 + (0.001 * index);
    return [zoneData.lat + Math.cos(angle) * radius, zoneData.lng + Math.sin(angle) * radius];
  }

  // Fallback for unknown FSA: Center of Nova Scotia from DEFAULT
  const defaultZone = serviceZones["DEFAULT"] || { lat: 45.0, lng: -63.0 };
  if (exact) return [defaultZone.lat, defaultZone.lng];
  const angle = index * Math.PI * 0.76;
  const radius = 0.005 + (0.002 * index);
  return [defaultZone.lat + Math.cos(angle) * radius, defaultZone.lng + Math.sin(angle) * radius];
}

export default function MapComponent({ businesses, singleBusiness, zoom = 9 }: { businesses?: any[], singleBusiness?: any, zoom?: number }) {
  const router = useRouter();
  const isDynamic = !!businesses || !!singleBusiness;
  const displayList = businesses || (singleBusiness ? [singleBusiness] : []);
  const [postalCode, setPostalCode] = useState("");
  const [center, setCenter] = useState<[number, number]>(() => {
    if (singleBusiness && singleBusiness.fsa) {
      const coords = getCoordsForFSA(singleBusiness.fsa, 0, true);
      if (coords) return coords;
    }
    return [44.6476, -63.5728]; // Default Halifax
  });

  // Re-center map if singleBusiness changes or if businesses list updates and we want to fit bounds
  useEffect(() => {
    if (isDynamic && displayList.length > 0 && displayList[0].fsa) {
      const coords = getCoordsForFSA(displayList[0].fsa, 0, true);
      if (coords) setCenter(coords);
    }
  }, [businesses, singleBusiness]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const input = postalCode.trim();
    if (!input) return;

    let searchSlug = "";
    
    // Check if it looks like a postal code (contains a number)
    if (/\d/.test(input)) {
      searchSlug = input.replace(/\s+/g, "").substring(0, 3).toUpperCase();
    } else {
      // Looks like a city or region name
      searchSlug = input.toLowerCase().replace(/\s+/g, '-');
    }

    // Determine category based on current URL, default to plumbing
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
    const segments = currentPath.split("/").filter(Boolean);
    const category = segments[0] && segments[0] !== "explore" && segments[0] !== "pro" ? segments[0] : "plumbing";

    router.push(`/${category}/${searchSlug}`);
  };

  const locateMe = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      {!isDynamic && (
      <form onSubmit={handleSearch} className="w-full max-w-md mx-auto mb-6 relative z-20 flex gap-3 px-4">
        <div className="relative flex-1">
          <input
            id="mapSearchInput"
            type="text"
            className="block w-full pl-6 pr-12 py-4 border border-black/5 rounded-2xl bg-white/70 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-lg font-semibold placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#0071E3]/10 transition-all"
            placeholder="Search by postal code or city..."
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
          <button type="submit" className="absolute right-4 inset-y-0 text-[#0071E3]">
            <Search className="w-6 h-6" />
          </button>
        </div>
        <button
          type="button"
          onClick={locateMe}
          className="bg-white/70 backdrop-blur-md border border-black/5 p-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-[#0071E3] hover:scale-105 transition-all"
        >
          <Navigation className="w-6 h-6" />
        </button>
      </form>
      )}

      <div className={`w-full h-full min-h-[400px] ${!isDynamic ? 'rounded-3xl shadow-xl' : 'rounded-none'} overflow-hidden border-0 relative z-10`}>
        <MapContainer center={center} zoom={singleBusiness ? 13 : zoom} scrollWheelZoom={true} className="w-full h-full min-h-[400px]">
          {/* CartoDB Positron - High contrast, clean Light Mode */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
          />
          <MapUpdater center={center} />

          {isDynamic ? (
            displayList.map((business, i) => {
              const fsa = business.fsa;
              if (!fsa) return null;
              const coords = getCoordsForFSA(fsa, i, !!singleBusiness);
              if (!coords) return null;
              const catSlug = business.categories?.name ? business.categories.name.toLowerCase() : 'professional';
              const regionSlug = getRegionFromFSA(fsa);

              return (
                <Marker key={business.id || i} position={coords} icon={customIcon}>
                  <Popup>
                    <div className="p-2 text-center max-w-[200px]">
                      <h3 className="font-bold text-[#1D1D1F] text-sm mb-1">{business.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{business.city || 'Nova Scotia'}</p>
                      <Link
                        href={`/${catSlug}/${regionSlug}/${business.slug || business.id}`}
                        className="bg-slate-900 text-white hover:bg-slate-800 transition-colors w-full text-sm py-2 px-3 rounded-lg block font-medium mt-2"
                      >
                        View Profile
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })
          ) : (
            Object.entries(NS_REGIONS).map(([key, region]) => (
              <Marker key={key} position={[region.lat, region.lng]} icon={customIcon}>
                <Popup>
                  <div className="p-2 text-center">
                    <h3 className="font-bold text-[#1D1D1F] text-lg mb-1">{region.name}</h3>
                    <p className="text-sm text-[#86868B] mb-4">Servicing {region.fsaPrefixes.length} FSA Zones</p>
                    <Link
                      href={`/plumbing/${region.slug}`}
                      className="bg-slate-900 text-white hover:bg-slate-800 transition-colors w-full text-sm py-2.5 px-4 rounded-lg block font-medium"
                    >
                      Browse Professionals
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))
          )}
        </MapContainer>
      </div>
    </div>
  );
}
