# Quickstart Guide: Split Birthday View

**Date**: 2025-10-28
**Feature**: Split Birthday View (002)
**Branch**: `002-split-birthday-view`

## Overview

This guide helps you validate and test the Split Birthday View feature, which divides the birthday overview page into two sections:
- **Section 1**: Upcoming birthdays (next 30 days) displayed as cards
- **Section 2**: All other birthdays (day 31 through yesterday + 1 year) displayed in a table

## Prerequisites

- Node.js 20.x installed
- Repository cloned and on `002-split-birthday-view` branch
- Dependencies installed (`npm install`)

## Setup

### 1. Checkout Feature Branch

```bash
git checkout 002-split-birthday-view
```

### 2. Install Dependencies (if needed)

```bash
npm install
```

No new dependencies are added by this feature.

### 3. Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`

## Validation Steps

### Visual Inspection

#### Section 1: Upcoming Birthdays (Cards)

1. **Navigate** to `http://localhost:3000`
2. **Locate** the "Upcoming Birthdays (Next 30 Days)" section
3. **Verify**:
   - [ ] Section heading is clearly visible
   - [ ] Birthdays within next 30 days are displayed as cards
   - [ ] Each card shows: Name, Age (if available), Date
   - [ ] Cards are sorted by date (ascending - soonest first)
   - [ ] Empty state message appears if no upcoming birthdays

#### Section 2: All Other Birthdays (Table)

1. **Scroll down** to the "All Other Birthdays" section
2. **Verify**:
   - [ ] Section heading is clearly visible
   - [ ] Birthdays beyond 30 days are displayed in a table
   - [ ] Table has three columns: Date, Name, Age
   - [ ] Age column shows "—" when birth year unavailable
   - [ ] Table is sorted by date (ascending)
   - [ ] Empty state message appears if no future birthdays

### Responsive Testing

#### Mobile (320px)

```bash
# Open browser DevTools and set viewport to 320px width
```

**Verify**:
- [ ] Section 1 cards stack vertically (1 column)
- [ ] Section 2 table is scrollable horizontally or displays as cards
- [ ] Text is readable without zooming
- [ ] Touch targets are at least 44px

#### Tablet (768px)

```bash
# Set viewport to 768px width
```

**Verify**:
- [ ] Section 1 cards display in 2 columns
- [ ] Section 2 table displays with all three columns visible
- [ ] Layout uses available space efficiently

#### Desktop (1920px)

```bash
# Set viewport to 1920px width
```

**Verify**:
- [ ] Section 1 cards display in 3 columns
- [ ] Section 2 table displays with optimal column widths
- [ ] No excessive whitespace

### Functional Testing

#### Date Boundary Testing

**Test 1: 30-Day Cutoff**

1. Identify today's date
2. Check a birthday exactly 30 days from today
3. **Expected**: Birthday appears in Section 1

**Test 2: 31-Day Cutoff**

1. Check a birthday exactly 31 days from today
2. **Expected**: Birthday appears in Section 2

**Test 3: Today's Birthday**

1. Check a birthday on today's date (if available)
2. **Expected**: Birthday appears in Section 1

#### Sorting Testing

**Test 4: Date Sorting**

1. **Verify**: Within each section, birthdays are sorted by date (earliest first)
2. **Check**: If multiple birthdays share the same date, they are sorted alphabetically by name

**Test 5: Year Boundary**

1. Test when today is late December
2. **Expected**: Birthdays in January appear in Section 1 (if within 30 days)

#### Age Calculation Testing

**Test 6: Age Display with Birth Year**

1. Find a birthday with 4-digit year (e.g., "29.08.1988")
2. **Expected**: Age is calculated correctly (e.g., 36 years if testing in 2024)

**Test 7: Age Display without Birth Year**

1. Find a birthday without year (e.g., "02.10")
2. **Expected**: Age is not displayed (or shows "—")

#### Edge Case Testing

**Test 8: Leap Year Birthday**

1. If testing in non-leap year, check a Feb 29 birthday
2. **Expected**: Displayed on Feb 28 (or March 1, depending on implementation)

**Test 9: Empty States**

1. Temporarily remove all birthdays from `data/birthdays.json`
2. **Expected**: Both sections show appropriate empty state messages
3. Restore birthdays

**Test 10: All Birthdays in One Section**

1. Modify test data so all birthdays fall within next 30 days
2. **Expected**: Section 1 shows all cards, Section 2 shows empty state

## Test Data

### Recommended Test Dataset

Create a test dataset in `data/birthdays.json` with birthdays distributed across the year:

