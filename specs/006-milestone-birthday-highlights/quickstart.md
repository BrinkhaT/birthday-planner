# Quickstart: Milestone Birthday Highlights

**Feature**: 006-milestone-birthday-highlights
**Date**: 2025-11-01
**Branch**: `006-milestone-birthday-highlights`

## Quick Overview

This feature adds visual highlighting to milestone birthdays (ages 18 and multiples of 10) in both card and table views. Implementation involves modifying 2 components and adding 1 utility function.

## Prerequisites

- Node.js 20.x
- Existing birthday planner application running
- At least one birthday with a birth year in test data

## Development Setup

### 1. Ensure Feature Branch

```bash
# You should already be on this branch
git branch
# Expected output: * 006-milestone-birthday-highlights
```

### 2. Install Dependencies (if not already done)

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Application runs at `http://localhost:3000`

## Implementation Checklist

### Step 1: Add Milestone Detection Function

**File**: `lib/date-utils.ts`

Add this function at the end of the file:

```typescript
/**
 * Determine if a birthday age is a milestone (18 or multiple of 10)
 * @param age - The age at next birthday (or null if birth year unavailable)
 * @returns true if milestone, false otherwise
 */
export function isMilestoneBirthday(age: number | null): boolean {
  if (age === null) return false;
  if (age === 18) return true; // Special milestone: legal adulthood
  if (age % 10 === 0 && age >= 10) return true; // Decade milestones (10, 20, 30, etc.)
  return false;
}
```

**Verification**:
```bash
# Function should be importable
npm run typecheck
```

---

### Step 2: Update BirthdayCard Component

**File**: `components/birthday-card.tsx`

**2.1 Add Import**:
```typescript
import { isMilestoneBirthday } from '@/lib/date-utils';
```

**2.2 Compute Milestone Flag** (add after line 24, the existing `age` variable):
```typescript
const isMilestone = isMilestoneBirthday(age);
```

**2.3 Apply Conditional Styling** (update the `<Card>` element):
```typescript
<Card className={cn(
  "w-full",
  isMilestone && "border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20"
)}>
```

**Note**: Import `cn` from `@/lib/utils` if not already imported.

**Verification**:
- Save file
- Check browser at `http://localhost:3000`
- Cards for milestone birthdays should have amber left border and background

---

### Step 3: Update BirthdayTable Component

**File**: `components/birthday-table.tsx`

**3.1 Add Import**:
```typescript
import { isMilestoneBirthday } from '@/lib/date-utils';
```

**3.2 Find Table Row Rendering**:
Locate the `<TableRow>` element that displays each birthday.

**3.3 Compute Milestone Flag and Apply Styling**:
```typescript
{birthdays.map((birthday) => {
  const isMilestone = isMilestoneBirthday(birthday.age);

  return (
    <TableRow
      key={birthday.id}
      className={cn(
        isMilestone && "bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-900/30"
      )}
    >
      {/* Table cells */}
    </TableRow>
  );
})}
```

**Note**: Preserve existing `key` prop and any other props on `<TableRow>`.

**Verification**:
- Save file
- Check browser table view
- Rows for milestone birthdays should have amber background
- Hover state should show darker amber

---

### Step 4: Add Unit Tests

**File**: `__tests__/unit/lib/date-utils.test.ts`

Add this test suite at the end of the file:

```typescript
describe('isMilestoneBirthday', () => {
  it('returns true for age 18 (special milestone)', () => {
    expect(isMilestoneBirthday(18)).toBe(true);
  });

  it('returns true for multiples of 10 (20, 30, 40, 50, etc.)', () => {
    expect(isMilestoneBirthday(10)).toBe(true);
    expect(isMilestoneBirthday(20)).toBe(true);
    expect(isMilestoneBirthday(30)).toBe(true);
    expect(isMilestoneBirthday(50)).toBe(true);
    expect(isMilestoneBirthday(100)).toBe(true);
  });

  it('returns false for non-milestone ages', () => {
    expect(isMilestoneBirthday(17)).toBe(false);
    expect(isMilestoneBirthday(19)).toBe(false);
    expect(isMilestoneBirthday(25)).toBe(false);
    expect(isMilestoneBirthday(42)).toBe(false);
  });

  it('returns false for null age', () => {
    expect(isMilestoneBirthday(null)).toBe(false);
  });

  it('returns false for single-digit ages (excluding 10)', () => {
    expect(isMilestoneBirthday(1)).toBe(false);
    expect(isMilestoneBirthday(5)).toBe(false);
    expect(isMilestoneBirthday(9)).toBe(false);
  });
});
```

**Verification**:
```bash
npm test -- date-utils.test.ts
# All tests should pass
```

---

### Step 5: Add Component Integration Tests

**File**: `__tests__/integration/components/birthday-card.test.tsx`

Add these tests to the existing test suite:

