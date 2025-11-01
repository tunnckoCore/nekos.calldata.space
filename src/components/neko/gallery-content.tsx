import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";
import { gallerySearchParamsCache } from "@/lib/gallery-search-params";
import { getPaginatedNekos } from "@/lib/neko-fetch";
import { getAllNekos } from "@/lib/preps";
import { createQueryClient } from "@/lib/queries";
import { GalleryContainerClient } from "./gallery-container-client";
import { GalleryFiltersComp } from "./gallery-filters";

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

  const nekoEntry = await getAllNekos(baseURL);
  const paginatedNekosPromise = getPaginatedNekos(baseURL, filters, nekoEntry);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col h-full w-full">
        {/* Sticky filter bar at top */}
        <GalleryFiltersComp allNekos={nekoEntry.data} filters={filters} />

        {/* Full-height virtualizable gallery container */}
        <div className="flex-1 overflow-hidden">
          <GalleryContainerClient
            baseURL={baseURL}
            filters={filters}
            paginatedNekosPromise={paginatedNekosPromise}
          />
        </div>
      </div>
    </HydrationBoundary>
  );
}
