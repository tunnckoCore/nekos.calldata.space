import { useQueryStates } from "nuqs";
import {
  createSearchParamsCache,
  type Options,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export const filters = {
  search: parseAsString.withDefault(""),
  background: parseAsString.withDefault(""),
  cat: parseAsString.withDefault(""),
  eyes: parseAsString.withDefault(""),
  cursor: parseAsString.withDefault(""),
  gen: parseAsString.withDefault(""),
  year: parseAsString.withDefault(""),
  sort: parseAsString.withDefault("internal_index"),
  order: parseAsStringLiteral(["asc", "desc"] as const).withDefault("asc"),
} as const;

/**
 * Gallery filter search params schema using NUQS server-side cache
 * This cache can be used in both server components and API routes
 * NUQS handles all parsing, validation, and normalization
 */
export const gallerySearchParamsCache = createSearchParamsCache(filters);

/**
 * Type-safe filter object inferred from NUQS cache
 * Use Awaited + ReturnType to get the parsed type
 */
export type GalleryFilters = Awaited<
  ReturnType<typeof gallerySearchParamsCache.parse>
>;

export const useFilters = (options: Options = {}) =>
  useQueryStates(filters, { ...options, shallow: false });