```typescript
describe('BirthdayCard - Milestone Highlighting', () => {
  it('highlights milestone birthday (age 18) with amber border and background', () => {
    const milestone18: BirthdayWithOccurrence = {
      ...fixtures.birthdayWithAge(18),
      nextOccurrence: new Date('2025-12-25'),
      age: 18,
    };

    render(<BirthdayCard birthday={milestone18} />);
    const card = screen.getByRole('article'); // or appropriate role
    expect(card).toHaveClass('border-l-amber-500');
    expect(card).toHaveClass('bg-amber-50');
  });

  it('highlights milestone birthday (age 30) with amber styling', () => {
    const milestone30: BirthdayWithOccurrence = {
      ...fixtures.birthdayWithAge(30),
      nextOccurrence: new Date('2025-06-15'),
      age: 30,
    };

    render(<BirthdayCard birthday={milestone30} />);
    const card = screen.getByRole('article');
    expect(card).toHaveClass('border-l-amber-500');
  });

  it('does NOT highlight non-milestone birthday', () => {
    const nonMilestone: BirthdayWithOccurrence = {
      ...fixtures.birthdayWithAge(25),
      nextOccurrence: new Date('2025-03-10'),
      age: 25,
    };

    render(<BirthdayCard birthday={nonMilestone} />);
    const card = screen.getByRole('article');
    expect(card).not.toHaveClass('border-l-amber-500');
  });

  it('does NOT highlight birthday without age', () => {
    const noAge: BirthdayWithOccurrence = {
      ...fixtures.birthdayWithoutYear(),
      nextOccurrence: new Date('2025-08-20'),
      age: null,
    };

    render(<BirthdayCard birthday={noAge} />);
    const card = screen.getByRole('article');
    expect(card).not.toHaveClass('border-l-amber-500');
  });
});
```

**Note**: Adjust selectors and fixtures based on actual test file structure.

**Verification**:
```bash
npm test -- birthday-card.test.tsx
```

---

## Manual Testing

### Test Scenarios

**Scenario 1: Milestone Birthday Card (18)**
1. Add birthday: Name "Test User", Date "01.01.2007" (turns 18 in 2025)
2. Check "Anstehende Geburtstage" section
3. Expected: Card has amber left border and light amber background

**Scenario 2: Milestone Birthday Card (Multiple of 10)**
1. Add birthday: Name "Decade Test", Date "15.06.1985" (turns 40 in 2025)
2. Check card display
3. Expected: Amber highlighting visible

**Scenario 3: Non-Milestone Birthday**
1. Add birthday: Name "Regular User", Date "10.03.2000" (turns 25 in 2025)
2. Check card display
3. Expected: NO amber highlighting, regular card styling

**Scenario 4: Birthday Without Year**
1. Add birthday: Name "No Year", Date "20.08." (no birth year)
2. Check card display
3. Expected: NO amber highlighting

**Scenario 5: Table View Milestone**
1. Add milestone birthday to "Alle weiteren Geburtstage" section
2. Check table row
3. Expected: Row has amber background, hover shows darker amber

**Scenario 6: Responsive Design**
1. Open DevTools, toggle device toolbar
2. Test viewports: 320px, 768px, 1920px
3. Expected: Highlighting visible and readable on all viewport sizes

---

## Validation Checklist

Before marking feature complete:

- [ ] `isMilestoneBirthday()` function added to `lib/date-utils.ts`
- [ ] `BirthdayCard` component highlights milestone birthdays
- [ ] `BirthdayTable` component highlights milestone rows
- [ ] Unit tests pass (`npm test -- date-utils.test.ts`)
- [ ] Component tests pass (`npm test -- birthday-card.test.tsx`)
- [ ] Manual testing scenarios verified
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No linting errors (`npm run lint`)
- [ ] Overall test coverage ≥ 80% (`npm test -- --coverage`)
- [ ] Dark mode highlighting works correctly
- [ ] Responsive design verified (320px-1920px)

---

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- date-utils.test.ts

# Run with coverage
npm test -- --coverage

# Watch mode during development
npm test -- --watch
```

---

## Troubleshooting

### Issue: Highlighting Not Visible

**Check**:
1. Age is calculated correctly (check browser console)
2. `isMilestoneBirthday()` returns true for test age
3. Tailwind classes applied to element (inspect in DevTools)
4. Dark mode classes if in dark mode

### Issue: TypeScript Errors

**Check**:
1. `isMilestoneBirthday` imported correctly
2. `cn` utility imported from `@/lib/utils`
3. Run `npm run typecheck` for detailed errors

### Issue: Tests Failing

**Check**:
1. Fixtures match expected structure
2. Test assertions match actual class names
3. Component selectors match rendered output

---

## Next Steps

After completing implementation and validation:

1. Run `/speckit.tasks` to generate ordered task list
2. Run `/speckit.implement` to execute tasks
3. Create pull request to merge into `develop` branch

---

## Reference

- **Spec**: [spec.md](./spec.md)
- **Research**: [research.md](./research.md)
- **Data Model**: [data-model.md](./data-model.md)
- **Implementation Plan**: [plan.md](./plan.md)
