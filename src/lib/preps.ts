import { type Neko, NekoListSchema, NekoSchema } from "@/lib/neko";
import { initFuzzySearch } from "./fuzzy-search";

const NFTS_URL = `https://gistcdn.githack.com/tunnckoCore/03ed31ce9dba74c2ec75e43d29682042/raw/218b012ffb3ce83ddf89c410b9713f39da7d3f55/0xnekos-nfts.json`;
const ORDS_URL = `https://gistcdn.githack.com/tunnckoCore/03ed31ce9dba74c2ec75e43d29682042/raw/218b012ffb3ce83ddf89c410b9713f39da7d3f55/0xnekos-ords.json`;
const ETHS_URL = `https://gistcdn.githack.com/tunnckoCore/03ed31ce9dba74c2ec75e43d29682042/raw/218b012ffb3ce83ddf89c410b9713f39da7d3f55/0xnekos-eths.json`;

const SITE_URL_ORIGIN =
  process.env.NODE_ENV === "production"
    ? "https://next16-nekos-oct28.vercel.app"
    : "http://localhost:3000";

interface CacheEntry {
  hash: string;
  data: Neko[];
  etag: string;
  timestamp: number;
}

// In-memory cache for the merged dataset
const dataCache: CacheEntry | null = null;
const CACHE_TTL = 1000 * 60 * 60; // Cache for 1 hour to ensure consistent ordering across paginated requests

/**
 * Generates an ETag for a dataset
 */
