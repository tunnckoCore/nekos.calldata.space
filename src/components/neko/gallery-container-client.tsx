"use client";

import { useNekoGallery, useAllNekos } from "@/lib/queries";
import { useMemo, useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { GalleryFilters } from "@/lib/gallery-search-params";
import { GalleryItemRow } from "./gallery-item-row";

interface GalleryContainerClientProps {
  filters: GalleryFilters;
}

export function GalleryContainerClient({
  filters,
}: GalleryContainerClientProps) {
  const scrollKey = `gallery-scroll-${JSON.stringify(filters)}`;
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // Fetch paginated gallery data with infinite scroll
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error } =
    useNekoGallery(filters);

  // Fetch all nekos for filter options
  const { data: allNekos } = useAllNekos();

  // Flatten paginated results into single array
  const items = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

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
    overscan: 3,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // biome-ignore lint/correctness/useExhaustiveDependencies: it's ok!
  useEffect(() => {
    const lastItem = virtualItems.at(-1);
    if (
      !hasNextPage ||
      isFetchingNextPage ||
      !lastItem ||
      lastItem.index < items.length - 1
    ) {
      return;
    }

    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, virtualItems]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error loading gallery: {error.message}
      </div>
    );
  }

  const virtualTotalSize = virtualizer.getTotalSize();

  // Handle row expansion - close previous and open new
  const handleToggleExpand = (itemId: string) => {
    setExpandedItemId((prevId) => {
      const newId = prevId === itemId ? null : itemId;
      // Remeasure virtualizer when expanded state changes
      virtualizer.measure();
      return newId;
    });
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Item count header */}
      <div className="px-4 py-2 border-b border-border bg-background/50 text-xs text-muted-foreground flex-shrink-0">
        Showing {items.length} items{" "}
        {allNekos && `from ${allNekos.length} total`}
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

              const itemId = `neko-${item.id}`;
              const isItemExpanded = expandedItemId === itemId;

              return (
                <div
                  data-index={virtualItem.index}
                  key={virtualItem.key}
                  ref={virtualizer.measureElement}
                  className="border-b border-border/50 last:border-b-0"
                >
                  <GalleryItemRow
                    item={item}
                    isExpanded={isItemExpanded}
                    onToggleExpand={() => handleToggleExpand(itemId)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading and end states */}
      {(isFetchingNextPage || (!hasNextPage && items.length > 0)) && (
        <div className="px-4 py-2 border-t border-border bg-background/50 text-xs text-muted-foreground text-center flex-shrink-0">
          {isFetchingNextPage
            ? "Loading more items..."
            : "No more items to load"}
        </div>
      )}
    </div>
  );
}
