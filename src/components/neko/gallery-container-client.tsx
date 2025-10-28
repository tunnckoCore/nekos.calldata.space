"use client";

import { useNekoGallery, useAllNekos } from "@/lib/queries";
import { useCallback, useMemo } from "react";
import type { GalleryFilters } from "@/lib/gallery-search-params";

interface GalleryContainerClientProps {
  filters: GalleryFilters;
}

export function GalleryContainerClient({
  filters,
}: GalleryContainerClientProps) {
  // Fetch paginated gallery data with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useNekoGallery(filters);

  // Fetch all nekos for filter options
  const { data: allNekos } = useAllNekos();

  // Flatten paginated results into single array
  const items = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 text-red-500">
        Error loading gallery: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        Loading gallery...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters will go here in Phase 3 */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          Filters UI coming in Phase 3
        </p>
      </div>

      {/* Gallery items */}
      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            No items found
          </div>
        ) : (
          <>
            <div className="text-sm text-muted-foreground">
              Showing {items.length} items
              {allNekos && ` of ${allNekos.length} total`}
            </div>

            {/* Items list placeholder */}
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.index}`}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ID: {item.id}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className="inline-block h-4 w-4 rounded-full"
                        style={{ backgroundColor: item.traits.background }}
                        title={item.traits.background}
                      />
                      <span
                        className="inline-block h-4 w-4 rounded-full"
                        style={{ backgroundColor: item.traits.cat }}
                        title={item.traits.cat}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load more button */}
            {hasNextPage && (
              <button
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className="mt-6 w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isFetchingNextPage ? "Loading more..." : "Load More"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
