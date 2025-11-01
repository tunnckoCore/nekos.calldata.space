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

interface GalleryContentProps {
  searchParams: Promise<SearchParams>;
}

export async function GalleryContent({ searchParams }: GalleryContentProps) {
  const baseURL =
    process.env.NODE_ENV === "production"
      ? `https://nekos.calldata.space`
      : `http://localhost:3000`;

  const filters = await gallerySearchParamsCache.parse(searchParams);

  const queryClient = createQueryClient();

  await prefetchPaginatedNekos(baseURL, queryClient, filters);

  prefetchAllNekos(baseURL, queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
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
