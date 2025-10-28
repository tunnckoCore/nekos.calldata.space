import crypto from "crypto";
import { NekoSchema, type Neko } from "./neko";

const ETHS_URL = `https://gistcdn.githack.com/tunnckoCore/03ed31ce9dba74c2ec75e43d29682042/raw/218b012ffb3ce83ddf89c410b9713f39da7d3f55/0xnekos-eths.json`;
const NFTS_URL = `https://gistcdn.githack.com/tunnckoCore/03ed31ce9dba74c2ec75e43d29682042/raw/218b012ffb3ce83ddf89c410b9713f39da7d3f55/0xnekos-nfts.json`;
const ORDS_URL = `https://gistcdn.githack.com/tunnckoCore/03ed31ce9dba74c2ec75e43d29682042/raw/218b012ffb3ce83ddf89c410b9713f39da7d3f55/0xnekos-ords.json`;

interface CacheEntry {
  data: Neko[];
  etag: string;
  timestamp: number;
}

// In-memory cache for the merged dataset
let dataCache: CacheEntry | null = null;
const CACHE_TTL = 1000 * 60 * 60 * 24 * 365; // 1 year

/**
 * Generates an ETag for a dataset
 */
function generateETag(data: Neko[]): string {
  const hash = crypto.createHash("sha256");
  hash.update(JSON.stringify(data));
  return `"${hash.digest("hex").slice(0, 16)}"`;
}

/**
 * Fetches and validates data from a single CDN source
 */
