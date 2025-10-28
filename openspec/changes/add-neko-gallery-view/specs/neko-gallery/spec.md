# Neko Gallery Specification

## ADDED Requirements

### Requirement: Neko Data Aggregation
The system SHALL fetch and merge Neko metadata from three external CDN sources (Ethscriptions, NFTs, Ordinals) into a unified dataset, validated against strict Zod schemas.

#### Scenario: Successful data fetch and merge
- **WHEN** the aggregation service initializes
- **THEN** it fetches all three datasets in parallel
- **AND** validates each against NekoSchema
- **AND** merges results with index-based deduplication
- **AND** caches the result for 1 year (immutable)

#### Scenario: Handle partial failures
- **WHEN** one CDN source is unavailable
- **THEN** the system falls back to cached version or returns partial dataset
- **AND** logs the error without blocking other sources

### Requirement: Neko Data API Endpoint
The system SHALL provide a RESTful API endpoint serving the full, merged Neko dataset with aggressive HTTP caching.

#### Scenario: Fetch full dataset
- **WHEN** client requests `GET /api/neko`
- **THEN** return merged, deduplicated array of all Nekos
- **AND** include Cache-Control header: `public, immutable` (1 year)
- **AND** include ETag for client-side caching validation

#### Scenario: Client validates ETag
- **WHEN** client sends If-None-Match header with ETag
- **THEN** return 304 Not Modified if dataset unchanged
- **AND** preserve browser cache

### Requirement: Neko Paginated Query Endpoint
The system SHALL provide a paginated API endpoint for gallery browse/search with server-side filtering and sorting.

#### Scenario: Paginated browse with defaults
- **WHEN** client requests `GET /api/neko/paginated?skip=0&take=50`
- **THEN** return first 50 items
- **AND** include `total` count and `hasMore` boolean
- **AND** Cache-Control: `public, max-age=3600` (1hr, revalidate for filter changes)

#### Scenario: Filter by traits
- **WHEN** client requests `GET /api/neko/paginated?background=khaki&cat=white&eyes=lightsea green`
- **THEN** return only Nekos matching all specified trait filters
- **AND** apply filters server-side before pagination
- **AND** return updated `total` reflecting filter results

#### Scenario: Search by name
- **WHEN** client requests `GET /api/neko/paginated?search=OxNeko%20OG`
- **THEN** match against name, ID, and creator fields (case-insensitive)
- **AND** return matching results paginated

#### Scenario: Sort results
- **WHEN** client requests `GET /api/neko/paginated?sort=block_number&order=desc`
- **THEN** return results sorted by specified field in given order
- **AND** default sort is `index` ascending

### Requirement: Server-Side Data Hydration
The system SHALL prefetch and hydrate initial gallery data on the server to enable fast First Contentful Paint and TanStack Query dehydration.

#### Scenario: Server prefetch on page load
- **WHEN** user navigates to `/gallery`
- **THEN** server function fetches first page (50 items) from `/api/neko/paginated`
- **AND** hydrates TanStack Query with initial data
- **AND** passes dehydrated state to client component
- **AND** client rehydrates without making duplicate fetch

### Requirement: Client-Side Gallery Rendering
The system SHALL display Neko data in a row-based gallery with virtual scrolling, infinite pagination, and filtering UI.

#### Scenario: Initial gallery render with virtual scroll
- **WHEN** client receives server data
- **THEN** render gallery component with VirtualList (row-based layout)
- **AND** render each row with: name badge, eye color circles, trait badge (with icon), background color highlight
- **AND** make each row clickable to detail view
- **AND** target 60fps smooth scrolling with virtual windowing

#### Scenario: Infinite scroll load more
- **WHEN** user scrolls to bottom 200px of list
- **THEN** trigger `useInfiniteQuery` fetch for next page
- **AND** append results to list without re-rendering virtual window
- **AND** show loading indicator while fetching
- **AND** disable trigger when `hasMore` is false

#### Scenario: Apply filters from UI
- **WHEN** user selects filter dropdown value (e.g., "background: khaki")
- **THEN** update URL search params via NUQS (no full page reload)
- **AND** trigger query refetch with new filters
- **AND** reset pagination to page 0
- **AND** show loading state while fetching
- **AND** animate list transition to new filtered results

#### Scenario: Full-text search
- **WHEN** user types in search input
- **THEN** debounce input (300ms) and update URL search params
- **AND** trigger query refetch with search parameter
- **AND** results update in real-time
- **AND** search persists in URL for bookmarking

### Requirement: Neko Detail View
The system SHALL provide a detail page showing full metadata and traits for a single Neko.

#### Scenario: View Neko details
- **WHEN** user clicks a gallery row or navigates to `/gallery/[id]`
- **THEN** fetch full Neko metadata (from cache or API)
- **AND** display: name, ID, creation block, transaction hash, traits (all fields), current owner, NFT link
- **AND** provide back link to gallery with filter state preserved

#### Scenario: Trait display with icons
- **WHEN** detail page renders
- **THEN** display each trait (background, cat, eyes, cursor, etc.)
- **AND** show relevant icon/emoji (sausage 🌭, yarn 🧶, tuna 🐟, salmon 🐠, milk 🥛, shrimp 🦐)
- **AND** badge styling matches gallery row preview

### Requirement: Filter Dropdown Options
The system SHALL populate filter dropdowns dynamically from available trait values in the dataset.

#### Scenario: Generate filter options
- **WHEN** gallery page loads
- **THEN** aggregate unique values for: background, cat, eyes, cursor, year, generation
- **AND** sort options alphabetically
- **AND** include "All" or null option for no filter
- **AND** show option counts (e.g., "yarn (1,234)")

### Requirement: Performance & Caching Strategy
The system SHALL employ aggressive multi-layer caching to achieve <100ms initial load and <50ms filter response.

#### Scenario: Browser cache validation
- **WHEN** full dataset API is requested multiple times
- **THEN** browser cache hits (304 Not Modified)
- **AND** server is never re-contacted
- **AND** bandwidth usage minimized

#### Scenario: TanStack Query client cache
- **WHEN** user filters/searches and returns to previous state
- **THEN** query result returned from memory cache instantly
- **AND** no network request made
- **AND** UI renders immediately (no skeleton)

#### Scenario: Stale-while-revalidate pattern
- **WHEN** user refines filters and stale query exists
- **THEN** render stale data immediately
- **AND** silently refetch in background
- **AND** update UI when new data arrives (if changed)