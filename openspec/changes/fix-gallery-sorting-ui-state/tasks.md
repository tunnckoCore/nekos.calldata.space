# Implementation Tasks

## 1. Update Sort Defaults and Options
- [ ] 1.1 Change default sort from `"created_at"` to `"sequence"` in `gallery-search-params.ts`
- [ ] 1.2 Add new sort option `"number"` to sort enum/defaults
- [ ] 1.3 Update sort select component in `gallery-filters.tsx` to reflect new options and labels
- [ ] 1.4 Test that sort dropdown shows: Created At, Block & Index, Fee, Number

## 2. Implement Collection-Aware "Block & Index" Sort
- [ ] 2.1 Review current block_number sorting logic in `neko-fetch.ts` (lines 77-105)
- [ ] 2.2 Replace "index" sort (if exists) or enhance block_number logic to use composite key
- [ ] 2.3 Ensure Ordinals sort by block_number only (no tiebreaker by transaction_index)
- [ ] 2.4 Ensure OG/NFTs and Ethscriptions sort by block_number with transaction_index tiebreaker
- [ ] 2.5 Update sortNekos function to handle "number" sort mode (item.number for Ordinals/Ethscriptions, item.index for OG/NFTs)

## 3. Fix Clear Button Disabled State
- [ ] 3.1 Update `isFiltered` logic in `gallery-filters.tsx` (line 61-70) to use correct default `"sequence"`
- [ ] 3.2 Change comparison from `filters.sort !== "sequence"` (was `"created_at"`)
- [ ] 3.3 Verify button is disabled on initial page load
- [ ] 3.4 Verify button enables when any filter/search/sort/order is modified

## 4. Manual Testing & Validation
- [ ] 4.1 Load gallery without filters → Clear button should be disabled
- [ ] 4.2 Add a filter → Clear button should become enabled
- [ ] 4.3 Click Clear → Clear button should disable again
- [ ] 4.4 Test all four sort options work on each collection
- [ ] 4.5 Infinite scroll through all collections in default (sequence) order
- [ ] 4.6 Test sort toggle (ascending/descending) for each sort option
