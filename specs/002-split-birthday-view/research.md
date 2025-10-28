# Research: Split Birthday View

**Date**: 2025-10-28
**Feature**: Split Birthday View
**Purpose**: Document technical decisions, patterns, and best practices for implementing the two-section birthday view

## Date Range Calculation

### Decision: Pure JavaScript Date Arithmetic

**Rationale**:
- No external date library needed (maintains Simplicity First principle)
- JavaScript Date object handles year boundaries, leap years, and timezone correctly
- Calculation happens client-side for instant rendering
- Consistent with constitution's YAGNI principle

**Implementation Pattern**:
```typescript
// Calculate date ranges based on today
const today = new Date();
today.setHours(0, 0, 0, 0); // Normalize to start of day

// 30-day window: today through today + 29 days
const upcomingEnd = new Date(today);
upcomingEnd.setDate(today.getDate() + 29);

// Future window: today + 30 days through yesterday + 1 year
const futureStart = new Date(today);
futureStart.setDate(today.getDate() + 30);

const futureEnd = new Date(today);
futureEnd.setFullYear(today.getFullYear() + 1);
futureEnd.setDate(today.getDate() - 1);
```

**Alternatives Considered**:
- `date-fns` library: Rejected - adds dependency for simple date arithmetic
- `dayjs` library: Rejected - unnecessary for our use case
- Server-side calculation: Rejected - client-side is instant and reduces API complexity

### Decision: Birthday Date Normalization

**Rationale**:
- Birthdays repeat annually, need to map to current/next occurrence
- Must handle year boundary (birthday in December vs today in January)
- Leap year birthdays (Feb 29) need special handling

**Implementation Pattern**:
```typescript
function getNextOccurrence(birthday: Birthday, referenceDate: Date): Date {
  const [day, month, year] = parseBirthDate(birthday.birthDate);

  // Create date in current year
  let nextOccurrence = new Date(referenceDate.getFullYear(), month - 1, day);

  // If it's in the past, use next year
  if (nextOccurrence < referenceDate) {
    nextOccurrence.setFullYear(referenceDate.getFullYear() + 1);
  }

  // Handle Feb 29 in non-leap years
  if (month === 2 && day === 29 && !isLeapYear(nextOccurrence.getFullYear())) {
    // Display on Feb 28 (specification edge case decision)
    nextOccurrence = new Date(nextOccurrence.getFullYear(), 1, 28);
  }

  return nextOccurrence;
}
```

**Edge Cases Handled**:
- Feb 29 birthdays in non-leap years → display on Feb 28
- Birthday on Dec 31 when today is Jan 1 → next occurrence is Dec 31 this year
- Birthday on Jan 1 when today is Dec 31 → next occurrence is tomorrow (Jan 1)

## Birthday Splitting Logic

### Decision: Client-Side Array Filtering

**Rationale**:
- API returns all birthdays (no changes to existing endpoint)
- Page component filters into two arrays based on date ranges
- Keeps API simple and focused on data retrieval
- Filtering is fast (<100ms for typical birthday list)

**Implementation Pattern**:
```typescript
function splitBirthdays(birthdays: Birthday[], today: Date) {
  const upcomingEnd = new Date(today);
  upcomingEnd.setDate(today.getDate() + 29);

  const upcoming: Birthday[] = [];
  const future: Birthday[] = [];

  birthdays.forEach(birthday => {
    const nextOccurrence = getNextOccurrence(birthday, today);

    if (nextOccurrence <= upcomingEnd) {
      upcoming.push({ ...birthday, nextOccurrence });
    } else {
      future.push({ ...birthday, nextOccurrence });
    }
  });

  return { upcoming, future };
}
```

**Alternatives Considered**:
- Server-side splitting: Rejected - adds API complexity, no performance benefit
- Multiple API endpoints: Rejected - violates Simplicity First principle

## Age Calculation

### Decision: Calculate Age When Birth Year Available

**Rationale**:
- Birthday data may include year (DD.MM.YYYY) or not (DD.MM)
- Age = current year - birth year (simple integer math)
- Display age only when birth year is present

