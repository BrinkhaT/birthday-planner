# Data Model: Milestone Birthday Highlights

**Feature**: 006-milestone-birthday-highlights
**Date**: 2025-11-01
**Status**: Complete

## Overview

This feature introduces NO changes to the existing data model. All milestone detection logic is derived at runtime from existing birthday data.

## Data Model Changes

**None** - This is a pure UI enhancement feature.

## Existing Data Structures

### Birthday Entity (No Changes)

The existing `Birthday` type remains unchanged:

```typescript
// From types/birthday.ts
interface Birthday {
  id: string;
  name: string;
  birthDate: string; // ISO format: YYYY-MM-DD or --MM-DD
}
```

### BirthdayWithOccurrence (No Changes)

The existing `BirthdayWithOccurrence` type remains unchanged:

```typescript
// From types/birthday.ts
interface BirthdayWithOccurrence extends Birthday {
  nextOccurrence: Date;
  age: number | null; // null when birth year unavailable
}
```

**Key Point**: The `age` field is already computed by `calculateAge()` in `lib/date-utils.ts`. Milestone detection uses this existing field.

## Derived State

### Milestone Flag (Runtime Computed)

Milestone status is determined at render time using a pure function:

```typescript
// New function in lib/date-utils.ts
export function isMilestoneBirthday(age: number | null): boolean {
  if (age === null) return false;
  if (age === 18) return true; // Legal adulthood
  if (age % 10 === 0 && age >= 10) return true; // Decade milestones
  return false;
}
```

**Input**: `age: number | null` (from `BirthdayWithOccurrence.age`)
**Output**: `boolean` (true if milestone, false otherwise)

**Logic**:
1. Return `false` if age is null (birth year not available)
2. Return `true` if age equals 18 (special milestone)
3. Return `true` if age is multiple of 10 and >= 10 (10, 20, 30, 40, etc.)
4. Return `false` otherwise

## Data Flow

```
FileStore (JSON)
    ↓
Birthday[] (raw data)
    ↓
calculateAge() (existing function)
    ↓
BirthdayWithOccurrence[] (with age field)
    ↓
isMilestoneBirthday() (NEW function)
    ↓
boolean (milestone flag for UI)
    ↓
Component (apply conditional styling)
```

## Validation Rules

No new validation required - milestone detection uses existing age calculation which already handles:
- Missing birth years (returns null)
- Invalid dates (returns null)
- Future birth years (returns null)

## State Management

**No state management required** - milestone flag is computed on-demand during rendering.

**Rationale**:
- Milestone status is deterministic (same age always produces same result)
- Computation is O(1) and fast (< 1ms)
- No need to persist or cache
- Follows React best practices (derive from props)

## Migration Strategy

**Not applicable** - no data migration needed.

## Storage Impact

**None** - no changes to `birthdays.json` schema or FileStore operations.

## Type Definitions

No new TypeScript types required. Milestone flag is:
- Computed locally in components
- Type: `boolean`
- Not exported or shared

## Relationships

This feature maintains existing data relationships:
- Birthday ← 1:1 → BirthdayWithOccurrence (unchanged)
- BirthdayCard displays single BirthdayWithOccurrence (unchanged)
- BirthdayTable displays array of BirthdayWithOccurrence (unchanged)

## Data Integrity

No data integrity concerns:
- Read-only operation (no writes to FileStore)
- No risk of data corruption
- Existing validation remains unchanged

## Performance Considerations

**Age Calculation**: Already performed once per birthday in `splitBirthdays()` function
**Milestone Check**: Additional O(1) operation per birthday
**Total Overhead**: Negligible (< 1ms per birthday)

## Summary

This feature requires ZERO data model changes. All milestone logic is implemented as derived state using existing birthday data and age calculations. The implementation follows the "Simplicity First" constitutional principle by avoiding unnecessary data persistence and leveraging existing infrastructure.
