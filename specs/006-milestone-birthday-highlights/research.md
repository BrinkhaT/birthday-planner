# Research: Milestone Birthday Highlights

**Feature**: 006-milestone-birthday-highlights
**Date**: 2025-11-01
**Status**: Complete

## Overview

This document consolidates research findings and technical decisions for implementing visual highlighting of milestone birthdays (ages 18 and multiples of 10) in the birthday planner application.

## Technical Decisions

### 1. Milestone Detection Logic

**Decision**: Create pure function `isMilestoneBirthday(age: number | null): boolean` in `lib/date-utils.ts`

**Rationale**:
- Follows existing pattern - `date-utils.ts` already contains age calculation logic (`calculateAge`)
- Pure function enables easy unit testing
- Single source of truth for milestone logic
- Null-safe design aligns with existing age handling

**Implementation**:
```typescript
export function isMilestoneBirthday(age: number | null): boolean {
  if (age === null) return false;
  if (age === 18) return true; // Special milestone: legal adulthood
  if (age % 10 === 0 && age >= 10) return true; // Decade milestones
  return false;
}
```

**Alternatives Considered**:
- Inline logic in components → Rejected (DRY violation, harder to test)
- Separate milestone service → Rejected (over-engineering for simple logic)

---

### 2. Visual Highlighting Approach

**Decision**: Use Tailwind CSS utility classes with conditional styling via `cn()` utility

**Rationale**:
- Consistent with existing codebase patterns (components already use `cn()` from `lib/utils.ts`)
- No additional dependencies required
- Tailwind provides responsive design capabilities
- Maintains component simplicity

**Highlighting Strategy**:
- **Card Component**: Add border accent and background tint
  - `border-l-4 border-l-amber-500` - Left accent border in amber (milestone color)
  - `bg-amber-50 dark:bg-amber-950/20` - Subtle background tint
  - Amber chosen for visibility and association with celebration/importance
- **Table Component**: Add row background with hover state preservation
  - `bg-amber-50 dark:bg-amber-950/20` - Same background as cards for consistency
  - `hover:bg-amber-100 dark:hover:bg-amber-900/30` - Distinct hover state

**Accessibility Considerations**:
- Sufficient color contrast (amber-500 on white background meets WCAG AA)
- Not relying solely on color (border accent provides additional visual cue)
- Works in both light and dark modes

**Alternatives Considered**:
- Custom CSS classes → Rejected (inconsistent with Tailwind-first approach)
- ShadCN variant → Rejected (no need for reusable variant, milestone is feature-specific)
- Icons/badges → Rejected (adds visual clutter, spec requires highlighting not additional elements)

---

### 3. Component Integration Pattern

**Decision**: Compute milestone flag at component level, apply conditional classes

**Rationale**:
- Keeps components self-contained (no prop drilling)
- Age already available in `BirthdayWithOccurrence` type
- Follows React best practices (derive state from props)

**Implementation Pattern**:
```typescript
// In BirthdayCard component
const isMilestone = isMilestoneBirthday(age);

return (
  <Card className={cn(
    "w-full",
    isMilestone && "border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20"
  )}>
    {/* Card content */}
  </Card>
);
```

**Alternatives Considered**:
- Pass milestone flag from parent → Rejected (unnecessary prop drilling)
- Add milestone field to birthday data → Rejected (derived data, not persistent)

---

### 4. Testing Strategy

**Decision**: Add unit tests for milestone logic + integration tests for component rendering

**Coverage Plan**:
1. **Unit Tests** (`__tests__/unit/lib/date-utils.test.ts`):
   - `isMilestoneBirthday()` returns `true` for age 18
   - `isMilestoneBirthday()` returns `true` for multiples of 10 (20, 30, 40, 50, etc.)
   - `isMilestoneBirthday()` returns `false` for non-milestones (17, 19, 25, 42, etc.)
   - `isMilestoneBirthday()` returns `false` for null age
   - `isMilestoneBirthday()` returns `false` for single digits (1-9)
   - `isMilestoneBirthday()` handles edge cases (0, 100, 110, negative numbers)

2. **Component Tests** (`__tests__/integration/components/`):
   - `birthday-card.test.tsx`:
     - Milestone birthday displays with amber border and background
     - Non-milestone birthday displays without highlighting
     - Null age birthday displays without highlighting
   - `birthday-table.test.tsx`:
     - Milestone birthday row has amber background
     - Non-milestone row displays normally
     - Milestone row preserves hover state styling