async function fetchAndValidateSource(url: string): Promise<Neko[] | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.statusText}`);
      return null;
    }

    const json = await response.json();
    const items = Array.isArray(json) ? json : [json];

    // Validate each item against schema
    const validated: Neko[] = [];
    for (const item of items) {
      const parsed = NekoSchema.safeParse(item);
      if (parsed.success) {
        let data = parsed.data;

        validated.push(data);
      } else {
        console.warn(`Validation error for item:`, parsed.error);
      }
    }

    return validated;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}

/**
 * Fetches and merges all Neko data from 3 CDN sources
 * Caches result for 1 year with ETag support
 */
export async function fetchAllNekos(): Promise<{
  data: Neko[];
  etag: string;
}> {
  // Check cache validity
  if (dataCache && Date.now() - dataCache.timestamp < CACHE_TTL) {
    return {
      data: dataCache.data,
      etag: dataCache.etag,
    };
  }

  try {
    // Fetch all three sources in parallel
    const [nfts, ords, eths] = await Promise.all([
      fetchAndValidateSource(NFTS_URL),
      fetchAndValidateSource(ORDS_URL),
      fetchAndValidateSource(ETHS_URL),
    ]);

    if (!nfts || !ords || !eths) {
      console.warn("One or more sources failed to fetch valid Neko data");
      // Return cached data if available, even if expired

      return dataCache ?? Promise.reject(new Error("No cached data available"));
    }

    const merged = [...nfts, ...ords, ...eths].map((item) => {
      const isNft = item.traits.gen.toLowerCase().includes("og");
      const isOrdinal = item.traits.gen.toLowerCase().includes("ordinal");

      // patches for HTML of bugged cats
      if ((isOrdinal || isNft) && item.index === 4) {
        item.traits.eyes = "red";
      }
      if ((isOrdinal || isNft) && item.index === 16) {
        item.traits.cat = "gold";
        item.traits.eyes = "red";
      }
      if ((isOrdinal || isNft) && item.index === 97) {
        item.traits.cat = "gold";
        item.traits.eyes = "red";
      }

      return item;
    });

    if (merged.length === 0) {
      console.warn("No valid Neko data found from any source");
      // Return cached data if available, even if expired

      return dataCache ?? Promise.reject(new Error("No cached data available"));
    }

    // Generate ETag and update cache
    const etag = generateETag(merged);
    dataCache = {
      data: merged,
      etag,
      timestamp: Date.now(),
    };

    return {
      data: merged,
      etag,
    };
  } catch (error) {
    console.error("Error in fetchAllNekos:", error);

    // Fallback to cached data if fetch fails
    if (dataCache) {
      return {
        data: dataCache.data,
        etag: dataCache.etag,
      };
    }

    throw error;
  }
}

/**
 * Filters Neko array by traits
 */
export function filterNekosByTraits(
  nekos: Neko[],
  filters: Partial<Record<string, string>>,
): Neko[] {
  return nekos.filter((neko) => {
    for (const [key, value] of Object.entries(filters)) {
      if (!value) continue;

      if (key === "search") {
        const searchLower = value.toLowerCase();
        if (
          !neko.name.toLowerCase().includes(searchLower) &&
          !neko.id.toLowerCase().includes(searchLower) &&
          !neko.creator.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      } else if (key === "year") {
        if (neko.traits.year !== parseInt(value)) {
          return false;
        }
      } else if (key === "gen") {
        if (neko.traits.gen !== value) {
          return false;
        }
      } else if (key === "background") {
        if (neko.traits.background !== value) {
          return false;
        }
      } else if (key === "cat") {
        if (neko.traits.cat !== value) {
          return false;
        }
      } else if (key === "eyes") {
        if (neko.traits.eyes !== value) {
          return false;
        }
      } else if (key === "cursor") {
        if (neko.traits.cursor !== value) {
          return false;
        }
      }
    }
    return true;
  });
}

/**
 * Sorts Neko array by field and order
 * When sorting by block_number, also sorts by transaction_index as secondary (except Ordinals)
 */
export function sortNekos(
  nekos: Neko[],
  field: string = "block_timestamp",
  order: "asc" | "desc" = "asc",
): Neko[] {
  const sorted = [...nekos];
  sorted.sort((a, b) => {
    let aVal: any;
    let bVal: any;

    // Default sort is by block_timestamp
    if (field === "block_timestamp" || field === "index") {
      aVal = a.block_timestamp;
      bVal = b.block_timestamp;
    } else if (field === "block_number") {
      aVal = a.block_number;
      bVal = b.block_number;
    } else if (field === "transaction_fee") {
      aVal = a.transaction_fee;
      bVal = b.transaction_fee;
    } else if (field === "transaction_index") {
      aVal = a.transaction_index ?? 0;
      bVal = b.transaction_index ?? 0;
    } else {
      aVal = a.block_timestamp;
      bVal = b.block_timestamp;
    }

    let comparison = aVal - bVal;

    // If sorting by block_number and values are equal, use transaction_index as tiebreaker
    // (except for Ordinals which don't have meaningful transaction indices)
    if (field === "block_number" && comparison === 0) {
      const aIsOrdinal = a.traits.gen === "Ordinals";
      const bIsOrdinal = b.traits.gen === "Ordinals";

      if (!aIsOrdinal && !bIsOrdinal) {
        comparison = (a.transaction_index ?? 0) - (b.transaction_index ?? 0);
      }
    }

    return order === "asc" ? comparison : -comparison;
  });

  return sorted;
}

/**
 * Gets unique trait values with counts from a Neko array
 */
export function getTraitOptions(
  nekos: Neko[],
  trait: "block" | "year" | "gen" | "background" | "cat" | "eyes" | "cursor",
) {
  const counts = new Map<string | number, number>();

  for (const neko of nekos) {
    const value = neko.traits[trait];
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([value, count]) => ({ value: String(value), count }))
    .sort((a, b) => {
      const aNum = Number(a.value);
      const bNum = Number(b.value);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      return a.value.localeCompare(b.value);
    });
}

/**
 * Gets paginated, filtered, sorted Neko data for API
 */
export async function getPaginatedNekos({
  skip = 0,
  take = 50,
  search,
  background,
  cat,
  eyes,
  cursor,
  gen,
  year,
  sort = "block_timestamp",
  order = "asc",
}: {
  skip?: number;
  take?: number;
  search?: string;
  background?: string;
  cat?: string;
  eyes?: string;
  cursor?: string;
  gen?: string;
  year?: string;
  sort?: string;
  order?: "asc" | "desc";
} = {}): Promise<{
  items: Neko[];
  total: number;
  hasMore: boolean;
}> {
  const { data: allNekos } = await fetchAllNekos();

  if (!allNekos || allNekos.length === 0) {
    return { items: [], total: 0, hasMore: false };
  }

  let filtered = [...allNekos];

  // Apply search filter
  if (search && search.trim()) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter((neko) => {
      return (
        neko.name.toLowerCase().includes(searchLower) ||
        neko.id.toLowerCase().includes(searchLower) ||
        neko.creator.toLowerCase().includes(searchLower)
      );
    });
  }

  // Apply trait filters
  if (background)
    filtered = filtered.filter((n) => n.traits.background === background);
  if (cat) filtered = filtered.filter((n) => n.traits.cat === cat);
  if (eyes) filtered = filtered.filter((n) => n.traits.eyes === eyes);
  if (cursor) filtered = filtered.filter((n) => n.traits.cursor === cursor);
  if (gen) filtered = filtered.filter((n) => n.traits.gen === gen);
  if (year) filtered = filtered.filter((n) => n.traits.year === parseInt(year));

  const total = filtered.length;

  // Apply sorting
  filtered = sortNekos(filtered, sort, order);

  // Apply pagination
  const items = filtered.slice(skip, skip + take);
  const hasMore = skip + take < total;

  return { items, total, hasMore };
}
