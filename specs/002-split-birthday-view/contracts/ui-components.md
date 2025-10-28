# UI Component Contracts: Split Birthday View

**Date**: 2025-10-28
**Feature**: Split Birthday View
**Purpose**: Define component interfaces and props contracts for the two-section birthday view

## Overview

This document defines the TypeScript interfaces and component contracts for the UI layer. This feature introduces one new component (`BirthdayTable`) and modifies the existing page component.

## Component Contracts

### BirthdayTable (NEW)

**Purpose**: Display birthdays in a tabular format with date, name, and age columns. Responsive design with mobile optimization.

**Props**:

```typescript
interface BirthdayTableProps {
  birthdays: BirthdayWithOccurrence[];  // Pre-sorted array
  emptyMessage?: string;                 // Optional custom empty state message
  className?: string;                    // Optional Tailwind classes
}
```

**Behavior**:
- Displays birthdays in table format with three columns: Date, Name, Age
- Shows `emptyMessage` if birthdays array is empty (default: "No birthdays to display")
- Age column shows "—" (em dash) when age is null
- Responsive: full table on desktop, scrollable on mobile
- Uses ShadCN Table components for consistency

**Example Usage**:

```tsx
<BirthdayTable
  birthdays={futureBirthdays}
  emptyMessage="No other birthdays to display"
  className="mt-6"
/>
```

**Implementation File**: `components/birthday-table.tsx`

### BirthdayCard (EXISTING - No Changes)

**Purpose**: Display a single birthday as a card with name, age, and date.

**Props**:

```typescript
interface BirthdayCardProps {
  birthday: Birthday;     // Existing Birthday type
}
```

**Behavior** (unchanged):
- Displays birthday as a card with person's name
- Shows age if birth year is available
- Shows formatted date
- Responsive card layout

**Implementation File**: `components/birthday-card.tsx`

### Home Page (MODIFIED)

**Purpose**: Main birthday planner page with two sections.

**State**:

```typescript
interface HomePageState {
  birthdays: Birthday[];              // Raw birthdays from API
  loading: boolean;                   // Loading state
  error: string | null;               // Error message
}
```

**Computed Values**:

```typescript
const { upcoming, future } = useMemo(() => {
  const today = new Date();
  return splitBirthdays(birthdays, today);
}, [birthdays]);
```

**Structure**:

```tsx
<main>
  <header>
    <h1>🎂 Birthday Planner</h1>
    <p>Never miss a birthday again!</p>
  </header>

  <section aria-labelledby="upcoming-heading">
    <h2 id="upcoming-heading">Upcoming Birthdays (Next 30 Days)</h2>
    {upcoming.length === 0 ? (
      <EmptyState message="No birthdays in the next 30 days" />
    ) : (
      <div className="grid">
        {upcoming.map(birthday => (
          <BirthdayCard key={birthday.id} birthday={birthday} />
        ))}
      </div>
    )}
  </section>

  <section aria-labelledby="future-heading">
    <h2 id="future-heading">All Other Birthdays</h2>
    <BirthdayTable
      birthdays={future}
      emptyMessage="No other birthdays to display"
    />
  </section>
</main>
```

**Implementation File**: `app/page.tsx`

## Utility Function Contracts

### Date Utilities

**File**: `lib/date-utils.ts`

#### parseBirthDate

```typescript
function parseBirthDate(birthDate: string): ParsedDate

interface ParsedDate {
  day: number;
  month: number;
  year: number | null;
}
```

**Contract**:
- Input: birthDate string in format `DD.MM` or `DD.MM.YYYY`
- Output: Parsed day (1-31), month (1-12), year (4-digit or null)
- Assumes input is already validated

#### getNextOccurrence

```typescript
function getNextOccurrence(birthday: Birthday, referenceDate: Date): Date
```

**Contract**:
- Input: Birthday entity and reference date
- Output: Next occurrence of birthday (Date object)
- Handles year boundary crossing
- Handles Feb 29 in non-leap years (returns Feb 28)
- Always returns future or current date (never past)

#### calculateAge

```typescript
function calculateAge(birthday: Birthday, referenceDate: Date): number | null
```

**Contract**:
- Input: Birthday entity and reference date
- Output: Age in years, or null if birth year unavailable or invalid
- Returns null for birth years in future (data error)
- Adjusts for birthdays not yet occurred this year

#### splitBirthdays

```typescript
function splitBirthdays(birthdays: Birthday[], referenceDate: Date): SplitBirthdays

interface SplitBirthdays {
  upcoming: BirthdayWithOccurrence[];
  future: BirthdayWithOccurrence[];
}
```

**Contract**:
- Input: Array of birthdays and reference date
- Output: Two sorted arrays (upcoming and future)
- Upcoming: birthdays within next 30 days
- Future: birthdays from day 31 through yesterday + 1 year
- Both arrays sorted by date (ascending), then by name
- Guarantees: `upcoming.length + future.length === birthdays.length`

#### sortBirthdays

