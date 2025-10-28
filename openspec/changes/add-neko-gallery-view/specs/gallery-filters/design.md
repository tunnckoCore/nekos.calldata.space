# Design: Gallery Filters Component

## Context
The gallery needs a client-side filter UI that allows users to filter and search across 381 Neko items. Filters must be synchronized with URL query parameters via NUQS for shareable links and persistent state.

Data sources:
- All 381 items available via `useAllNekos()` hook
- Trait options derived from dataset: cat colors, eyes, backgrounds, generations, cursors, years
- Current filters passed as `GalleryFilters` type from NUQS

## Goals
- Provide intuitive multi-filter UI (dropdowns for each trait)
- Bind all filter state to URL via NUQS hooks
- Show dynamic option counts based on current dataset
- Support combined filters (AND logic across dimensions)
- Keyboard accessible (Tab, Enter, Arrow keys)
- Faceted search refinement (counts that update per filter)

Non-Goals:
- Advanced query syntax
- Filter history/presets

## Decisions

### Decision 1: Component Structure
Use client component with:
- Search input (controlled by NUQS `useQueryState`)
- Filter dropdowns (one per trait dimension)
- Sort field selector
- Sort order toggle
- "Clear All" button

**Why**:
- Client-side rendering allows real-time NUQS binding
- Each filter is a separate control for clarity
- Mirrors typical e-commerce filter UX

**Alternative considered**:
- Single advanced search box: Less discoverable, requires syntax knowledge

### Decision 2: NUQS Binding Strategy
Use `useQueryStates()` hook to bind all filter controls to URL at once.

**Why**:
- Single hook call for all filters
- Batch URL updates (no multiple pushState calls)
- Type-safe via NUQS parser schema
- Shared with server-side parsing via `gallerySearchParamsCache`

**Code pattern**:
```tsx
const [{ search, cat, eyes, background, cursor, gen, year, sort, order }, setFilters] = useQueryStates({
  search: parseAsString.withDefault(""),
  cat: parseAsString.withDefault(""),
  eyes: parseAsString.withDefault(""),
  // ... etc
  order: parseAsStringLiteral(["asc", "desc"]).withDefault("asc"),
})
```

### Decision 3: Option Population
Compute unique trait values and counts from `useAllNekos()` data on the fly.

**Why**:
- No separate API call needed
- Options always in sync with loaded data
- Counts are accurate for full dataset

**Helper function**: `getTraitOptions(nekos, trait)` already exists in `neko-fetch.ts`

### Decision 4: Sort Controls
Provide explicit "Sort By" dropdown + "Order" toggle (Asc/Desc).

**Why**:
- Clear two-step mental model
- Matches common UI patterns
- Sort field and order can be toggled independently

**Fields available**: `block_timestamp` (default), `block_number`, `transaction_fee`, `transaction_index`

### Decision 5: Styling
Use ShadCN UI components for consistency:
- `Select` for dropdowns (Cat, Eyes, Background, etc.)
- `Input` for search
- `Button` for Clear All / order toggle
- Tailwind for layout

**Why**:
- Already in project
- Accessible by default
- Minimal code

## Architecture

```
GalleryFilters (client component)
├── Search Input (NUQS: search param)
├── Filter Section
│   ├── Cat Color Dropdown (NUQS: cat param)
│   ├── Eyes Dropdown (NUQS: eyes param)
│   ├── Background Dropdown (NUQS: background param)
│   ├── Generation Dropdown (NUQS: gen param)
│   ├── Cursor Dropdown (NUQS: cursor param)
│   └── Year Dropdown (NUQS: year param)
├── Sort Section
│   ├── Sort By Dropdown (NUQS: sort param)
│   └── Order Toggle Button (NUQS: order param)
└── Clear All Button (resets all NUQS state)

Flow:
1. User selects filter → onChange handler → setFilters() → URL updates
2. URL change → browser history state → NUQS re-parses → component re-renders
3. Gallery container receives new filters → re-fetches data
```

## Implementation Details

### File: `src/components/neko/gallery-filters.tsx`

**Props**:
- None (reads from NUQS directly via hooks)

**Hook Usage**:
```tsx
// Import from existing schema
import { gallerySearchParamsCache, coordinatesParsers } from '@/lib/gallery-search-params'

// In component:
const [filters, setFilters] = useQueryStates(coordinatesParsers)
```

**Layout**:
- 2 columns on desktop (Filters | Sort)
- 1 column on mobile (stack vertically)
- Sticky header (optional, for scrollable gallery)

**Dropdowns**:
- Each has placeholder "All [Trait]"
- Shows option value + count: "white (45)"
- Empty option clears that filter
- Dynamic from `getTraitOptions(allNekos, trait)`

**Search**:
- Debounced input (300ms)
- Placeholder: "Search by name or ID"
- Clears on Clear All button

**Clear All Button**:
- Calls `setFilters({search: "", cat: "", eyes: "", ...})` to reset all
- Only visible if any filter is active
- Button style: secondary/ghost

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| NUQS URL gets too long with many filters | Accept it; typical UX for filter URL state |
| Dropdown change causes page jump | Smooth scroll to gallery or highlight changed items |
| Accessibility: label association | Use ShadCN Select which handles labels |
| Performance: re-computing options on every render | Memoize `getTraitOptions()` call with useMemo |

## Migration Plan

1. **Create component** with hardcoded options first (skeleton)
2. **Add NUQS hooks** binding each filter to URL
3. **Integrate `useAllNekos()`** to populate options dynamically
4. **Test**:
   - Apply filter, verify URL updates
   - Reload page, verify filter state persists
   - Combine multiple filters, verify AND logic
   - Keyboard nav with Tab/Enter
   - Screen reader announces selections
5. **Polish**: Add loading state, error state, mobile responsiveness

## Technical Notes

- Import `getTraitOptions` from `src/lib/neko-fetch.ts`
- Import NUQS parsers from `src/lib/gallery-search-params.ts`
- Component is "use client" (client-side only)
- Consider memoizing component with React.memo if re-renders become frequent
- Use `shallow: false` on NUQS hooks to sync with gallery filtering

## Open Questions
- Should year filter show ranges (2022-2024) or individual years?
  - **Proposal**: Individual years for now; can add ranges later
- Should we debounce search input or filter on keystroke?
  - **Proposal**: Debounce 300ms to avoid excessive API calls
- Should disabled options be shown as disabled or hidden?
  - **Proposal**: Hidden for cleaner UX (only show applicable options)
