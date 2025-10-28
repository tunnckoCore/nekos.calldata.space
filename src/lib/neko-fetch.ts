import { NekoSchema, type Neko } from "./neko";

const ETHS_URL =
  "https://gistcdn.githack.com/xaxa/f5a4b8a3c5f8e9d2a1b6c5d4e3f2a1b6/raw/0xnekos-eths.json";
const NFTS_URL =
  "https://gistcdn.githack.com/xaxa/f5a4b8a3c5f8e9d2a1b6c5d4e3f2a1b6/raw/0xnekos-nfts.json";
const ORDS_URL =
  "https://gistcdn.githack.com/xaxa/f5a4b8a3c5f8e9d2a1b6c5d4e3f2a1b6/raw/0xnekos-ords.json";

let cachedData: Neko[] | null = null;
let cachedETag: string | null = null;

/**
 * Fetch and validate data from a single source
 */
async function fetchAndValidateSource(url: string): Promise<Neko[]> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent": "Neko-Gallery/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} from ${url}`);
    }

    const data = await response.json();
    const items = Array.isArray(data) ? data : data.items || [];

    // Validate each item against schema
    const validated: Neko[] = [];
    for (const item of items) {
      try {
        const parsed = NekoSchema.parse(item);
        validated.push(parsed);
      } catch (error) {
        console.warn(`Invalid item in ${url}:`, item, error);
        // Continue with other items
      }
    }

    return validated;
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    return [];
  }
}

/**
 * Merge and deduplicate Neko data from all 3 sources
 */
export async function fetchAndMergeNekoData(): Promise<{
  data: Neko[];
  etag: string;
}> {
  try {
    // Fetch all 3 sources in parallel
    const [ethsData, nftsData, ordsData] = await Promise.all([
      fetchAndValidateSource(ETHS_URL),
      fetchAndValidateSource(NFTS_URL),
      fetchAndValidateSource(ORDS_URL),
    ]);

    // Merge arrays
    const merged = [...ethsData, ...nftsData, ...ordsData];

    // Deduplicate by index (prefer earliest source)
    const seen = new Set<number>();
    const deduplicated = merged.filter((item) => {
      if (seen.has(item.index)) {
        return false;
      }
      seen.add(item.index);
      return true;
    });

    // Sort by index ascending
    deduplicated.sort((a, b) => a.index - b.index);

    // Generate ETag from data hash
    const dataString = JSON.stringify(deduplicated);
    const etag = generateETag(dataString);

    return {
      data: deduplicated,
      etag,
    };
  } catch (error) {
    console.error("Fatal error in fetchAndMergeNekoData:", error);
    throw error;
  }
}

/**
 * Get cached data with optional revalidation
 */
export async function getNekoData(
  clientETag?: string
): Promise<{
  data: Neko[] | null;
  etag: string;
  notModified: boolean;
}> {
  // If we have cached data and client ETag matches, return 304
  if (cachedData && clientETag && clientETag === cachedETag) {
    return {
      data: null,
      etag: cachedETag,
      notModified: true,
    };
  }

  // Otherwise fetch fresh data
  const { data, etag } = await fetchAndMergeNekoData();

  // Cache it
  cachedData = data;
  cachedETag = etag;

  return {
    data,
    etag,
    notModified: false,
  };
}

/**
 * Get paginated, filtered, and sorted Neko data
 */
export async function getPaginatedNekoData({
  skip = 0,
  take = 50,
  search,
  filters,
  sort = "index",
  order = "asc",
}: {
  skip?: number;
  take?: number;
  search?: string;
  filters?: Record<string, string>;
  sort?: string;
  order?: "asc" | "desc";
}): Promise<{
  items: Neko[];
  total: number;
  hasMore: boolean;
}> {
  // Get all data
  const { data } = await fetchAndMergeNekoData();

  if (!data) {
    return { items: [], total: 0, hasMore: false };
  }

  let filtered = [...data];

  // Apply search filter
  if (search && search.trim()) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.id.toLowerCase().includes(searchLower) ||
        item.creator.toLowerCase().includes(searchLower)
      );
    });
  }

  // Apply trait filters
  if (filters && Object.keys(filters).length > 0) {
    filtered = filtered.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const traitValue = item.traits[key as keyof typeof item.traits];
        return traitValue === value;
      });
    });
  }

  const total = filtered.length;

  // Apply sorting
  filtered.sort((a, b) => {
    let aVal: number | string = a[sort as keyof Neko] || 0;
    let bVal: number | string = b[sort as keyof Neko] || 0;

    if (typeof aVal === "object" || typeof bVal === "object") {
      aVal = 0;
      bVal = 0;
    }

    if (typeof aVal === "string") {
      aVal = aVal.localeCompare(bVal as string);
      bVal = 0;
    }

    const comparison = (aVal as number) - (bVal as number);
    return order === "asc" ? comparison : -comparison;
  });

  // Apply pagination
  const items = filtered.slice(skip, skip + take);
  const hasMore = skip + take < total;

  return { items, total, hasMore };
}

/**
 * Generate a simple ETag hash
 */
function generateETag(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `"${Math.abs(hash).toString(16)}"`;
}
