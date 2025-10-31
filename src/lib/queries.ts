import {
  QueryClient,
  useQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import type {
  GalleryFilters,
  GalleryFiltersWithPagination,
} from "./gallery-search-params";
import type { Neko } from "./neko";
import { getPaginatedNekos } from "./neko-fetch";
import { getAllNekos } from "./preps";

const SITE_URL_ORIGIN =
  typeof window !== "undefined"
    ? new URL(window.location.href).origin
    : "http://localhost:3000";

interface PaginatedResponse {
  items: Neko[];
  total: number;
  hasMore: boolean;
  skip: number;
  take: number;
}

/**
 * Create a QueryClient instance
 * Everything cached for 1 year since data never changes
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30, // Data is immutable and never becomes stale
        gcTime: 30, // Keep in cache indefinitely
      },
    },
  });
}

/**
 * Fetch all Nekos (full immutable dataset)
 */
export function useAllNekos() {
  return useQuery({
    queryKey: ["v2", "nekos", "all"],
    queryFn: async () => {
      return (await getAllNekos()).data;
    },
  });
}

/**
 * Fetch paginated, filtered Nekos with infinite scroll support
 * Accepts filters object directly from URL params
 * Uses Suspense for proper SSR hydration
 */
export function useNekoGallery(filters: GalleryFiltersWithPagination) {
  const queryKey = ["v2", "nekos", "paginated", filters];

  return useSuspenseInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      // const params = new URLSearchParams();
      // params.set("skip", String(pageParam));
      // params.set("take", "50");

      // // Only add non-empty filters to query params
      // if (filters.search) params.set("search", filters.search);
      // if (filters.background) params.set("background", filters.background);
      // if (filters.cat) params.set("cat", filters.cat);
      // if (filters.eyes) params.set("eyes", filters.eyes);
      // if (filters.cursor) params.set("cursor", filters.cursor);
      // if (filters.gen) params.set("gen", filters.gen);
      // if (filters.year) params.set("year", filters.year);
      // if (filters.sort) params.set("sort", filters.sort);
      // if (filters.order) params.set("order", filters.order);

      const skip = Math.max(0, pageParam);
      const take = 50;

      const { items, total, hasMore } = await getPaginatedNekos({
        skip,
        take,
        ...filters,
      });

      const result = {
        items,
        total,
        hasMore,
        skip,
        take,
      };

      return result as PaginatedResponse;
      // const response = await fetch(
      //   `${SITE_URL_ORIGIN}/api/neko/paginated?${params}`,
      // );
      // if (!response.ok) throw new Error("Failed to fetch paginated Nekos");

      // const res = (await response.json()) as PaginatedResponse;

      // NekoSchemaList.parse(res.items);

      // return res;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined;
      return lastPage.skip + lastPage.take;
    },
    initialPageParam: 0,
  });
}

/**
 * Fetch a single Neko by ID
 */
export function useNekoById(id: string | undefined) {
  return useQuery({
    queryKey: ["v2", "neko", id],
    queryFn: async () => {
      return (await getAllNekos()).data.find((n) => n.id === id);
    },
    enabled: !!id,
  });
}

/**
 * Prefetch all Nekos on the server (for SSR)
 */
export async function prefetchAllNekos(queryClient: QueryClient) {
  return queryClient.prefetchQuery({
    queryKey: ["v2", "nekos", "all"],
    queryFn: async () => (await getAllNekos()).data,
  });
}

/**
 * Prefetch paginated Nekos on the server (for SSR)
 * Accepts filters object directly
 */
export async function prefetchPaginatedNekos(
  queryClient: QueryClient,
  filters: GalleryFilters,
) {
  const filtersCopy = { ...filters };
  const queryKey = ["v2", "nekos", "paginated", filtersCopy];

  return queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      // const url = new URL(`${SITE_URL_ORIGIN}/api/neko/paginated`);
      // url.searchParams.set("skip", String(pageParam));
      // url.searchParams.set("take", "50");
      // if (filters.search) url.searchParams.set("search", filters.search);
      // if (filters.background) {
      //   url.searchParams.set("background", filters.background);
      // }
      // if (filters.cat) url.searchParams.set("cat", filters.cat);
      // if (filters.eyes) url.searchParams.set("eyes", filters.eyes);
      // if (filters.cursor) url.searchParams.set("cursor", filters.cursor);
      // if (filters.gen) url.searchParams.set("gen", filters.gen);
      // if (filters.year) url.searchParams.set("year", filters.year);
      // if (filters.sort) url.searchParams.set("sort", filters.sort);
      // if (filters.order) url.searchParams.set("order", filters.order);
      // const response = await fetch(url.toString());
      // if (!response.ok) {
      //   throw new Error("Failed to prefetch paginated Nekos");
      // }
      // const res = (await response.json()) as PaginatedResponse;
      // NekoSchemaList.parse(res.items);
      // return res;

      const skip = Math.max(0, pageParam);
      const take = 50;

      const { items, total, hasMore } = await getPaginatedNekos({
        ...filtersCopy,
        skip,
        take,
      });

      const result = {
        items,
        total,
        hasMore,
        skip,
        take,
      };

      return result;
    },
    initialPageParam: 0,
  });
}
