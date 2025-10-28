# Proposal: Add Neko Gallery View with Accordion & Infinite Scroll

## Why
Users need a fast, responsive way to browse and filter a collection of 380 Neko NFTs across three unified datasets:
- 100 NFTs (May 2022)
- 88 Ordinals (April 2023)
- 179 Ethscriptions (July 2023)
- 13 Ethscriptions (March 2024)

Current approach lacks search, filtering, and pagination capabilities. An accordion-based gallery with infinite scroll and server-side caching will deliver sub-100ms page loads and smooth browsing experience. Data is unified across all sources but retains blockchain-specific fields (Bitcoin tx hashes/addresses for Ordinals, Ethereum for others).

## What Changes
- **NEW**: Data aggregation API endpoint that merges 3 CDN sources (Ethscriptions, NFTs, Ordinals)
- **NEW**: Paginated API endpoint with aggressive HTTP caching (1 year TTL)
- **NEW**: Server function to hydrate initial dataset with TanStack Query
- **NEW**: Client-side gallery component with:
  - Accordion-based row layout (ShadCN Accordion + infinite scroll)
  - Infinite scroll pagination (load next batch on scroll near bottom)
  - Multi-filter UI (Cat Color, Eyes, Background, Generation, Cursor, Year)
  - Full-text search via NUQS (searchable by name/ID)
  - Basic trait listing inside accordion content
- **NEW**: TanStack Query integration for client-side caching and prefetching
- **NEW**: Trait badge display with icons (yarn 🧶, sausage 🌭, tuna 🐟, salmon 🐠, milk 🥛, shrimp 🦐)
- **DEFERRED**: Item detail page (clickable to full content view - can be added later)

## Impact
- Affected specs: NEW `neko-gallery` capability
- Affected code: 
  - `src/app/api/neko/*` (new API routes)
  - `src/app/gallery/*` (new pages/layouts)
  - `src/components/neko/*` (new feature components: accordion row, filters, trait badge)
  - `src/lib/neko.ts` (schemas, types, utilities)
  - `src/lib/queries.ts` (TanStack Query hooks)
- Data flow: CDN → API → Server Function → TanStack Query → Accordion List → Browser
- Performance: Target <100ms initial load, <50ms filter response, smooth infinite scroll
- Bundle impact: ~+60-100kb (ShadCN Accordion already in project, TanStack Query, NUQS)
- Browser handles 380 items efficiently via infinite pagination + React virtualization

## Breaking Changes
None. This is additive only.

## Questions for Review
1. Should we use TanStack DB for client-side filtering, or keep it server-driven + client-side pagination?
2. Is 1 year cache TTL aggressive enough, or should we use `immutable`?
3. Do we need analytics/tracking for gallery interactions?