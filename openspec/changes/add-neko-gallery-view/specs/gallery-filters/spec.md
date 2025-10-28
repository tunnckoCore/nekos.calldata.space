## ADDED Requirements

### Requirement: Multi-Filter UI Component
The system SHALL provide a gallery filters component that allows users to filter the Neko gallery by multiple trait dimensions simultaneously.

#### Scenario: User applies single filter
- **WHEN** user selects "white" from Cat Color dropdown
- **THEN** URL updates to `?cat=white`
- **AND** gallery items are filtered to show only white cats
- **AND** filter state persists on page reload

#### Scenario: User applies multiple filters
- **WHEN** user selects "white" for cat AND "green" for eyes
- **THEN** URL updates to `?cat=white&eyes=green`
- **AND** gallery shows only items matching BOTH filters
- **AND** filter UI shows both selections as active

#### Scenario: User clears all filters
- **WHEN** user clicks "Clear All" button
- **THEN** URL is reset to `/gallery` (no query params)
- **AND** all dropdown selections are cleared
- **AND** gallery shows all items

### Requirement: Search Input with NUQS Binding
The system SHALL provide a full-text search input that allows users to search by item name or ID using NUQS URL state management.

#### Scenario: User types search query
- **WHEN** user types "neko #42" in search input
- **THEN** URL updates to `?search=neko%20%2342` (debounced)
- **AND** gallery filters to items matching name or ID containing "neko #42"
- **AND** search state persists on page reload

#### Scenario: User combines search with filters
- **WHEN** user has `?search=neko&cat=white`
- **THEN** gallery shows items where name/ID contains "neko" AND cat is "white"
- **AND** filter UI shows both search and cat selection as active

### Requirement: Dynamic Filter Options
The system SHALL populate filter dropdowns with available trait values and their counts from the current dataset.

#### Scenario: Cat color options are populated
- **WHEN** page loads or filters change
- **THEN** "Cat Color" dropdown shows: white (45), cream (38), gold (22), etc.
- **AND** counts reflect items in current filtered result set

#### Scenario: Disabled options for unavailable traits
- **WHEN** user filters by generation "OG"
- **THEN** only trait values available in OG generation are selectable
- **AND** other trait values appear disabled/grayed out

### Requirement: Sort and Order Controls
The system SHALL provide sort field and sort order controls to allow users to reorder results.

#### Scenario: User changes sort field
- **WHEN** user selects "created_at" from sort dropdown
- **THEN** URL updates to `?sort=created_at`
- **AND** gallery re-sorts items by creation timestamp (block_timestamp)
- **AND** sort state persists on page reload
- **AND** default sort (when not specified) is "internal_index" which preserves the stable merge order (NFTs → Ordinals → Ethscriptions)

#### Scenario: User reverses sort order
- **WHEN** user toggles order button to "desc"
- **THEN** URL updates to `?order=desc`
- **AND** gallery reverses the current sort order
- **AND** order state persists on page reload

### Requirement: Filter UI Accessibility
The system SHALL ensure all filter controls are keyboard navigable and screen reader accessible.

#### Scenario: Keyboard navigation through filters
- **WHEN** user presses Tab to focus first filter dropdown
- **THEN** dropdown receives focus indicator
- **AND** pressing Enter/Space opens dropdown menu
- **AND** Arrow keys navigate between options
- **AND** pressing Enter selects focused option

#### Scenario: Screen reader announces filter state
- **WHEN** screen reader user interacts with filter UI
- **THEN** component labels, current selections, and option counts are announced
- **AND** filter changes are announced as live region updates