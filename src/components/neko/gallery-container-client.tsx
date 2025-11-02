"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { use, useEffect, useMemo, useRef, useState } from "react";
import type { GalleryFilters } from "@/lib/gallery-search-params";
import type { Neko } from "@/lib/neko";
import { useNekoGallery } from "@/lib/queries";
import { GalleryItemRow } from "./gallery-item-row";
import { getProperColors } from "@/lib/colors";

interface GalleryContainerClientProps {
  baseURL: string;
  filters: GalleryFilters;
  paginatedNekosPromise: Promise<{
    items: Neko[];
    total: number;
    hasMore: boolean;
  }>;
}

export function GalleryContainerClient({
  baseURL,
  filters,
  paginatedNekosPromise,
}: GalleryContainerClientProps) {
  const firstPagedNekos = use(paginatedNekosPromise);
  const scrollKey = `gallery-scroll-${JSON.stringify(filters)}`;
  const [openItemIds, setOpenItemIds] = useState<Set<string>>(new Set());
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch paginated gallery data with infinite scroll
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNekoGallery(baseURL, filters, {
      pages: [firstPagedNekos],
      pageParams: [0],
    });

  useEffect(() => {
    if (isFetchingNextPage) {
      setIsLoadingMore(true);
    } else if (!isFetchingNextPage && isLoadingMore) {
      // Delay clearing to show the message briefly
      const timer = setTimeout(() => setIsLoadingMore(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isFetchingNextPage, isLoadingMore]);

  // Flatten paginated results into single array
  const items = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);
  const selectedItems = useMemo(() => {
    return data?.pages.flatMap((page) => page.total) ?? [];
  }, [data]);
  const itemsCount = selectedItems[0] ?? 0;

  // Create ref for scrollable container
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Restore scroll position on mount
  useEffect(() => {
    const savedPosition = sessionStorage.getItem(scrollKey);
    if (scrollerRef.current && savedPosition) {
      scrollerRef.current.scrollTop = Number(savedPosition);
    }
  }, [scrollKey]);

  // Save scroll position on scroll
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleScroll = () => {
      sessionStorage.setItem(scrollKey, String(scroller.scrollTop));
    };

    scroller.addEventListener("scroll", handleScroll);
    return () => scroller.removeEventListener("scroll", handleScroll);
  }, [scrollKey]);

  // Use element-based virtualizer (not window-based)
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollerRef.current,
    estimateSize: () => 72,
    // overscan: 10,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const virtualTotalSize = virtualizer.getTotalSize();

  // biome-ignore lint/correctness/useExhaustiveDependencies: it's ok!
  useEffect(() => {
    const lastItem = virtualItems.at(-1);
    if (
      !hasNextPage ||
      isFetchingNextPage ||
      !lastItem ||
      lastItem.index < items.length - 5
    ) {
      return;
    }

    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, virtualItems]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Item count header */}
      <div className="px-4 py-2 bg-background/50 text-xs text-muted-foreground shrink-0">
        Showing {items.length} items from {itemsCount} total
      </div>

      {/* Virtualized scrollable container - key: overflow-y-auto with proper ref */}
      <div
        ref={scrollerRef}
        className="flex-1 w-full overflow-y-auto overflow-x-hidden"
      >
        <div
          style={{
            height: `${virtualTotalSize}px`,
          }}
        >
          <div
            style={{
              transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
            }}
          >
            {virtualItems.map((virtualItem) => {
              const item = items[virtualItem.index];
              if (!item) return null;

              const isEthscription = item.traits.gen
                .toLowerCase()
                .includes("eths");
              const isOrdinals = item.traits.gen.toLowerCase().includes("ord");
              const isNfts = item.traits.gen.toLowerCase().includes("og");
              const colors = getProperColors(item);

              if (item.index === 1) {
                console.log({ item });
              }

              return (
                <div
                  data-index={virtualItem.index}
                  key={virtualItem.key}
                  ref={virtualizer.measureElement}
                >
                  <GalleryItemRow
                    item={item}
                    isOpen={openItemIds.has(item.id)}
                    onToggle={() => {
                      const newSet = new Set(openItemIds);
                      if (newSet.has(item.id)) {
                        newSet.delete(item.id);
                      } else {
                        newSet.add(item.id);
                      }
                      setOpenItemIds(newSet);
                    }}
                  >
                    {isNfts && (
                      <iframe
                        className="m-0 block h-[80dvh] w-full border-0 p-0"
                        sandbox="allow-scripts"
                        src={`${baseURL}/api/content/${item.number}?gen=og`}
                        style={{
                          backgroundColor: colors.background,
                        }}
                      />
                    )}
                    {isOrdinals && (
                      <iframe
                        className="m-0 block h-[80dvh] w-full border-0 p-0"
                        sandbox="allow-scripts"
                        src={`${baseURL}/api/content/${item.id}?gen=ordinals`}
                        style={{
                          backgroundColor: colors.background,
                        }}
                      />
                    )}
                    {isEthscription && (
                      <iframe
                        className="m-0 block h-[80dvh] w-full border-0 p-0"
                        sandbox="allow-scripts"
                        src={`https://mainnet.api.calldata.space/ethscriptions/${item.id}/data`}
                        style={{
                          backgroundColor: colors.background,
                        }}
                      />
                    )}
                  </GalleryItemRow>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading and end states */}
      {(isLoadingMore || (!hasNextPage && items.length > 0)) && (
        <div className="p-4 border-t border-border bg-background/50 text-sm text-muted-foreground text-center flex-shrink-0">
          {isLoadingMore ? "Loading more items..." : "No more items to load"}
        </div>
      )}
    </div>
  );
}
