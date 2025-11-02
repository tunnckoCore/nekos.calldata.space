## 1. Setup and Component Structure

- [x] 1.1 Import Sheet components from `@/components/ui/sheet` (Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger)
- [x] 1.2 Import Menu icon from `lucide-react` for hamburger menu
- [x] 1.3 Add state management for Sheet open/close (useState for `isSheetOpen`)

## 2. Mobile Layout - Sticky Bar

- [x] 2.1 Create mobile-only sticky bar with Gens filter on left and hamburger on right
- [x] 2.2 Add `flex sm:hidden` classes to mobile sticky bar container
- [x] 2.3 Add `hidden sm:flex` classes to hide desktop filters on mobile
- [x] 2.4 Position hamburger menu button on the right side with `ml-auto` or `justify-end`
- [x] 2.5 Style hamburger menu button with proper touch target size (min-h-11)

## 3. Filter Sheet Implementation

- [x] 3.1 Create Sheet component wrapper with controlled open state
- [x] 3.2 Connect SheetTrigger to hamburger menu button
- [x] 3.3 Configure SheetContent to slide from bottom (`side="bottom"`)
- [x] 3.4 Add SheetHeader with appropriate title ("Filter Nekos" or similar)
- [x] 3.5 Set Sheet max-height to allow scrolling if needed (e.g., `max-h-[85vh]`)

## 4. Filter Sheet Content Layout (Correct Order)

- [x] 4.1 Add trait select filters at TOP in vertical stack (cat, eyes, background, cursor, year)
- [x] 4.2 Add sort select + order toggle in one row
- [x] 4.3 Add clear all button in separate actions row with full width
- [x] 4.4 Add search input at BOTTOM of Sheet
- [x] 4.5 Apply proper vertical spacing between sections (gap-6)
- [x] 4.6 Add section labels (Traits, Sort, Actions, Search)
- [x] 4.7 Ensure all controls match height (h-9) for consistency

## 5. Desktop Layout Preservation

- [x] 5.1 Keep existing desktop layout wrapped in `hidden sm:flex` container
- [x] 5.2 Verify all desktop filter controls remain visible at sm breakpoint (>= 640px)
- [x] 5.3 Ensure Sheet component is not rendered on desktop (`sm:hidden` wrapper)
- [x] 5.4 Test that no hamburger menu appears on desktop

## 6. State Management and Functionality

- [x] 6.1 Ensure filter state updates work from both mobile Sheet and desktop bar
- [x] 6.2 Verify filters remain applied when Sheet is closed
- [ ] 6.3 Test filter persistence when switching between mobile and desktop viewports
- [ ] 6.4 Confirm loading states (isPending, Spinner) work in both layouts
- [x] 6.5 Ensure keyboard shortcuts (Cmd+K) work in mobile Sheet search input

## 7. Styling and UX Polish

- [x] 7.1 Add smooth Sheet slide animations (default from shadcn should work)
- [x] 7.2 Style Sheet content with proper padding (p-6)
- [x] 7.3 Ensure Sheet overlay is semi-transparent and dismisses on click
- [ ] 7.4 Test swipe-down gesture to close Sheet on mobile devices
- [x] 7.5 Ensure Gens filter displays "All Generations" label
- [x] 7.6 Align hamburger icon properly on the right side
- [x] 7.7 Add section headings with proper styling (uppercase, tracking-wide)
- [x] 7.8 Ensure action buttons have labels (not just icons)

## 8. Testing and Validation

- [ ] 8.1 Test on mobile viewport (< 640px) - verify Sheet opens and closes
- [ ] 8.2 Test on desktop viewport (>= 640px) - verify inline filters work
- [ ] 8.3 Test viewport resize transitions in both directions
- [ ] 8.4 Verify all filter combinations work correctly in Sheet
- [ ] 8.5 Test with pending/loading states
- [ ] 8.6 Verify clear all button works in Sheet horizontal row
- [ ] 8.7 Test keyboard navigation and accessibility in Sheet
- [ ] 8.8 Verify filter counts update correctly in trait selects within Sheet
- [ ] 8.9 Confirm search input at bottom works with autofocus and keyboard shortcuts

## 9. Accessibility

- [x] 9.1 Ensure Sheet has proper ARIA labels
- [ ] 9.2 Verify focus management when Sheet opens/closes
- [ ] 9.3 Test keyboard-only navigation through Sheet controls
- [x] 9.4 Ensure hamburger menu button has accessible label ("Open filters" or similar)
- [ ] 9.5 Verify screen reader announces Sheet state changes

## 10. Edge Cases

- [ ] 10.1 Test rapid open/close of Sheet
- [ ] 10.2 Verify behavior when filters are changed while Sheet is animating
- [ ] 10.3 Test with very long trait option lists in Sheet
- [ ] 10.4 Ensure Sheet content scrolls properly on very small viewports
- [ ] 10.5 Test with disabled state (isPending) in Sheet controls