```typescript
function sortBirthdays(birthdays: BirthdayWithOccurrence[]): BirthdayWithOccurrence[]
```

**Contract**:
- Input: Array of birthdays with computed next occurrence
- Output: Sorted array (does not mutate input)
- Primary sort: by nextOccurrence date (ascending)
- Secondary sort: by name (alphabetical, case-insensitive)

#### isLeapYear

```typescript
function isLeapYear(year: number): boolean
```

**Contract**:
- Input: Year as integer
- Output: true if leap year, false otherwise
- Algorithm: divisible by 4, except centuries unless divisible by 400

## Type Contracts

### BirthdayWithOccurrence

```typescript
interface BirthdayWithOccurrence extends Birthday {
  nextOccurrence: Date;    // Computed next occurrence
  age: number | null;      // Computed age (null if year unavailable)
}
```

**Invariants**:
- `nextOccurrence` is always a valid Date (not NaN)
- `nextOccurrence >= referenceDate` (never in past)
- `age` is null or non-negative integer
- All Birthday fields remain unchanged

### DateRange

```typescript
interface DateRange {
  start: Date;             // Inclusive
  end: Date;               // Inclusive
}
```

**Invariants**:
- `start <= end`
- Both are valid Date objects (not NaN)

## Responsive Behavior Contracts

### Section 1 (Cards)

**Breakpoints**:
- Mobile (<640px): 1 column, cards stack vertically
- Tablet (640px-1024px): 2 columns
- Desktop (≥1024px): 3 columns

**Grid Classes**:
```css
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6
```

### Section 2 (Table)

**Breakpoints**:
- Mobile (<768px): Horizontal scroll or stacked card-like rows
- Tablet/Desktop (≥768px): Full table with three columns

**Responsive Strategy**:
- Option A: Horizontal scroll on mobile (simpler)
  ```tsx
  <div className="overflow-x-auto">
    <Table>...</Table>
  </div>
  ```

- Option B: Card-like rows on mobile (better UX)
  ```tsx
  <Table className="hidden md:table">...</Table>
  <div className="md:hidden space-y-2">
    {birthdays.map(birthday => (
      <Card>...</Card>
    ))}
  </div>
  ```

**Decision**: Use Option A (horizontal scroll) for simplicity unless user testing shows issues.

## Accessibility Contracts

### Semantic HTML

- Section headings: `<h2>` with unique `id` attributes
- Table: Proper `<table>`, `<thead>`, `<tbody>` structure
- ARIA labels: `aria-labelledby` linking sections to headings

### Keyboard Navigation

- Table rows: Focusable if interactive (not required for this feature)
- No keyboard traps
- Logical tab order: header → Section 1 → Section 2

### Screen Reader Support

- Section headings announced properly
- Table headers announced with data cells
- Empty states have meaningful text
- Age "—" announced as "not available" or "unknown"

## Error Handling Contracts

### Empty State Scenarios

1. **No birthdays at all**:
   - Section 1: "No birthdays in the next 30 days"
   - Section 2: "No other birthdays to display"

2. **All birthdays in Section 1**:
   - Section 1: Shows cards
   - Section 2: "No other birthdays to display"

3. **All birthdays in Section 2**:
   - Section 1: "No birthdays in the next 30 days"
   - Section 2: Shows table

### Data Error Scenarios

1. **Invalid birthDate format**: Handled by API validation (not in UI)
2. **Malformed JSON**: Handled by API error response
3. **API failure**: Show error state with retry button (existing behavior)

## Performance Contracts

### Rendering Performance

- Section 1 (cards): O(n) rendering for n birthdays
- Section 2 (table): O(n) rendering for n birthdays
- Total: O(n) where n = number of birthdays

### Computation Performance

- Date calculations: O(n log n) for sorting
- Memoized: Only recalculated when birthdays array changes
- Expected: <20ms for 100 birthdays

### Re-render Optimization

```typescript
const { upcoming, future } = useMemo(() => {
  return splitBirthdays(birthdays, new Date());
}, [birthdays]);
```

**Contract**: Only recalculate split when birthdays change, not on every render.

## Testing Contracts

### Visual Regression Tests (Manual)

1. Viewport sizes: 320px, 768px, 1920px
2. Empty states: no birthdays, partial populations
3. Edge cases: Feb 29, year boundaries, same-day birthdays

### Functional Tests (Manual)

1. Verify 30-day cutoff is exact
2. Verify sorting is correct (date then name)
3. Verify age calculation is accurate
4. Verify no duplicates or missing birthdays

## Summary

All component contracts maintain:
- **Type safety**: TypeScript interfaces for all props and return types
- **Immutability**: No mutations of input data
- **Accessibility**: Semantic HTML and ARIA labels
- **Responsiveness**: Mobile-first breakpoints
- **Performance**: Memoization and O(n log n) complexity
- **Constitutional compliance**: Simplicity First, Responsive Design

No API contracts are modified. This is a pure UI refactoring feature.
