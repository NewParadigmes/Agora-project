export interface RegionData {
  slug: string;
  name: string;
  fsaPrefixes: string[];
  lat: number;
  lng: number;
}

export const serviceZones: Record<string, { zone: string; lat: number; lng: number }> = {
  "B3H": { zone: "South End Halifax", lat: 44.6366, lng: -63.5855 },
  "B3J": { zone: "Downtown Halifax", lat: 44.6488, lng: -63.5752 },
  "B3K": { zone: "North End Halifax", lat: 44.6568, lng: -63.5971 },
  "B3L": { zone: "West End Halifax", lat: 44.6468, lng: -63.6163 },
  "B3M": { zone: "Clayton Park", lat: 44.6586, lng: -63.6611 },
  "B3N": { zone: "Fairview", lat: 44.6486, lng: -63.6393 },
  "B3P": { zone: "Armdale / Purcells Cove", lat: 44.6305, lng: -63.6111 },
  "B3R": { zone: "Spryfield", lat: 44.6067, lng: -63.6063 },
  "B3S": { zone: "Bayers Lake", lat: 44.6436, lng: -63.6749 },
  "B3T": { zone: "Timberlea", lat: 44.6455, lng: -63.7501 },
  "B3V": { zone: "Tantallon", lat: 44.6789, lng: -63.8821 },
  "B3Z": { zone: "Hammonds Plains", lat: 44.7214, lng: -63.8115 },
  
  "B2V": { zone: "Dartmouth", lat: 44.6652, lng: -63.5671 },
  "B2W": { zone: "Forest Hills", lat: 44.6934, lng: -63.4907 },
  "B2X": { zone: "Westphal", lat: 44.6853, lng: -63.5186 },
  "B2Y": { zone: "Downtown Dartmouth", lat: 44.6669, lng: -63.5654 },
  "B3A": { zone: "North Dartmouth", lat: 44.6811, lng: -63.5824 },
  "B3B": { zone: "Burnside", lat: 44.7088, lng: -63.5925 },
  
  "B4A": { zone: "Bedford", lat: 44.7302, lng: -63.6606 },
  "B4B": { zone: "West Bedford", lat: 44.7225, lng: -63.7011 },
  "B4C": { zone: "Lower Sackville", lat: 44.7645, lng: -63.6766 },
  "B4E": { zone: "Middle Sackville", lat: 44.7876, lng: -63.6932 },
  "B4G": { zone: "Upper Sackville", lat: 44.8211, lng: -63.7081 },
  
  "B2N": { zone: "Truro", lat: 45.3657, lng: -63.2869 },
  "B1P": { zone: "Cape Breton", lat: 46.1368, lng: -60.1942 },
  "B4N": { zone: "Annapolis Valley", lat: 45.0778, lng: -64.4963 },
  "B4V": { zone: "South Shore", lat: 44.3783, lng: -64.5165 },
  "B2H": { zone: "New Glasgow", lat: 45.5866, lng: -62.6453 },

  "DEFAULT": { zone: "Nova Scotia", lat: 45.0, lng: -63.0 }
};

export const NS_REGIONS: Record<string, RegionData> = {
  halifax: {
    slug: 'halifax',
    name: 'Halifax Regional Municipality',
    fsaPrefixes: ['B3H', 'B3J', 'B3K', 'B3L', 'B3M', 'B3N', 'B3P', 'B3R', 'B3S'],
    lat: 44.6476,
    lng: -63.5728,
  },
  dartmouth: {
    slug: 'dartmouth',
    name: 'Dartmouth',
    fsaPrefixes: ['B2V', 'B2W', 'B2X', 'B2Y', 'B3A', 'B3B'],
    lat: 44.6652,
    lng: -63.5676,
  },
  sydney: {
    slug: 'sydney',
    name: 'Sydney & Cape Breton',
    fsaPrefixes: ['B1P', 'B1S', 'B1A', 'B1B', 'B1E', 'B1G', 'B1H', 'B1J', 'B1K', 'B1L'],
    lat: 46.1368,
    lng: -60.1942,
  },
  truro: {
    slug: 'truro',
    name: 'Truro',
    fsaPrefixes: ['B2N'],
    lat: 45.3657,
    lng: -63.2869,
  },
  valley: {
    slug: 'valley',
    name: 'Annapolis Valley',
    fsaPrefixes: ['B0P', 'B4N', 'B0P'],
    lat: 45.0728,
    lng: -64.4965,
  },
  rural_central: {
    slug: 'rural-central',
    name: 'Rural Central NS',
    fsaPrefixes: ['B0N', 'B0R', 'B0S', 'B0T'],
    lat: 44.9,
    lng: -63.6,
  },
  rural_south: {
    slug: 'rural-south',
    name: 'South Shore',
    fsaPrefixes: ['B0J', 'B0V', 'B0W', 'B4V'],
    lat: 44.3,
    lng: -64.5,
  },
  rural_north: {
    slug: 'rural-north',
    name: 'Northern NS',
    fsaPrefixes: ['B0E', 'B0H', 'B0K', 'B2H'],
    lat: 45.6,
    lng: -62.6,
  }
};

/**
 * Gets the region slug for a given FSA. Returns 'nova-scotia' if uncategorized.
 */
export function getRegionFromFSA(fsa: string): string {
  if (!fsa) return 'nova-scotia';
  for (const [key, region] of Object.entries(NS_REGIONS)) {
    if (region.fsaPrefixes.includes(fsa)) {
      return key;
    }
  }
  // Try matching just the first 2 characters if explicit 3 char fails (e.g. B3 -> halifax)
  const prefix2 = fsa.substring(0, 2);
  for (const [key, region] of Object.entries(NS_REGIONS)) {
    if (region.fsaPrefixes.some(p => p.startsWith(prefix2))) {
      return key;
    }
  }
  return 'nova-scotia'; // Fallback
}

export function getFSAsForRegion(regionSlug: string): string[] | null {
  if (regionSlug === 'nova-scotia') return null; // Means all
  return NS_REGIONS[regionSlug]?.fsaPrefixes || null;
}
