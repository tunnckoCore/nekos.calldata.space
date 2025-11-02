import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { gallerySearchParamsCache } from "@/lib/gallery-search-params";
import { getPaginatedNekos } from "@/lib/neko-fetch";
import { getAllNekos } from "@/lib/preps";
import { createQueryClient } from "@/lib/queries";
import { GalleryContainerClient } from "./gallery-container-client";
import { GalleryFiltersComp } from "./gallery-filters";
import { SkeletonRow } from "./skeleton-row";

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

  // turns out.. it DOES block the whole page.. on fresh reload...
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  const nekoEntry = await getAllNekos(baseURL);
  const paginatedNekosPromise = getPaginatedNekos(baseURL, filters, nekoEntry);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex h-full w-full sm:flex-col flex-col-reverse">
        <GalleryFiltersComp allNekos={nekoEntry.data} filters={filters} />

        <div className="flex-1 overflow-hidden">
          <Suspense
            fallback={
              <div className="flex w-full">
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </div>
            }
          >
            <GalleryContainerClient
              baseURL={baseURL}
              filters={filters}
              paginatedNekosPromise={paginatedNekosPromise}
            />
          </Suspense>
        </div>
      </div>
    </HydrationBoundary>
  );
}
