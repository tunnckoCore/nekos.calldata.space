# Design: Virtualized List with Infinite Scroll

## Context
The gallery currently renders all paginated items in the DOM, which works for 50 items per page but will degrade performance as users scroll through hundreds of items. We need to virtualize the list to maintain 60fps performance and smooth infinite scrolling.

The data source is TanStack Query's infinite query, which manages pagination automatically. We'll layer TanStack Virtual on top to handle DOM virtualization.

## Goals
- Render only visible items in DOM (typically 10-15 rows)
- Maintain 60fps scroll performance
- Automatically fetch next page when user scrolls to ~80% of list
- Preserve scroll position and item focus
- Support dynamic row heights (if traits expand)

Non-Goals:
- Custom scroll indicator/progress bar
- Jump-to-item feature
- Lazy-load images (not applicable - no images in current data)

## Decisions

### Decision 1: Virtual List Container
Use `@tanstack/react-virtual` with `useVirtualizer` hook for dynamic height calculation.

**Why**: 
- Works seamlessly with React Query's infinite queries
- Handles dynamic row heights automatically
- Battle-tested in production apps
- Minimal bundle impact (~8kb gzip)

**Alternatives considered**:
- `react-window`: Requires fixed row heights, more rigid
- `react-virtualized`: Larger bundle, overkill for this use case
- Manual scroll listener: Complex, error-prone, poor performance

### Decision 2: Infinite Scroll Trigger
Trigger next page fetch when user scrolls to 80% of visible list.

**Why**:
- Provides buffer for smooth scrolling
- Prevents user reaching end with no more data loaded
- Standard UX pattern

**Implementation**: Monitor virtualizer's `lastItem` index and fetch when `lastItem / totalItems > 0.8`

### Decision 3: Row Structure
Keep existing row component (`GalleryContainerClient` items) but wrap in virtualizer.

**Why**:
- Minimal refactor of existing code
- Row styling/logic unchanged
- Only virtualization logic added

**Key Props**:
- Item data from `items` array (flattened pages)
- Virtual index for rendering only visible range
- Key as `${item.id}-${item.index}` (already fixed)

### Decision 4: Loading States
Show loading indicator at bottom of list while fetching next page.

**Why**:
- User sees progress
- No jarring content shift
- Prevents accidental double-fetches

**Implementation**: Render placeholder row when `isFetchingNextPage` is true

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Scroll jank on large datasets | Use `react-virtual`'s memoization; measure performance |
| Lost scroll position on filter change | Reset virtualizer when filters change via `key` prop |
| Accessibility: keyboard nav in virtual list | Ensure focus management works; test with Tab/Arrow keys |
| Row height calculation delays | Use fixed height (40px per row) until confirmed dynamic is needed |

## Migration Plan

1. **Install**: Already done (`@tanstack/react-virtual` in package.json)
2. **Refactor**: Replace simple `items.map()` with `useVirtualizer` wrapper
3. **Test**: 
   - Scroll to bottom and verify next page loads
   - Check DevTools for DOM node count (should be ~15, not 380)
   - Verify no scroll jank (use Chrome DevTools Performance tab)
4. **Revert if needed**: Can revert to simple list if performance issues arise

## Open Questions
- Should rows have fixed height (40px) or measure dynamically?
  - **Proposal**: Start with fixed height for simplicity; measure if needed
- Should we show a "Loading..." indicator or skeleton rows while fetching?
  - **Proposal**: Simple "Loading more..." text at bottom is sufficient for now

## Technical Spec

### File: `src/components/neko/gallery-container-client.tsx`

**Changes**:
1. Import `useVirtualizer` from `@tanstack/react-virtual`
2. Wrap items array with `useVirtualizer({count: items.length, size: 40})`
3. Calculate visible range via virtualizer
4. Render only virtualizer's `virtualItems` in the loop
5. Add loading indicator to virtualizer container bottom

**Pseudo-code**:
```tsx
const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => scrollElement,
  estimateSize: () => 40,
})

// Trigger fetch when near end
useEffect(() => {
  const [last] = virtualizer.getVirtualItems().slice(-1)
  if (last?.index >= items.length - 20 && hasNextPage && !isFetchingNextPage) {
    fetchNextPage()
  }
}, [virtualizer.getVirtualItems(), items.length, hasNextPage, isFetchingNextPage, fetchNextPage])

return (
  <div ref={scrollElement} style={{height: 'calc(100vh - 200px)', overflow: 'auto'}}>
    <div style={{height: virtualizer.getTotalSize()}}>
      {virtualizer.getVirtualItems().map(virtualItem => (
        <div key={`${items[virtualItem.index].id}-${items[virtualItem.index].index}`}>
          {/* render item */}
        </div>
      ))}
    </div>
    {isFetchingNextPage && <div>Loading more...</div>}
  </div>
)
```

---

This design balances performance, simplicity, and user experience for a smooth infinite-scroll gallery.