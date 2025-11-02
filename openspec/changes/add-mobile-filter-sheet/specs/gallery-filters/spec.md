## ADDED Requirements

### Requirement: Mobile Filter Sheet

The gallery filter bar SHALL provide a responsive mobile interface using a Sheet component that consolidates filters into a drawer accessible via hamburger menu.

#### Scenario: Mobile user opens filter sheet

- **WHEN** user is on a mobile device (viewport < 640px)
- **AND** user taps the hamburger menu icon on the right side of the sticky bar
- **THEN** a Sheet component slides in from the bottom
- **AND** the Sheet contains filters at top, sort/order/clear row in middle, and search at bottom

#### Scenario: Mobile user applies filters from sheet

- **WHEN** user is viewing the filter Sheet on mobile
- **AND** user selects a filter option (e.g., selects a cat trait)
- **THEN** the filter is applied immediately
- **AND** the gallery updates to reflect the filtered results
- **AND** the Sheet remains open for additional filter selections

#### Scenario: Mobile user closes filter sheet

- **WHEN** user has the filter Sheet open on mobile
- **AND** user taps outside the Sheet or swipes it down
- **THEN** the Sheet closes with a smooth animation
- **AND** all applied filters remain active

#### Scenario: Mobile sticky bar shows minimal controls

- **WHEN** user is on a mobile device (viewport < 640px)
- **THEN** the sticky bar displays the "Gens" filter select on the left side
- **AND** the sticky bar displays a hamburger menu icon on the right side
- **AND** all other filter controls are hidden from the sticky bar

### Requirement: Desktop Filter Bar Unchanged

The gallery filter bar SHALL maintain its current horizontal layout on desktop viewports without modification.

#### Scenario: Desktop user sees all filters inline

- **WHEN** user is on a desktop device (viewport >= 640px)
- **THEN** the sticky bar displays all filter controls inline (search, all trait selects, sort, order, clear)
- **AND** no hamburger menu icon is visible
- **AND** no Sheet component is rendered

### Requirement: Responsive Breakpoint Transition

The gallery filter bar SHALL smoothly transition between mobile and desktop layouts based on viewport width.

#### Scenario: User resizes from desktop to mobile

- **WHEN** user resizes browser window from >= 640px to < 640px
- **THEN** the filter bar automatically switches to mobile layout
- **AND** the hamburger menu icon appears on the right side
- **AND** inline filters (except Gens) are hidden
- **AND** all active filter states are preserved

#### Scenario: User resizes from mobile to desktop

- **WHEN** user resizes browser window from < 640px to >= 640px
- **THEN** the filter bar automatically switches to desktop layout
- **AND** all filter controls become visible inline
- **AND** the hamburger menu icon disappears
- **AND** the Sheet component is unmounted if open
- **AND** all active filter states are preserved

### Requirement: Filter Sheet Layout

The mobile filter Sheet SHALL organize controls in a vertical layout with filters first, sort controls in a row, and search at bottom.

#### Scenario: Filter sheet displays organized controls

- **WHEN** user opens the filter Sheet on mobile
- **THEN** trait select filters appear at the top in vertical stack (cat, eyes, background, cursor, year)
- **AND** sort select, order toggle, and clear button appear in one horizontal row below filters
- **AND** search input appears at the bottom of the Sheet
- **AND** each control has adequate touch target size (minimum 44px height)

### Requirement: Filter State Persistence

The gallery filter bar SHALL maintain filter state regardless of layout mode or Sheet open/close state.

#### Scenario: Filters persist when closing sheet

- **WHEN** user applies filters in the mobile Sheet
- **AND** user closes the Sheet
- **AND** user reopens the Sheet
- **THEN** all previously selected filters remain selected
- **AND** the gallery continues to show filtered results

#### Scenario: Filters persist across layout transitions

- **WHEN** user has active filters on mobile
- **AND** viewport transitions to desktop size
- **THEN** all active filters remain applied
- **AND** filter controls show the correct selected states