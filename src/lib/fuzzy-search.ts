import Fuse from "fuse.js";
import type { Neko } from "./neko";

/**
 * Fuzzy search index for Nekos
 * Created once and reused for all searches
 */
let fuseInstance: Fuse<Neko> | null = null;

/**
 * Initialize fuzzy search index
 * Called once with full Neko dataset
 */
export function initFuzzySearch(nekos: Neko[]): Fuse<Neko> {
  fuseInstance = new Fuse(nekos, {
    keys: [
      { name: "name", weight: 0.5 },
      { name: "id", weight: 0.3 },
      { name: "creator", weight: 0.25 },
      { name: "initial_owner", weight: 0.15 },
      { name: "block_hash", weight: 0.1 },
    ],
    threshold: 0.1, // Allow ~90% match for fuzzy matching, helps with typos
    includeScore: true,
    minMatchCharLength: 1,
  });

  return fuseInstance;
}

/**
 * Perform fuzzy search on Neko dataset
 * Returns array of matched Nekos in score order (best match first)
 */
export function fuzzySearch(query: string): Neko[] {
  if (!fuseInstance) {
    throw new Error(
      "Fuzzy search not initialized. Call initFuzzySearch first.",
    );
  }

  if (!query || !query.trim()) {
    return [];
  }

  return fuseInstance.search(query).map((result) => result.item);
}

/**
 * Get current Fuse instance
 */
export function getFuzzySearchInstance(): Fuse<Neko> | null {
  return fuseInstance;
}