```json
{
  "version": "1.0.0",
  "birthdays": [
    {
      "id": "1",
      "name": "Alice Smith",
      "birthDate": "15.01.1990",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": "2",
      "name": "Bob Jones",
      "birthDate": "29.02.1988",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": "3",
      "name": "Charlie Brown",
      "birthDate": "10.11",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": "4",
      "name": "Diana Prince",
      "birthDate": "[TODAY + 15 DAYS].1985",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": "5",
      "name": "Eve Wilson",
      "birthDate": "[TODAY + 35 DAYS].1992",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

**Note**: Replace `[TODAY + X DAYS]` with actual dates relative to your testing date.

### Testing Scenarios by Date

| Birthday Date | Expected Section | Why |
|--------------|------------------|-----|
| Today | Section 1 | Within 30-day window |
| Today + 15 days | Section 1 | Within 30-day window |
| Today + 30 days | Section 1 | Exactly at 30-day boundary (inclusive) |
| Today + 31 days | Section 2 | Beyond 30-day window |
| Today + 6 months | Section 2 | Future birthday |
| Yesterday + 1 year | Section 2 | End of annual cycle |

## Docker Testing

### Build and Run

```bash
# Build Docker image
docker-compose build

# Start container
docker-compose up -d

# Check logs
docker-compose logs -f

# Access application
open http://localhost:3000
```

**Verify**:
- [ ] Application loads correctly in Docker
- [ ] Both sections display properly
- [ ] Data persists across container restarts

### Stop and Clean Up

```bash
docker-compose down
```

## Performance Validation

### Client-Side Performance

1. Open browser DevTools → Performance tab
2. Reload the page
3. **Verify**:
   - [ ] Page loads in < 1 second
   - [ ] Date calculations complete in < 20ms
   - [ ] No jank or stuttering during render

### Network Performance

1. Open browser DevTools → Network tab
2. Reload the page
3. **Verify**:
   - [ ] `/api/birthdays` response is < 100ms
   - [ ] No additional API calls introduced
   - [ ] No console errors

## Accessibility Validation

### Keyboard Navigation

1. **Tab through the page**:
   - [ ] Focus order is logical (header → Section 1 → Section 2)
   - [ ] No keyboard traps
   - [ ] Focus indicators are visible

### Screen Reader Testing

1. **Enable screen reader** (VoiceOver on Mac, NVDA on Windows)
2. **Navigate the page**:
   - [ ] Section headings are announced correctly
   - [ ] Table headers are announced with data
   - [ ] Empty states have meaningful text

### Color Contrast

1. **Use browser DevTools accessibility inspector**
2. **Verify**:
   - [ ] Text meets WCAG AA contrast ratio (4.5:1)
   - [ ] Focus indicators are visible

## Troubleshooting

### Issue: No birthdays displayed

**Solution**:
1. Check `data/birthdays.json` exists and has valid data
2. Check browser console for API errors
3. Verify `/api/birthdays` endpoint returns 200 OK

### Issue: Birthdays in wrong section

**Solution**:
1. Verify system date is correct
2. Check date calculation logic in `lib/date-utils.ts`
3. Verify 30-day boundary logic

### Issue: Table not responsive on mobile

**Solution**:
1. Check viewport meta tag in `app/layout.tsx`
2. Verify Tailwind responsive classes are applied
3. Test with browser DevTools device emulation

### Issue: Age calculation incorrect

**Solution**:
1. Verify birth year is 4-digit format (not 2-digit)
2. Check current year is calculated correctly
3. Verify birthday-hasn't-occurred-yet adjustment

## Success Criteria Checklist

From the specification (spec.md):

- [ ] **SC-001**: Users can identify all birthdays in next 30 days within 3 seconds
- [ ] **SC-002**: Users can scan through all birthdays for entire year within 10 seconds
- [ ] **SC-003**: Page layout remains functional on 320px to 1920px viewports
- [ ] **SC-004**: Users can distinguish urgent vs future birthdays via visual hierarchy
- [ ] **SC-005**: 100% of birthdays displayed in exactly one section (no duplicates/omissions)
- [ ] **SC-006**: Age displayed correctly for all birthdays with birth year

## Next Steps

After validating the feature:

1. **Generate tasks**: Run `/speckit.tasks` to create implementation task list
2. **Implement**: Run `/speckit.implement` to execute tasks
3. **Test again**: Re-run this quickstart guide to validate implementation
4. **Merge**: Create pull request to merge into `develop` branch

## Support

If you encounter issues:
1. Check console for errors
2. Review implementation against contracts in `contracts/ui-components.md`
3. Verify against technical decisions in `research.md`
4. Consult data model in `data-model.md`

## Summary

This quickstart guide provides a comprehensive validation checklist for the Split Birthday View feature. Follow all steps to ensure the implementation meets specifications and success criteria before merging.
