import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";
import { gallerySearchParamsCache } from "@/lib/gallery-search-params";
import {
  createQueryClient,
  prefetchAllNekos,
  prefetchPaginatedNekos,
} from "@/lib/queries";
import { GalleryContainerClient } from "./gallery-container-client";
import { GalleryFilters } from "./gallery-filters";
import { headers } from "next/headers";

interface GalleryContentProps {
  searchParams: Promise<SearchParams>;
}

export async function GalleryContent({ searchParams }: GalleryContentProps) {
  const headersList = await headers();
  const host =
    headersList.get("host") ||
    headersList.get("x-forwarded-host") ||
    "localhost:3000";

  const proto = headersList.get("x-forwarded-proto") || "https";
  const baseURL = `${proto}://${host}`;

  const filters = await gallerySearchParamsCache.parse(searchParams);

  const queryClient = createQueryClient();

  console.log("GalleryContent props:", { host });

  try {
    // Prefetch all nekos for filter options
    await prefetchAllNekos(baseURL, queryClient);

    // Prefetch first page with current filters
    await prefetchPaginatedNekos(baseURL, queryClient, filters);
  } catch (error) {
    console.error("Error prefetching data:", error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="flex flex-col h-full w-full">
        {/* Sticky filter bar at top */}
        <GalleryFilters baseURL={baseURL} />

        {/* Full-height virtualizable gallery container */}
        <div className="flex-1 overflow-hidden">
          <GalleryContainerClient baseURL={baseURL} filters={filters} />
        </div>
      </div>
    </HydrationBoundary>
  );
}
