# Proposal: Fix Gallery Sorting Options and Clear Button UI State

## Why
Three issues require fixes to sorting and UI state:

1. **Sorting Label Mismatch**: The "Index" sort doesn't account for Ordinals lacking `transaction_index`. OG/NFTs and Ethscriptions should sort by "Block & Index" composite key, while Ordinals sort by block_number alone.
2. **Missing Sort Options**: Need to add "Number" sort for `item.number` (Ordinals/Ethscriptions global sequence counter; OG/NFTs use `item.index`). This complements the existing sort modes.
3. **Clear Button Bug**: The button check uses wrong default sort value (`"sequence"` vs actual default `"created_at"`), causing it to appear active on page load when all filters are empty.

## What Changes
- **MODIFIED**: Sort options in `gallery-search-params.ts`: change default from `"created_at"` to `"sequence"`, update sort labels
- **MODIFIED**: Sorting logic in `neko-fetch.ts`: replace "index" sort with "block & index" (composite key for OG/Ethscriptions, block_number only for Ordinals)
- **ADDED**: New "number" sort option backed by `item.number` for Ordinals/Ethscriptions, `item.index` for OG/NFTs
- **FIXED**: Clear button disabled state check in `gallery-filters.tsx` to match actual default sort

## Impact
- Affected specs: `neko-gallery` capability
- Affected code:
  - `src/lib/gallery-search-params.ts` (default sort, sort enum)
  - `src/lib/neko-fetch.ts` (sortNekos function for "block & index", "number", defaults)
  - `src/components/neko/gallery-filters.tsx` (sort select options, disabled state logic)
- No API changes, UI-only fixes
- User-facing: Clearer sort labels, disabled clear button on initial load, new sort option

## Questions for Review
1. For "block & index" tiebreaker logic, should we special-case Ordinals (block_number only) or is current logic sufficient?
2. Should "number" sort be visible in UI by default, or should it be added later based on feedback?
