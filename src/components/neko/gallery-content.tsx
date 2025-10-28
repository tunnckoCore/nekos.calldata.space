import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  createQueryClient,
  prefetchAllNekos,
  prefetchPaginatedNekos,
} from "@/lib/queries";
import { GalleryContainerClient } from "./gallery-container-client";
import { gallerySearchParamsCache } from "@/lib/gallery-search-params";
import type { SearchParams } from "nuqs/server";

interface GalleryContentProps {
  searchParams: Promise<SearchParams>;
}

export async function GalleryContent({ searchParams }: GalleryContentProps) {
  // NUQS already handles parsing, validation, and normalization
  const filters = await gallerySearchParamsCache.parse(searchParams);

  // Create server-side QueryClient
  const queryClient = createQueryClient();

  try {
    // Prefetch all nekos for filter options
    await prefetchAllNekos(queryClient);

    // Prefetch first page with current filters
    await prefetchPaginatedNekos(queryClient, filters);
  } catch (error) {
    console.error("Error prefetching data:", error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <GalleryContainerClient filters={filters} />
    </HydrationBoundary>
  );
}