**Implementation Pattern**:
```typescript
function calculateAge(birthday: Birthday, referenceDate: Date): number | null {
  const [day, month, year] = parseBirthDate(birthday.birthDate);

  if (!year) return null; // No year available

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
- Birth year in future (data error): Return null (treat as invalid)
- Age > 150: Consider valid (data entry decision, not system constraint)

## Sorting Logic

### Decision: Two-Level Sort (Date Primary, Name Secondary)

**Rationale**:
- Primary sort: by next occurrence date (ascending)
- Secondary sort: alphabetically by name when dates match
- Consistent ordering provides predictable UX

**Implementation Pattern**:
```typescript
function sortBirthdays(birthdays: BirthdayWithOccurrence[]): BirthdayWithOccurrence[] {
  return birthdays.sort((a, b) => {
    // Primary: sort by date
    const dateDiff = a.nextOccurrence.getTime() - b.nextOccurrence.getTime();
    if (dateDiff !== 0) return dateDiff;

    // Secondary: sort by name
    return a.name.localeCompare(b.name);
  });
}
```

## Table Component Design

### Decision: ShadCN Table Component with Responsive Behavior

**Rationale**:
- Maintains UI consistency with existing ShadCN components
- Built-in accessibility features (ARIA roles, keyboard navigation)
- Responsive patterns: stack on mobile, full table on desktop

**Component Structure**:
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Date</TableHead>
      <TableHead>Name</TableHead>
      <TableHead>Age</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {birthdays.map(birthday => (
      <TableRow key={birthday.id}>
        <TableCell>{formatDate(birthday.nextOccurrence)}</TableCell>
        <TableCell>{birthday.name}</TableCell>
        <TableCell>{birthday.age ?? '—'}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**Responsive Strategy**:
- Desktop (≥768px): Standard table with three columns
- Mobile (<768px): Consider card-like rows or horizontal scroll
- Use Tailwind responsive classes: `hidden md:table-cell`

**Alternatives Considered**:
- Custom table: Rejected - ShadCN provides accessibility and consistency
- Data grid library: Rejected - overkill for simple display table
- Cards on mobile: Considered but table with horizontal scroll may be cleaner

## Empty State Handling

### Decision: Contextual Empty Messages Per Section

**Rationale**:
- Section 1 empty: "No birthdays in the next 30 days"
- Section 2 empty: "No other birthdays to display"
- Both empty: "No birthdays found. Add some to get started!"

**Implementation Pattern**:
```tsx
{upcoming.length === 0 ? (
  <EmptyState message="No birthdays in the next 30 days" icon="📅" />
) : (
  <BirthdayCardGrid birthdays={upcoming} />
)}
```

## Performance Considerations

### Decision: Client-Side Calculation with Memoization

**Rationale**:
- Birthday list size: <100 entries typical
- Date calculations: O(n) with small constant factor
- Memoize calculations using React.useMemo

**Implementation Pattern**:
```tsx
const { upcoming, future } = useMemo(() => {
  const today = new Date();
  return splitBirthdays(birthdays, today);
}, [birthdays]);
```

**Performance Targets**:
- Date calculations: <10ms for 100 birthdays
- Section rendering: <50ms
- Total page load: <1 second (as specified)

## Accessibility

### Decision: Semantic HTML and ARIA Labels

**Rationale**:
- Section headings: `<h2>` tags for proper hierarchy
- Table: Native `<table>` with proper ARIA roles via ShadCN
- Empty states: Clear messaging for screen readers

**Implementation Checklist**:
- [ ] Semantic HTML elements (section, h2, table)
- [ ] ARIA labels for interactive elements
- [ ] Keyboard navigation support (ShadCN provides)
- [ ] Color contrast meets WCAG AA standards
- [ ] Touch targets ≥44px on mobile

## Testing Strategy

### Decision: Manual Responsive Testing + Edge Case Validation

**Rationale**:
- No automated UI testing framework in place
- Manual testing across viewports and edge cases
- Focus on boundary conditions (30-day cutoff, leap years, empty states)

**Test Scenarios**:
1. Viewport testing: 320px, 768px, 1920px
2. Date boundary: birthdays at exactly 30 days
3. Leap year: Feb 29 birthdays in non-leap years
4. Empty data: no birthdays, all in Section 1, all in Section 2
5. Sorting: multiple birthdays on same date
6. Age display: with/without birth year

## Summary

This feature maintains constitutional compliance by:
- **Simplicity First**: No external libraries, pure JS date arithmetic
- **Responsive Design**: Mobile-first table component with ShadCN
- **Docker-First**: No infrastructure changes required
- **SpecKit-Driven**: Following full workflow with documented decisions

All technical decisions prioritize simplicity, maintainability, and constitutional alignment.
