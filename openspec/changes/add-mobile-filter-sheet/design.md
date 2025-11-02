## Context

The current `GalleryFiltersComp` displays all filter controls (search input, 6 trait selects, sort, order, clear) in a single horizontal sticky bar. This works well on desktop but creates an unusable experience on mobile devices where controls are cramped and difficult to tap accurately.

The solution introduces a responsive pattern using shadcn's Sheet component to provide a mobile-optimized drawer interface while preserving the full-featured desktop experience.

## Goals / Non-Goals

### Goals
- Provide touch-friendly filter interface on mobile devices (< 640px viewport)
- Maintain all existing filter functionality without regression
- Keep Gens filter accessible on mobile sticky bar (frequently used filter)
- Place hamburger menu on the right side of mobile sticky bar
- Organize Sheet content logically: filters first, controls row, search last
- Preserve filter state across layout changes and Sheet interactions

### Non-Goals
- Changing desktop layout or behavior (remains unchanged)
- Modifying filter logic or state management internals
- Adding new filter options or capabilities
- Performance optimizations (current filter performance is acceptable)

## Decisions

### Decision: Use shadcn Sheet component (bottom slide)
**Rationale**: 
- Already available in `src/components/ui/sheet.tsx`
- Provides mobile-native bottom drawer UX pattern
- Includes built-in overlay, animations, and accessibility
- Side="bottom" is most natural for mobile filter interactions

### Decision: Hamburger menu on RIGHT side of sticky bar
**Rationale**:
- Follows common mobile UI patterns (menus typically on right)
- Gens filter on left provides visual balance
- Right-side placement is more thumb-friendly for right-handed users
- Clear separation between filter (left) and menu action (right)

### Decision: Sheet layout order - Filters, Controls Row, Search
**Rationale**:
- **Filters at top**: Primary action users want when opening Sheet
- **Sort/Order/Clear in one row**: Related controls grouped together, saves vertical space
- **Search at bottom**: Search is often used after browsing/filtering, not before
- This top-to-bottom flow matches typical user journey: filter → sort → search for specific item

### Decision: Keep Gens filter in mobile sticky bar
**Rationale**:
- Gens is a primary categorization filter (OG vs Ordinals)
- Users likely want quick access without opening Sheet
- Single select doesn't require much horizontal space
- Provides visual indication that filters exist

### Decision: Use Tailwind responsive classes (sm: breakpoint at 640px)
**Rationale**:
- Consistent with existing codebase patterns
- Tailwind `sm:` breakpoint (640px) is standard mobile/desktop boundary
- Enables declarative show/hide logic with `hidden sm:flex` and `flex sm:hidden`

### Decision: Duplicate filter controls for mobile/desktop
**Rationale**:
- Simpler component structure (no complex conditional logic)
- Avoids re-mounting controls during viewport transitions
- Better performance (CSS show/hide vs conditional rendering)
- Clearer separation of concerns between mobile and desktop UX

## Component Structure

```
GalleryFiltersComp
├── Sticky Bar Container
│   ├── Mobile Layout (flex sm:hidden)
│   │   ├── Gens Filter Select (left side)
│   │   ├── Hamburger Menu Button (right side, ml-auto) → SheetTrigger
│   │   └── Sheet Component
│   │       └── SheetContent (side="bottom")
│   │           ├── SheetHeader ("Filter Nekos")
│   │           ├── [TOP] Trait Selects (vertical stack)
│   │           │   ├── Cat
│   │           │   ├── Eyes
│   │           │   ├── Background
│   │           │   ├── Cursor
│   │           │   └── Year
│   │           ├── [MIDDLE] Horizontal Row (flex gap-2)
│   │           │   ├── Sort Select
│   │           │   ├── Order Toggle
│   │           │   └── Clear Button
│   │           └── [BOTTOM] Search Input
│   └── Desktop Layout (hidden sm:flex)
│       ├── Search Input
│       ├── InputGroup: Trait Selects (horizontal)
│       └── InputGroup: Sort/Order/Clear (horizontal)
```

## Implementation Strategy

1. **Refactor existing layout into desktop-only section**
   - Wrap current JSX in `<div className="hidden sm:flex">...</div>`
   - Ensures desktop experience unchanged

2. **Add mobile-only section with Sheet**
   - Create `<div className="flex sm:hidden justify-between items-center">...</div>`
   - Left: Gens filter
   - Right: Hamburger button with `ml-auto`

3. **Build Sheet content in correct order**
   - Section 1: Trait filters (vertical, gap-4)
   - Section 2: Horizontal controls row (flex-row, gap-2)
   - Section 3: Search input (full width)

4. **Extract filter rendering logic**
   - Reuse `renderTraitSelect` in both layouts
   - Reduces code duplication

## Risks / Trade-offs

### Risk: Duplicate JSX increases bundle size
**Impact**: Low  
**Mitigation**: Minimal JSX duplication (~100 lines). Gzip compression handles repetitive markup efficiently.

### Risk: Filter state sync issues between layouts
**Impact**: High if occurs  
**Mitigation**: Both layouts consume same `filters` prop and call same `handleSetFilters`. No separate state.

### Risk: Search at bottom may confuse users expecting it first
**Impact**: Low  
**Mitigation**: Most users filter/sort before searching. Can add helper text if needed.

## Migration Plan

This is a non-breaking UI enhancement. No migration required.

**Deployment**: Standard deployment, safe to rollback if issues arise.

## Open Questions

- **Q**: Should Sheet auto-close when a filter is applied?  
  **A**: No. Users often apply multiple filters in sequence.

- **Q**: Should search field have autofocus when Sheet opens?  
  **A**: No. Filters are at top for a reason. Users can tap search if needed.

- **Q**: Should hamburger have a badge showing active filter count?  
  **A**: Nice-to-have for future iteration. Not in initial scope.