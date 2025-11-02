"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { getProperColors } from "@/lib/colors";
import type { GalleryFilters } from "@/lib/gallery-search-params";
import type { Neko } from "@/lib/neko";
import { useNekoGallery } from "@/lib/queries";
import { GalleryItemRow } from "./gallery-item-row";

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
    <div className="flex h-full w-full flex-col">
      {/* Item count header */}
      <div className="shrink-0 bg-background/50 px-4 py-2 text-muted-foreground text-xs">
        Showing {items.length} items from {itemsCount} total
      </div>

      {/* Virtualized scrollable container - key: overflow-y-auto with proper ref */}
      <div
        ref={scrollerRef}
        className="w-full flex-1 overflow-y-auto overflow-x-hidden"
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
                        className="m-0 block h-[70dvh] w-full border-0 p-0 md:h-[80dvh]"
                        sandbox="allow-scripts"
                        src={`${baseURL}/api/content/${item.number}?gen=og`}
                        style={{
                          backgroundColor: colors.background,
                        }}
                      />
                    )}
                    {isOrdinals && (
                      <iframe
                        className="m-0 block h-[70dvh] w-full border-0 p-0 md:h-[80dvh]"
                        sandbox="allow-scripts"
                        src={`${baseURL}/api/content/${item.id}?gen=ordinals`}
                        style={{
                          backgroundColor: colors.background,
                        }}
                      />
                    )}
                    {isEthscription && (
                      <iframe
                        className="m-0 block h-[70dvh] w-full border-0 p-0 md:h-[80dvh]"
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
        <div className="shrink-0 border-border border-t bg-background/50 p-4 text-center text-muted-foreground text-sm">
          {isLoadingMore ? "Loading more items..." : "No more items to load"}
        </div>
      )}
    </div>
  );
}
