# Implementation Tasks: Neko Gallery View

## Phase 1: Data & Infrastructure
- [x] 1.1 Create `src/lib/neko.ts` with schemas (NekoSchema, SortField, SortOrder)
- [x] 1.2 Create `src/lib/neko-fetch.ts` with CDN aggregation logic
  - [x] Fetch from 3 URLs in parallel
  - [x] Validate with Zod
  - [x] Merge arrays with dedupe logic
  - [x] Export total count and metadata
- [x] 1.3 Create `src/app/api/neko/route.ts` - Full dataset endpoint
  - [x] Cache-Control: `public, immutable` or `max-age=31536000`
  - [x] Return merged, deduplicated dataset
  - [x] Add ETag support
- [x] 1.4 Create `src/app/api/neko/paginated/route.ts` - Paginated endpoint
  - [x] Query params: `skip`, `take`, `sort`, `order`, `search`
  - [x] Filter logic for: color, eyes, background, generation, cursor, year
  - [x] Return paginated results + total count
  - [x] Cache-Control: `public, max-age=3600` (1hr for filter changes)

## Phase 2: Client-Side Data Management
- [x] 2.1 Install dependencies:
  - [x] `@tanstack/react-query` (if not present)
  - [x] `@tanstack/react-virtual`
  - [x] `nuqs` (if not present)
- [x] 2.2 Create `src/lib/queries.ts` - TanStack Query hooks
  - [x] `useNekoGallery()` - Infinite scroll hook
  - [x] `useNekoPrefetch()` - Server-side prefetch function
  - [x] `useNekoSearch()` - Search + filter query manager
- [x] 2.3 Create server function `src/lib/neko-server.ts`
  - [x] Fetch full dataset on first load (from API cache)
  - [x] Hydrate TanStack Query
  - [x] Return initial page + cursor
- [x] 2.4 Fix NUQS SSR integration
  - [x] Use `createSearchParamsCache` with proper type-safe parsers
  - [x] Move searchParams parsing into async child component inside Suspense
  - [x] Remove manual parsing/validation (NUQS handles it)
  - [x] Use `parseAsStringLiteral` for order field type safety

## Phase 3: UI Components
- [ ] 3.1 Create `src/components/neko/gallery-container.tsx` - Basic list rendering
  - [x] Basic item list rendering
  - [x] Load more button
  - [x] Composite unique keys (id + index)
  - [ ] NEXT: Replace with virtual list wrapper
- [x] 3.2 Create virtual list wrapper using TanStack Virtual
  - [x] Replace simple list with virtualized rendering
  - [x] Infinite scroll trigger at bottom (e.g., 80% scroll)
  - [x] Loading states for fetch-next
  - [x] Smooth scroll performance (target 60fps)
- [x] 3.3 Create `src/components/neko/gallery-filters.tsx`
  - [x] Dropdowns for: Cat Color, Eyes, Background, Generation, Cursor, Year
  - [x] Search input with NUQS integration
  - [x] Clear all button
  - [x] Dynamic option lists from data
  - [x] Sort field and order toggle
  - [x] NUQS adapter integration for client-side URL state
- [ ] 3.4 Create `src/components/neko/trait-badge.tsx`
  - [ ] Display trait with icon (yarn, sausage, milk, tuna, salmon, shrimp, etc.)
  - [ ] Styling & accessibility

## Phase 4: Pages & Layout
- [x] 4.1 Create `src/app/gallery/layout.tsx`
  - [x] QueryClientProvider wrapper
  - [x] Error boundaries (Suspense fallback in place)
- [x] 4.2 Create `src/app/gallery/page.tsx`
  - [x] Server component with prefetch function
  - [x] Client component with Suspense boundary
  - [x] Render gallery-filters + gallery-container
- [ ] 4.3 Create `src/app/gallery/[id]/page.tsx` - Detail view (DEFERRED)
  - [ ] Fetch single Neko by ID
  - [ ] Show all traits, metadata, block info
  - [ ] Link to NFT marketplace (if available)

## Phase 5: Testing & Optimization
- [ ] 5.1 Test API endpoints manually (curl/browser)
- [ ] 5.2 Verify cache headers with DevTools
- [ ] 5.3 Load test with 10k+ items
  - [ ] Check virtual scroll performance (60fps)
  - [ ] Check filter response time (<50ms)
  - [ ] Check initial load time (<100ms)
- [ ] 5.4 Mobile responsiveness check
- [ ] 5.5 Accessibility audit (keyboard nav, screen reader)
- [ ] 5.6 Bundle analysis - verify no bloat

## Phase 6: Polish & Deployment
- [ ] 6.1 Add error boundaries + user-friendly error states
- [ ] 6.2 Add skeleton loaders for initial state
- [ ] 6.3 Add empty state UI
- [ ] 6.4 Document API schemas in README
- [ ] 6.5 Create `.env.example` (if external API keys needed)
- [ ] 6.6 Test
 in production-like env (build + start)