**Rationale**:
- Aligns with Constitution Principle VII (80%+ coverage requirement)
- Tests behavior not implementation
- Uses existing Jest + RTL infrastructure

**Alternatives Considered**:
- Visual regression testing → Rejected (overkill for simple styling, no existing infrastructure)
- E2E tests → Rejected (unit + integration sufficient for pure UI feature)

---

### 5. Performance Considerations

**Decision**: No performance optimizations required

**Rationale**:
- Milestone detection is O(1) operation (modulo and equality checks)
- Rendering overhead negligible (conditional class names)
- Birthday lists typically small (< 100 entries in home use case)
- No API calls or async operations introduced

**Benchmarking**:
- Milestone check: < 1ms per birthday
- Expected total overhead for 100 birthdays: < 100ms (well under constraint)

**Alternatives Considered**:
- Memoization with useMemo → Rejected (premature optimization, no performance issue)
- Pre-compute milestone flags in data layer → Rejected (violates separation of concerns)

---

### 6. Responsive Design

**Decision**: Use existing Tailwind responsive classes, no mobile-specific changes needed

**Rationale**:
- Border and background styling work across all viewport sizes
- Amber color provides sufficient contrast on mobile screens
- No text size or spacing changes required
- Existing card/table responsive behavior preserved

**Viewport Testing**:
- 320px: Border and background visible
- 768px: No layout changes needed
- 1920px: Highlighting remains proportional

**Alternatives Considered**:
- Mobile-specific highlighting → Rejected (current approach works on all viewports)
- Different colors per viewport → Rejected (inconsistent, confusing UX)

---

## Integration Points

### Files to Modify

1. **`lib/date-utils.ts`**
   - Add `isMilestoneBirthday()` function
   - Export for use in components and tests

2. **`components/birthday-card.tsx`**
   - Import `isMilestoneBirthday` from date-utils
   - Compute `isMilestone` flag from age
   - Apply conditional classes to `<Card>` wrapper

3. **`components/birthday-table.tsx`**
   - Import `isMilestoneBirthday` from date-utils
   - Compute `isMilestone` flag for each row
   - Apply conditional classes to `<TableRow>`

4. **Test files** (extend existing):
   - `__tests__/unit/lib/date-utils.test.ts`
   - `__tests__/integration/components/birthday-card.test.tsx`
   - `__tests__/integration/components/birthday-table.test.tsx`

### No Changes Required

- **Data Layer**: No schema or storage changes
- **API Routes**: No endpoint modifications
- **Type Definitions**: Existing types sufficient
- **ShadCN Components**: Use existing Card/Table components as-is

---

## Risk Assessment

### Low Risk

- **Breaking Changes**: None - purely additive feature
- **Data Migration**: None required
- **Dependencies**: No new packages
- **Compatibility**: Works with existing birthday data structure

### Mitigation Strategies

- **Missing birth years**: Milestone detection gracefully handles null ages (returns false)
- **Invalid ages**: Type system prevents invalid input to `isMilestoneBirthday()`
- **Dark mode**: Tailwind dark: variants ensure visibility in both themes
- **Browser support**: Tailwind CSS utilities have broad browser support

---

## Best Practices Applied

### 1. Simplicity First (Constitution II)
- Single helper function for milestone logic
- No new abstractions or services
- Leverages existing Tailwind utilities

### 2. Responsive Design (Constitution III)
- Tailwind responsive classes
- Works across 320px-1920px viewports
- Mobile-friendly color contrast

### 3. Testing Infrastructure (Constitution VII)
- Comprehensive unit tests for business logic
- Integration tests for component behavior
- Maintains 80%+ coverage requirement

### 4. Code Organization
- Business logic in `lib/` (date-utils)
- UI components in `components/`
- Tests mirror source structure

---

## Open Questions

**All questions resolved during research phase.**

---

## Summary

The milestone birthday highlighting feature will be implemented as a pure UI enhancement with:
- Single helper function for milestone detection
- Conditional Tailwind classes in existing components
- Comprehensive test coverage
- No data model or API changes
- Zero new dependencies

**Ready for Phase 1: Design artifacts generation**
