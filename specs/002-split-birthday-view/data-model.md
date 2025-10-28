# Data Model: Split Birthday View

**Date**: 2025-10-28
**Feature**: Split Birthday View
**Purpose**: Document data structures, types, and transformations for the two-section birthday view

## Overview

This feature does not introduce new persistent data structures. It adds **computed types** and **utility transformations** that derive from the existing `Birthday` entity. The core `Birthday` entity and `BirthdayStore` remain unchanged.

## Existing Entities (No Changes)

### Birthday

```typescript
interface Birthday {
  id: string;              // UUID
  name: string;            // Person's name
  birthDate: string;       // Format: DD.MM or DD.MM.YYYY (4-digit year)
  createdAt: string;       // ISO-8601 timestamp
  updatedAt: string;       // ISO-8601 timestamp
}
```

**Validation Rules** (existing):
- `id`: Non-empty string, unique
- `name`: Non-empty string, 1-100 characters
- `birthDate`: Must match regex `^\d{2}\.\d{2}(\.\d{4})?$`
  - Valid: "02.10", "29.08.1988", "12.07.1990"
  - Invalid: "2.10", "29.8", "12.07.90"
- `createdAt`/`updatedAt`: Valid ISO-8601 timestamp

### BirthdayStore

```typescript
interface BirthdayStore {
  version: string;         // Schema version (e.g., "1.0.0")
  birthdays: Birthday[];   // Array of birthday records
}
```

**Storage**: JSON file at `data/birthdays.json` (Docker volume `/data`)

## New Computed Types

### BirthdayWithOccurrence

**Purpose**: Birthday enriched with computed next occurrence date for sorting and filtering.

```typescript
interface BirthdayWithOccurrence extends Birthday {
  nextOccurrence: Date;    // Next occurrence relative to reference date
  age: number | null;      // Calculated age, null if birth year unavailable
}
```

**Computed Fields**:
- `nextOccurrence`: Calculated by `getNextOccurrence(birthday, referenceDate)`
- `age`: Calculated by `calculateAge(birthday, referenceDate)`

**Lifecycle**: Computed client-side, not persisted, regenerated on each page load

### DateRange

**Purpose**: Represents the two time windows for splitting birthdays.

```typescript
interface DateRange {
  start: Date;             // Inclusive start
  end: Date;               // Inclusive end
}

interface BirthdayRanges {
  upcoming: DateRange;     // Next 30 days (today through today + 29 days)
  future: DateRange;       // Remaining annual cycle (today + 30 days through yesterday + 1 year)
}
```

**Calculation**:
```typescript
function calculateRanges(today: Date): BirthdayRanges {
  const upcomingStart = new Date(today);
  upcomingStart.setHours(0, 0, 0, 0);

  const upcomingEnd = new Date(today);
  upcomingEnd.setDate(today.getDate() + 29);
  upcomingEnd.setHours(23, 59, 59, 999);

  const futureStart = new Date(today);
  futureStart.setDate(today.getDate() + 30);
  futureStart.setHours(0, 0, 0, 0);

  const futureEnd = new Date(today);
  futureEnd.setFullYear(today.getFullYear() + 1);
  futureEnd.setDate(today.getDate() - 1);
  futureEnd.setHours(23, 59, 59, 999);

  return {
    upcoming: { start: upcomingStart, end: upcomingEnd },
    future: { start: futureStart, end: futureEnd }
  };
}
```

### SplitBirthdays

**Purpose**: Result of splitting birthdays into two sections.

```typescript
interface SplitBirthdays {
  upcoming: BirthdayWithOccurrence[];    // Section 1: Next 30 days
  future: BirthdayWithOccurrence[];      // Section 2: Remaining year
}
```

## Data Transformations

### Parse Birth Date

**Purpose**: Extract day, month, and optional year from birthDate string.

```typescript
interface ParsedDate {
  day: number;
  month: number;
  year: number | null;
}

function parseBirthDate(birthDate: string): ParsedDate {
  const parts = birthDate.split('.');

  return {
    day: parseInt(parts[0], 10),
    month: parseInt(parts[1], 10),
    year: parts[2] ? parseInt(parts[2], 10) : null
  };
}
```

**Validation**: Assumes `birthDate` is already validated (API validates on read/write)

### Get Next Occurrence

**Purpose**: Calculate next occurrence of a birthday relative to a reference date.

```typescript
function getNextOccurrence(birthday: Birthday, referenceDate: Date): Date {
  const { day, month, year } = parseBirthDate(birthday.birthDate);

  // Try to create date in current year
  let nextOccurrence = new Date(referenceDate.getFullYear(), month - 1, day);

  // Handle Feb 29 in non-leap years
  if (month === 2 && day === 29 && !isLeapYear(referenceDate.getFullYear())) {
    // Fall back to Feb 28 (specification decision)
    nextOccurrence = new Date(referenceDate.getFullYear(), 1, 28);
  }

  // If birthday already passed this year, use next year
  if (nextOccurrence < referenceDate) {
    nextOccurrence.setFullYear(referenceDate.getFullYear() + 1);

    // Re-check Feb 29 for next year
    if (month === 2 && day === 29 && !isLeapYear(nextOccurrence.getFullYear())) {
      nextOccurrence = new Date(nextOccurrence.getFullYear(), 1, 28);
    }
  }

  return nextOccurrence;
}
```

