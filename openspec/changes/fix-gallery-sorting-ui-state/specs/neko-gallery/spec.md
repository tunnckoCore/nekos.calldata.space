## MODIFIED Requirements

### Requirement: Sort Options
The system SHALL support four distinct sorting modes, each with collection-aware implementation and proper default.

#### Scenario: Default sort is by sequence
- **WHEN** gallery loads without explicit sort parameter
- **THEN** sort mode defaults to `"sequence"`
- **AND** items appear in order: OG/NFTs → Ordinals → Ethscriptions

#### Scenario: Sort by created at uses block_timestamp with sequence tiebreaker
- **WHEN** user selects "Created At" sort
- **THEN** items sort by `block_timestamp` (primary) with `item.sequence` as tiebreaker
- **AND** label in UI is "Created At"
- **AND** multiple items with same timestamp remain in stable sequence order

#### Scenario: Sort by block & index with collection awareness
- **WHEN** user selects "Block & Index" sort
- **THEN** OG/NFTs items sort by composite key (block_number, transaction_index)
- **AND** Ordinals items sort by block_number only (no transaction_index)
- **AND** Ethscriptions items sort by composite key (block_number, transaction_index)
- **AND** UI label is uniform: "Block & Index"

#### Scenario: Sort by transaction fee
- **WHEN** user selects "Fee" sort
- **THEN** items sort numerically by `transaction_fee` field

#### Scenario: Sort by number
- **WHEN** user selects "Number" sort
- **THEN** OG/NFTs items sort by `item.index`
- **AND** Ordinals items sort by `item.number` (global sequence counter)
- **AND** Ethscriptions items sort by `item.number` (global sequence counter)

---

## MODIFIED Requirements

### Requirement: Clear Filters Button State
The system SHALL disable the "Clear Filters" button when no filters are applied AND no search query exists, with correct state synchronization.

#### Scenario: Button disabled on initial load
- **WHEN** gallery loads with no filters, no search query, and default sort
- **THEN** "Clear Filters" button is visually disabled (opacity, pointer-events: none)
- **AND** button cannot be clicked

#### Scenario: Button enabled when any filter is applied
- **WHEN** user applies any trait filter OR enters search query OR changes sort from default OR changes order
- **THEN** "Clear Filters" button is immediately enabled and clickable

#### Scenario: Button disables after clearing all state
- **WHEN** user clicks "Clear Filters" and all filters/search/sort/order are cleared
- **THEN** button immediately transitions to disabled state
- **AND** sort resets to default `"sequence"` and order to `"asc"`
