# Feature Specification: Split Birthday View

**Feature Branch**: `002-split-birthday-view`
**Created**: 2025-10-28
**Status**: Draft
**Input**: User description: "Ich möchte gern die Übersichtsseite etwas umgebaut haben. Sie soll aus zwei Sektionen bestehen:

Sektion 1:
Die anstehenden Geburtstage der kommenden 30 Tage.
Darstellung der Geburtstage als Karten mit diesen Infos: Name, Alter (wenn möglich), Datum
Sortiert nach Datum aufsteigend

Sektion 2:
Alle weiteren Geburtstage die nach den 30 Tagen aus Sektion 1 kommen bis einschließlich gestern + 1 Jahr.
Darstellung als Tabelle mit diesen Infos: Datum, Name, Alter"

## User Scenarios & Testing

### User Story 1 - View Upcoming Birthdays (Priority: P1)

Users need to quickly identify birthdays happening in the next 30 days so they can prepare gifts, send cards, or make plans. The card-based display makes these urgent birthdays visually prominent and easy to scan.

**Why this priority**: This is the primary use case - users most urgently need to know about imminent birthdays to take action. Without this, the application loses its core value proposition.

**Independent Test**: Can be fully tested by navigating to the home page and verifying that all birthdays within the next 30 days are displayed as cards sorted by date, and delivers immediate value by showing upcoming birthdays that require attention.

**Acceptance Scenarios**:

1. **Given** I am on the home page and today is January 15, **When** I view Section 1, **Then** I see all birthdays from January 15 to February 14 displayed as cards
2. **Given** a birthday is 5 days away, **When** I view the card, **Then** I see the person's name, age (if birth year is known), and date clearly displayed
3. **Given** there are multiple birthdays in the next 30 days, **When** I view Section 1, **Then** the cards are sorted by date in ascending order (soonest first)
4. **Given** no birthdays exist in the next 30 days, **When** I view Section 1, **Then** I see an appropriate message indicating no upcoming birthdays
5. **Given** a person has no birth year specified, **When** I view their birthday card, **Then** the age is not displayed but name and date are shown

---

### User Story 2 - Review All Other Birthdays (Priority: P2)

Users want to see a complete reference of all other birthdays (beyond the next 30 days up to yesterday + 1 year) in a compact, scannable table format. This provides a full-year overview for long-term planning.

**Why this priority**: While important for completeness and long-term planning, this is less urgent than upcoming birthdays. Users can still get value from P1 alone.

**Independent Test**: Can be tested by verifying that Section 2 displays all birthdays not shown in Section 1, covering the period from day 31 onwards through yesterday + 1 year, in a table format with date, name, and age columns.

**Acceptance Scenarios**:

1. **Given** I am on the home page and today is January 15, **When** I view Section 2, **Then** I see birthdays from February 15 onwards through January 14 next year in a table
2. **Given** birthdays exist in Section 2, **When** I view the table, **Then** each row shows date, name, and age (if birth year is known)
3. **Given** a person in Section 2 has no birth year, **When** I view their table row, **Then** the age column is empty or shows a placeholder
4. **Given** Section 2 contains many birthdays, **When** I scroll through the table, **Then** the table remains readable and properly formatted on all device sizes
5. **Given** all birthdays fall within the next 30 days, **When** I view Section 2, **Then** I see an appropriate message indicating no other birthdays to display

---

### User Story 3 - Responsive Layout Across Devices (Priority: P3)

Users access the birthday planner from various devices (mobile phones, tablets, desktops). The two-section layout adapts gracefully to different screen sizes while maintaining readability and usability.

**Why this priority**: Important for user experience across devices, but the functionality can work on a single device type first. Enhancement rather than core requirement.

**Independent Test**: Can be tested by viewing the page on different viewport sizes (320px, 768px, 1920px) and verifying that both sections remain functional and readable.

**Acceptance Scenarios**:

1. **Given** I access the page on a mobile device (320px width), **When** I view both sections, **Then** cards and table rows stack appropriately and remain readable
2. **Given** I access the page on a tablet (768px width), **When** I view Section 1, **Then** cards display in an optimal grid layout
3. **Given** I access the page on a desktop (1920px width), **When** I view the entire page, **Then** both sections use available space efficiently without excessive whitespace

---

### Edge Cases

- What happens when a birthday falls exactly 30 days from today? (Should appear in Section 1 as it's within the 30-day window)
- What happens when today's date is a birthday? (Should appear in Section 1 as day 0 of the 30-day window)
- How does the system handle birthdays on February 29 in non-leap years? (Display on February 28 or March 1 in non-leap years)
- What happens when there are no birthdays at all in the system? (Display appropriate messaging in both sections)
- How does age calculation work when only month and day are provided? (Age cannot be calculated, display name and date only)
- What happens when the birth year is in the future (data error)? (Treat as invalid, display without age)
- How are birthdays sorted when multiple people share the same birthday? (Sort by name alphabetically as secondary sort)

## Requirements

### Functional Requirements

- **FR-001**: System MUST divide the home page into two distinct sections: upcoming birthdays (next 30 days) and all other birthdays
- **FR-002**: System MUST display birthdays occurring in the next 30 days (from today through today + 29 days) in Section 1 as individual cards
- **FR-003**: System MUST display each card in Section 1 with the person's name, calculated age (if birth year is available), and birthday date
- **FR-004**: System MUST sort cards in Section 1 by date in ascending order (earliest birthday first)
- **FR-005**: System MUST display birthdays from day 31 onwards through yesterday + 1 year in Section 2 as a table
- **FR-006**: System MUST display each table row in Section 2 with date, name, and age (if birth year is available)
- **FR-007**: System MUST calculate age based on the current year and birth year when birth year is provided
- **FR-008**: System MUST omit age display when birth year is not available in the data
- **FR-009**: System MUST handle the year boundary correctly (e.g., if today is December 15, Section 2 includes dates through December 14 next year)
- **FR-010**: System MUST display appropriate messaging when a section has no birthdays to display
- **FR-011**: System MUST maintain responsive design for both sections across viewport sizes from 320px to 1920px
- **FR-012**: System MUST handle today's date as part of the "next 30 days" window (day 0)
- **FR-013**: System MUST handle multiple birthdays on the same date by sorting alphabetically by name as a secondary sort criterion

### Key Entities

- **Birthday**: Represents a person's birthday with name, birth date (month and day), and optional birth year. The birth year determines whether age can be calculated and displayed.
- **Date Range**: Two calculated ranges based on today's date:
  - Upcoming range: today through today + 29 days (30-day window)
  - Future range: today + 30 days through yesterday + 1 year (complete annual cycle)

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can identify all birthdays in the next 30 days within 3 seconds of landing on the page
- **SC-002**: Users can scan through all birthdays for the entire year within 10 seconds
- **SC-003**: The page layout remains functional and readable on screens from 320px to 1920px width
- **SC-004**: Users can distinguish between urgent (next 30 days) and future birthdays at a glance through visual hierarchy
- **SC-005**: 100% of birthdays are displayed in exactly one section (no duplicates, no omissions)
- **SC-006**: Age is displayed correctly for all birthdays where birth year is available