**Edge Cases**:
- Feb 29 in non-leap year: Returns Feb 28
- Birthday on Dec 31, today is Jan 1: Returns Dec 31 of current year
- Birthday on Jan 1, today is Dec 31: Returns Jan 1 of next year

### Calculate Age

**Purpose**: Calculate current age based on birth year and reference date.

```typescript
function calculateAge(birthday: Birthday, referenceDate: Date): number | null {
  const { day, month, year } = parseBirthDate(birthday.birthDate);

  if (!year) return null;  // No birth year available

  // Validate year is not in future (data error)
  if (year > referenceDate.getFullYear()) return null;

  let age = referenceDate.getFullYear() - year;

  // Adjust if birthday hasn't occurred yet this year
  const birthdayThisYear = new Date(referenceDate.getFullYear(), month - 1, day);
  if (referenceDate < birthdayThisYear) {
    age -= 1;
  }

  return age;
}
```

**Edge Cases**:
- Birth year in future: Returns null (treat as invalid data)
- Age > 150: Returns calculated value (no artificial limit)

### Split Birthdays

**Purpose**: Split birthdays into upcoming and future arrays based on next occurrence.

```typescript
function splitBirthdays(
  birthdays: Birthday[],
  referenceDate: Date
): SplitBirthdays {
  const ranges = calculateRanges(referenceDate);
  const upcoming: BirthdayWithOccurrence[] = [];
  const future: BirthdayWithOccurrence[] = [];

  birthdays.forEach(birthday => {
    const nextOccurrence = getNextOccurrence(birthday, referenceDate);
    const age = calculateAge(birthday, referenceDate);

    const enriched: BirthdayWithOccurrence = {
      ...birthday,
      nextOccurrence,
      age
    };

    if (nextOccurrence <= ranges.upcoming.end) {
      upcoming.push(enriched);
    } else {
      future.push(enriched);
    }
  });

  // Sort both arrays by date (ascending), then by name
  return {
    upcoming: sortBirthdays(upcoming),
    future: sortBirthdays(future)
  };
}
```

### Sort Birthdays

**Purpose**: Two-level sort by next occurrence date, then by name.

```typescript
function sortBirthdays(
  birthdays: BirthdayWithOccurrence[]
): BirthdayWithOccurrence[] {
  return birthdays.sort((a, b) => {
    // Primary sort: by next occurrence date
    const dateDiff = a.nextOccurrence.getTime() - b.nextOccurrence.getTime();
    if (dateDiff !== 0) return dateDiff;

    // Secondary sort: alphabetically by name
    return a.name.localeCompare(b.name);
  });
}
```

## State Transitions

This feature does not introduce persistent state changes. All transformations are computed on the client side:

1. **Initial State**: Page loads, birthdays array is empty
2. **Loading State**: Fetch `/api/birthdays` in progress
3. **Loaded State**: Birthdays received, split into sections
4. **Error State**: API call failed

```typescript
type LoadingState =
  | { status: 'loading' }
  | { status: 'error', message: string }
  | { status: 'success', upcoming: BirthdayWithOccurrence[], future: BirthdayWithOccurrence[] };
```

## Validation Rules

### Runtime Validation

**Input Validation** (API level - no changes):
- Birthday entity fields validated on read from FileStore
- Malformed birthDate strings rejected with error

**Computed Value Validation** (client level):
- `nextOccurrence`: Must be valid Date object, not NaN
- `age`: null or non-negative integer
- Sorting: Total order maintained (no equal keys with different positions)

### Invariants

1. **Partition Completeness**: Every birthday appears in exactly one section
   - `upcoming.length + future.length === birthdays.length`

2. **Date Range Boundaries**: No birthday in wrong section
   - All `upcoming[i].nextOccurrence <= ranges.upcoming.end`
   - All `future[i].nextOccurrence > ranges.upcoming.end`

3. **Sort Order**: Ascending by date within each section
   - `upcoming[i].nextOccurrence <= upcoming[i+1].nextOccurrence`
   - Same for `future` array

## Performance Characteristics

**Computational Complexity**:
- `parseBirthDate`: O(1)
- `getNextOccurrence`: O(1)
- `calculateAge`: O(1)
- `splitBirthdays`: O(n) for partition + O(n log n) for sorting = **O(n log n)**
- Total: **O(n log n)** where n = number of birthdays

**Space Complexity**:
- Two arrays of enriched birthdays: **O(n)**
- No additional persistent storage

**Expected Performance** (n = 100 birthdays):
- Parsing and enrichment: <5ms
- Splitting and sorting: <10ms
- Total client-side processing: <20ms

## Summary

This data model introduces **zero persistent data changes**. All new types are computed client-side from the existing `Birthday` entity. The transformation pipeline (parse → enrich → split → sort) is simple, performant, and maintains constitutional simplicity.

**Key Design Decisions**:
- No new database fields or API changes
- All computations happen in memory on page load
- Functional transformations with immutable data
- Validation assumes API-level data integrity
