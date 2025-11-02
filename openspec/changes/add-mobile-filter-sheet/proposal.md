## Why

The current gallery filter bar displays all controls (search input, 6 trait selects, sort, order, clear) in a horizontal sticky bar. On mobile devices, this creates a cramped, unusable interface where controls are squeezed and difficult to interact with. Users on mobile need a streamlined, touch-friendly way to access filters without sacrificing functionality.

## What Changes

- Implement a mobile-responsive filter UI using shadcn Sheet component
- On mobile (screens < 640px):
  - Sticky bar contains: "All Generations" filter (left), search input (center), hamburger menu icon (right)
  - Hamburger icon opens a Sheet that slides in from bottom
  - Move trait filters and sort/order/clear controls into the Sheet
- On desktop (screens >= 640px):
  - Maintain current behavior with all filters visible in sticky bar
- Sheet will contain (top to bottom):
  1. All trait select filters (cat, eyes, background, cursor, year) under "Traits" section
  2. Sort select, order toggle, and clear button in ONE horizontal row under "Sort & Actions" section
  3. Close button at the bottom (X button positioned where hamburger was for easy tap)
- Preserve existing filter functionality and state management

## Impact

- **Affected specs**: `gallery-filters` (new capability)
- **Affected code**: 
  - `src/components/neko/gallery-filters.tsx` - Major refactor to add responsive Sheet wrapper
  - Import Sheet components from `src/components/ui/sheet.tsx`
- **User Experience**: Mobile users will have a cleaner, more usable filter interface
- **Breaking Changes**: None - purely UI enhancement maintaining all existing functionality