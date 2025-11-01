import {
  defaultShouldDehydrateQuery,
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
import { getAllNekos, type NekoCacheEntry } from "./preps";

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
        staleTime: 1000 * 60 * 60 * 24, // 24hrs
        gcTime: 1000 * 60 * 60 * 24, // 24hrs
      },
      dehydrate: {
        // Include pending queries in SSR payload
        shouldDehydrateQuery: (query) => {
          return (
            defaultShouldDehydrateQuery(query) ||
            query.state.status === "pending"
          );
        },
      },
    },
  });
}

/**
 * Fetch all Nekos (full immutable dataset)
 */
export function useAllNekos(baseURL: string) {
  return useQuery({
    queryKey: ["v2", "nekos", "all"],
    queryFn: async () => {
      return (await getAllNekos(baseURL)).data;
    },
  });
}

/**
 * Fetch paginated, filtered Nekos with infinite scroll support
 * Accepts filters object directly from URL params
 * Uses Suspense for proper SSR hydration
 */
export function useNekoGallery(
  baseURL: string,
  filters: GalleryFiltersWithPagination,
  initialData?: any,
) {
  const queryKey = ["v2", "nekos", "paginated", filters];

  return useSuspenseInfiniteQuery({
    initialData,
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const skip = Math.max(0, pageParam);
      const take = 25;

      const { items, total, hasMore } = await getPaginatedNekos(baseURL, {
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
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) {
        return undefined;
      }
      const skip = lastPage.skip ?? 0;
      const take = lastPage.take ?? 25;
      return skip + take;
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
      return (
        await getAllNekos(new URL(window.location.href).origin)
      ).data.find((n) => n.id === id);
    },
    enabled: !!id,
  });
}

/**
 * Prefetch all Nekos on the server (for SSR)
 */
export async function prefetchAllNekos(
  baseURL: string,
  queryClient: QueryClient,
) {
  return queryClient.prefetchQuery({
    queryKey: ["v2", "nekos", "all"],
    queryFn: async () => (await getAllNekos(baseURL)).data,
  });
}

/**
 * Prefetch paginated Nekos on the server (for SSR)
 * Accepts filters object directly
 */
export async function prefetchPaginatedNekos(
  baseURL: string,
  queryClient: QueryClient,
  filters: GalleryFilters,
  nekoEntry?: NekoCacheEntry,
) {
  const filtersCopy = { ...filters };
  const queryKey = ["v2", "nekos", "paginated", filtersCopy];

  return queryClient.prefetchInfiniteQuery({
    initialData: {
      pages: [nekoEntry?.data ?? []],
      pageParams: [0],
    },
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const skip = Math.max(0, pageParam);
      const take = 25;

      const { items, total, hasMore } = await getPaginatedNekos(
        baseURL,
        {
          ...filtersCopy,
          skip,
          take,
        },
        nekoEntry,
      );

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
