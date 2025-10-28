# Implementation Tasks: Neko Gallery View

## Phase 1: Data & Infrastructure
- [ ] 1.1 Create `src/lib/neko.ts` with schemas (NekoSchema, SortField, SortOrder)
- [ ] 1.2 Create `src/lib/neko-fetch.ts` with CDN aggregation logic
  - [ ] Fetch from 3 URLs in parallel
  - [ ] Validate with Zod
  - [ ] Merge arrays with dedupe logic
  - [ ] Export total count and metadata
- [ ] 1.3 Create `src/app/api/neko/route.ts` - Full dataset endpoint
  - [ ] Cache-Control: `public, immutable` or `max-age=31536000`
  - [ ] Return merged, deduplicated dataset
  - [ ] Add ETag support
- [ ] 1.4 Create `src/app/api/neko/paginated/route.ts` - Paginated endpoint
  - [ ] Query params: `skip`, `take`, `sort`, `order`, `search`
  - [ ] Filter logic for: color, eyes, background, generation, cursor, year
  - [ ] Return paginated results + total count
  - [ ] Cache-Control: `public, max-age=3600` (1hr for filter changes)

## Phase 2: Client-Side Data Management
- [ ] 2.1 Install dependencies:
  - [ ] `@tanstack/react-query` (if not present)
  - [ ] `@tanstack/react-virtual`
  - [ ] `nuqs` (if not present)
- [ ] 2.2 Create `src/lib/queries.ts` - TanStack Query hooks
  - [ ] `useNekoGallery()` - Infinite scroll hook
  - [ ] `useNekoPrefetch()` - Server-side prefetch function
  - [ ] `useNekoSearch()` - Search + filter query manager
- [ ] 2.3 Create server function `src/lib/neko-server.ts`
  - [ ] Fetch full dataset on first load (from API cache)
  - [ ] Hydrate TanStack Query
  - [ ] Return initial page + cursor

## Phase 3: UI Components
- [ ] 3.1 Create `src/components/neko/gallery-row.tsx`
  - [ ] Render single row with: name, eye colors (circles), trait badge, background color
  - [ ] Clickable link to detail view
  - [ ] Responsive layout
- [ ] 3.2 Create `src/components/neko/gallery-container.tsx`
  - [ ] Virtual list wrapper using TanStack Virtual
  - [ ] Infinite scroll trigger at bottom
  - [ ] Loading states
- [ ] 3.3 Create `src/components/neko/gallery-filters.tsx`
  - [ ] Dropdowns for: Cat Color, Eyes, Background, Generation, Cursor, Year
  - [ ] Search input with NUQS integration
  - [ ] Clear all button
  - [ ] Dynamic option lists from data
- [ ] 3.4 Create `src/components/neko/trait-badge.tsx`
  - [ ] Display trait with icon (yarn, sausage, milk, tuna, salmon, shrimp, etc.)
  - [ ] Styling & accessibility

## Phase 4: Pages & Layout
- [ ] 4.1 Create `src/app/gallery/layout.tsx`
  - [ ] QueryClientProvider wrapper
  - [ ] Error boundaries
- [ ] 4.2 Create `src/app/gallery/page.tsx`
  - [ ] Server component calling prefetch function
  - [ ] Client component with Suspense boundary
  - [ ] Render gallery-filters + gallery-container
- [ ] 4.3 Create `src/app/gallery/[id]/page.tsx` - Detail view
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
- [ ] 6.6 Test in production-like env (build + start)