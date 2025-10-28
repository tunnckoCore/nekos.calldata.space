import { type Neko } from "./neko";
import { fuzzySearch } from "./fuzzy-search";
import { getAllNekos } from "./preps";

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
        if (neko.traits.year !== Number.parseInt(value, 10)) {
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
 * internal_index: stable merge order (NFTs → Ordinals → Ethscriptions)
 * created_at: block_timestamp (blockchain creation time)
 */
export function sortNekos(
  nekos: Neko[],
  field: string = "sequence",
  order: "asc" | "desc" = "asc",
): Neko[] {
  const sorted = [...nekos];
  sorted.sort((a, b) => {
    let aVal: any;
    let bVal: any;

    // Sort by requested field
    if (field === "sequence") {
      aVal = a.sequence ?? 0;
      bVal = b.sequence ?? 0;
    } else if (field === "created_at" || field === "block_timestamp") {
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
    } else if (field === "index") {
      aVal = a.index;
      bVal = b.index;
    } else {
      aVal = a.sequence ?? 0;
      bVal = b.sequence ?? 0;
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
    .sort((a, b) => b.count - a.count);
}

/**
 * Gets dynamic trait options filtered by current filters
 * Used to show counts only for items matching other active filters (faceted search)
 */
export function getDynamicTraitOptions(
  nekos: Neko[],
  trait: "block" | "year" | "gen" | "background" | "cat" | "eyes" | "cursor",
  filters: {
    search?: string;
    background?: string;
    cat?: string;
    eyes?: string;
    cursor?: string;
    gen?: string;
    year?: string;
  } = {},
): { value: string; count: number }[] {
  // First apply all current filters EXCEPT the trait we're getting options for
  const filtersCopy = { ...filters };

  // Remove the current trait from filters to get options for that trait
  delete filtersCopy[trait as keyof typeof filtersCopy];

  // Apply remaining filters
  let filtered = nekos;
  for (const [key, value] of Object.entries(filtersCopy)) {
    if (!value) continue;

    if (key === "search") {
      const searchLower = value.toLowerCase();
      filtered = filtered.filter(
        (neko) =>
          neko.name.toLowerCase().includes(searchLower) ||
          neko.id.toLowerCase().includes(searchLower) ||
          neko.creator.toLowerCase().includes(searchLower),
      );
    } else if (key === "year") {
      filtered = filtered.filter(
        (n) => n.traits.year === Number.parseInt(value, 10),
      );
    } else if (key === "gen") {
      filtered = filtered.filter((n) => n.traits.gen === value);
    } else if (key === "background") {
      filtered = filtered.filter((n) => n.traits.background === value);
    } else if (key === "cat") {
      filtered = filtered.filter((n) => n.traits.cat === value);
    } else if (key === "eyes") {
      filtered = filtered.filter((n) => n.traits.eyes === value);
    } else if (key === "cursor") {
      filtered = filtered.filter((n) => n.traits.cursor === value);
    }
  }

  // Now get trait options from filtered dataset
  return getTraitOptions(filtered, trait);
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
  sort,
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
  const { data: allNekos } = await getAllNekos();

  if (!allNekos || allNekos.length === 0) {
    return { items: [], total: 0, hasMore: false };
  }

  let filtered = [...allNekos];

  // Apply search filter using fuzzy search
  if (search && search.trim()) {
    const searchResults = fuzzySearch(search);
    filtered = filtered.filter((neko) =>
      searchResults.some((result) => result.id === neko.id),
    );
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

  // Apply sorting: default to sequence (stable merge order)
  // This ensures consistent ordering across all pages, even with filters
  const sortField = sort || "sequence";
  const sortOrder = order;
  filtered = sortNekos(filtered, sortField, sortOrder);

  // Apply pagination
  const items = filtered.slice(skip, skip + take);
  const hasMore = skip + take < total;

  return { items, total, hasMore };
}