async function generateDigest(
  data: Neko[] | string,
  algo = "SHA-256",
): Promise<string> {
  const encoder = new TextEncoder();
  const dataString = typeof data === "string" ? data : JSON.stringify(data);
  const buffer = encoder.encode(dataString);
  const hashBuffer = await crypto.subtle.digest(algo, buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

const CACHED_PROPER_COLORS = new Map();
export async function extractProperColors(item: Neko): Promise<{
  background: string;
  cat: string;
  eyes: string;
}> {
  if (item.traits.gen.toLowerCase().includes("eths")) {
    return {
      background: item.traits.background,
      cat: item.traits.cat,
      eyes: item.traits.eyes,
    };
  }

  const cachedColors = CACHED_PROPER_COLORS.get(item.id);
  if (cachedColors) {
    return cachedColors;
  }

  const isNft = item.traits.gen.toLowerCase().includes("og");
  const isOrdinal = item.traits.gen.toLowerCase().includes("ordinal");

  const txt = isNft
    ? await fetch(`${SITE_URL_ORIGIN}/api/content/${item.number}?gen=og`, {
        cache: "force-cache",
      }).then((x) => x.text())
    : await fetch(`${SITE_URL_ORIGIN}/api/content/${item.id}?gen=ordinals`, {
        cache: "force-cache",
      }).then((x) => x.text());

  const mmtxt = isOrdinal
    ? txt.match(/polygon\.eyes(.+)cursor:/)
    : txt.match(/polygon\.eyes[^(]+cursor:/g);

  const starter = isOrdinal
    ? mmtxt?.[0] || ""
    : (mmtxt?.[0] || "").split(" ").join("").split("\n").join("");

  // console.log({ mmtxt, starter, isOrdinal, isNft });

  let [eyes, cat, _ground, background] = starter
    .split(":")
    .filter((x) => x.at(0) === "#")
    .flatMap((x) => x.split("}")[0])
    .flatMap((x) => x.split(";"))
    .filter((x) => x.at(0) === "#");

  // patches for HTML of bugged cats
  if ((isOrdinal || isNft) && item.index === 4) {
    eyes = "red";
  }
  if ((isOrdinal || isNft) && item.index === 16) {
    cat = "gold";
    eyes = "red";
  }
  if ((isOrdinal || isNft) && item.index === 97) {
    cat = "gold";
    eyes = "red";
  }

  console.log("WHAT?????", item.id, {
    background,
    cat,
    eyes,
  });

  CACHED_PROPER_COLORS.set(item.id, {
    background,
    cat,
    eyes,
  });

  return {
    background,
    cat,
    eyes,
  };
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
        const data = parsed.data;

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

const CACHED_ORDINAL_DATA = new Map();
export async function fetchOrdinalContent(id: string): Promise<{
  hash: string;
  etag: `"${string}"`;
  data: Record<string, any>;
}> {
  const cachedContent = CACHED_ORDINAL_DATA.get(id);
  if (cachedContent) {
    return cachedContent;
  }
  const contentText = await fetch(`https://ordinals.com/content/${id}`, {
    cache: "force-cache",
  }).then((x) => x.text());

  const hash = await generateDigest(contentText);
  const data = JSON.parse(contentText);

  CACHED_ORDINAL_DATA.set(id, {
    hash,
    etag: `"${hash}"`,
    data,
  });

  return {
    hash,
    etag: `"${hash}"`,
    data,
  };
}

const CACHED_NFT_DATA = new Map();
export async function fetchNFTContent(id: string): Promise<{
  hash: string;
  etag: `"${string}"`;
  data: string;
}> {
  const cachedContent = CACHED_NFT_DATA.get(id);
  if (cachedContent) {
    return cachedContent;
  }
  const contentText = await fetch(
    `https://ipfs.io/ipfs/QmTgmhBLdFxq8TabME5f8Zn7GezNX1gjcHtrYwtmRzrDxL/${id}.html`,
    { cache: "force-cache" },
  ).then((x) => x.text());

  const etag = await generateDigest(contentText);
  CACHED_NFT_DATA.set(id, {
    hash: etag,
    etag: `"${etag}"`,
    data: contentText,
  });

  return {
    hash: etag,
    etag: `"${etag}"`,
    data: contentText,
  };
}

/**
 * Fetches and merges all Neko data from 3 CDN sources
 * Uses sequential fetching to guarantee consistent merge order: NFTs → Ordinals → Ethscriptions
 * Caches result for 1 hour with ETag support
 */
// export async function fetchAllNekos(): Promise<CacheEntry> {
//   // Check cache validity
//   if (dataCache && Date.now() - dataCache.timestamp < CACHE_TTL) {
//     return {
//       hash: dataCache.hash,
//       data: dataCache.data,
//       etag: dataCache.etag,
//       timestamp: dataCache.timestamp,
//     };
//   }

//   try {
//     // Fetch all three sources sequentially to guarantee merge order
//     const nfts = await fetchAndValidateSource(NFTS_URL);
//     const ords = await fetchAndValidateSource(ORDS_URL);
//     const eths = await fetchAndValidateSource(ETHS_URL);

//     if (!nfts || !ords || !eths) {
//       console.warn("One or more sources failed to fetch valid Neko data");
//       // Return cached data if available, even if expired

//       return dataCache ?? Promise.reject(new Error("No cached data available"));
//     }

//     const merged = [
//       ...nfts.map((x) => ({ ...x, id: `${x.id}e${x.event_log_index}` })),
//       ...ords.sort((a, b) => a.number - b.number),
//       ...eths.sort((a, b) => a.number - b.number),
//     ].map((item, idx) => {
//       const isNft = item.traits.gen.toLowerCase().includes("og");
//       const isOrdinal = item.traits.gen.toLowerCase().includes("ordinal");

//       // Create a copy before applying patches to avoid mutating cached objects
//       const patchedItem = {
//         ...item,
//         traits: { ...item.traits },
//         sequence: idx + 1,
//       };

//       // patches for HTML of bugged cats
//       if ((isOrdinal || isNft) && patchedItem.index === 4) {
//         patchedItem.traits.eyes = "red";
//       }
//       if ((isOrdinal || isNft) && patchedItem.index === 16) {
//         patchedItem.traits.cat = "gold";
//         patchedItem.traits.eyes = "red";
//       }
//       if ((isOrdinal || isNft) && patchedItem.index === 97) {
//         patchedItem.traits.cat = "gold";
//         patchedItem.traits.eyes = "red";
//       }

//       return patchedItem;
//     });

//     const patchedAndMerged = await Promise.all(
//       merged.map(async (x) => ({ ...x, colors: await extractProperColors(x) })),
//     );

//     if (patchedAndMerged.length === 0) {
//       console.warn("No valid Neko data found from any source");
//       // Return cached data if available, even if expired

//       return dataCache ?? Promise.reject(new Error("No cached data available"));
//     }

//     // Generate ETag and update cache
//     const hash = await generateDigest(patchedAndMerged);
//     const now = Date.now();
//     dataCache = {
//       hash,
//       data: patchedAndMerged,
//       etag: `"${hash}"`,
//       timestamp: now,
//     };

//     // Initialize fuzzy search index for faster searching
//     // initFuzzySearch(patchedAndMerged);

//     return {
//       hash,
//       data: patchedAndMerged,
//       etag: `"${hash}"`,
//       timestamp: now,
//     };
//   } catch (error) {
//     console.error("Error in fetchAllNekos:", error);

//     // Fallback to cached data if fetch fails
//     if (dataCache) {
//       return {
//         hash: dataCache.hash,
//         data: dataCache.data,
//         etag: dataCache.etag,
//         timestamp: dataCache.timestamp,
//       };
//     }

//     throw error;
//   }
// }

export async function getAllNekos(): Promise<CacheEntry> {
  if (dataCache) {
    return dataCache;
  }

  const res = await fetch(`${SITE_URL_ORIGIN}/0xnekos.json`);
  if (!res.ok) {
    throw new Error(`Failed to fetch nekos: ${res.status} ${res.statusText}`);
  }

  const result = (await res.json()) as CacheEntry;

  if (!result || result.data?.length === 0) {
    throw new Error("No valid Neko data found");
  }

  result.data = NekoListSchema.parse(result.data);

  initFuzzySearch(result.data);
  return result;
}
