import {
  QueryClient,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import type { Neko } from "./neko";

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
    queryKey: ["nekos", "all"],
    queryFn: async () => {
      const response = await fetch("/api/neko");
      if (!response.ok) throw new Error("Failed to fetch all Nekos");
      return (await response.json()) as Neko[];
    },
  });
}

/**
 * Fetch paginated, filtered Nekos with infinite scroll support
 * Accepts filters object directly from URL params
 * Uses Suspense for proper SSR hydration
 */
export function useNekoGallery(filters: {
  search?: string;
  background?: string;
  cat?: string;
  eyes?: string;
  cursor?: string;
  gen?: string;
  year?: string;
  sort?: string;
  order?: "asc" | "desc";
}) {
  const queryKey = ["nekos", "paginated", filters];

  return useSuspenseInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams();
      params.set("skip", String(pageParam));
      params.set("take", "50");

      // Only add non-empty filters to query params
      if (filters.search) params.set("search", filters.search);
      if (filters.background) params.set("background", filters.background);
      if (filters.cat) params.set("cat", filters.cat);
      if (filters.eyes) params.set("eyes", filters.eyes);
      if (filters.cursor) params.set("cursor", filters.cursor);
      if (filters.gen) params.set("gen", filters.gen);
      if (filters.year) params.set("year", filters.year);
      if (filters.sort) params.set("sort", filters.sort);
      if (filters.order) params.set("order", filters.order);

      const response = await fetch(`/api/neko/paginated?${params}`);
      if (!response.ok) throw new Error("Failed to fetch paginated Nekos");
      return (await response.json()) as PaginatedResponse;
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
    queryKey: ["neko", id],
    queryFn: async () => {
      const allNekos = await fetch("/api/neko").then((r) => r.json());
      return (allNekos as Neko[]).find((n) => n.id === id);
    },
    enabled: !!id,
  });
}

/**
 * Prefetch all Nekos on the server (for SSR)
 */
export async function prefetchAllNekos(queryClient: QueryClient) {
  return queryClient.prefetchQuery({
    queryKey: ["nekos", "all"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/api/neko");
      if (!response.ok) throw new Error("Failed to prefetch Nekos");
      return (await response.json()) as Neko[];
    },
  });
}

/**
 * Prefetch paginated Nekos on the server (for SSR)
 * Accepts filters object directly
 */
export async function prefetchPaginatedNekos(
  queryClient: QueryClient,
  filters: {
    search?: string;
    background?: string;
    cat?: string;
    eyes?: string;
    cursor?: string;
    gen?: string;
    year?: string;
    sort?: string;
    order?: "asc" | "desc";
  } = {},
) {
  const queryKey = ["nekos", "paginated", filters];

  return queryClient.prefetchInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const url = new URL("http://localhost:3000/api/neko/paginated");
      url.searchParams.set("skip", String(pageParam));
      url.searchParams.set("take", "50");

      if (filters.search) url.searchParams.set("search", filters.search);
      if (filters.background)
        url.searchParams.set("background", filters.background);
      if (filters.cat) url.searchParams.set("cat", filters.cat);
      if (filters.eyes) url.searchParams.set("eyes", filters.eyes);
      if (filters.cursor) url.searchParams.set("cursor", filters.cursor);
      if (filters.gen) url.searchParams.set("gen", filters.gen);
      if (filters.year) url.searchParams.set("year", filters.year);
      url.searchParams.set("sort", filters.sort || "block_timestamp");
      url.searchParams.set("order", filters.order || "asc");

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Failed to prefetch paginated Nekos");
      return (await response.json()) as PaginatedResponse;
    },
    initialPageParam: 0,
  });
}
