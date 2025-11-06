# Feature Specification: Milestone Birthday Highlights

**Feature Branch**: `006-milestone-birthday-highlights`
**Created**: 2025-11-01
**Status**: Draft
**Input**: User description: "runde (volle 10er) und besondere Geburtstage (18.) sollen hervorgehoben werden. Die Tabellenzeile und die Karte soll auffallen."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Milestone Recognition (Priority: P1)

Users viewing the birthday list should immediately notice which birthdays are milestones (round decades: 10, 20, 30, 40, etc.) and special birthdays (18th birthday marking legal adulthood) through prominent visual highlighting in both card and table views.

**Why this priority**: This is the core value of the feature - enabling users to quickly identify important birthdays that typically require special celebration planning. Milestone birthdays are culturally significant and often need different levels of preparation.

**Independent Test**: Can be fully tested by viewing the birthday list with mixed ages and verifying that milestone birthdays (10, 20, 30, 40, 50, etc.) and 18th birthdays display with distinctive visual treatment that makes them immediately noticeable.

**Acceptance Scenarios**:

1. **Given** a birthday list containing people turning 18, 30, 42, and 50 years old, **When** the user views the "Anstehende Geburtstage" card view, **Then** the cards for the 18-, 30-, and 50-year-old birthdays are visually highlighted while the 42-year-old card displays normally
2. **Given** a birthday list in the "Alle weiteren Geburtstage" table view, **When** the user scrolls through the list, **Then** table rows for milestone birthdays (multiples of 10) and 18th birthdays are visually highlighted and stand out from regular birthday rows
3. **Given** a user viewing birthdays on a mobile device, **When** they see milestone birthdays in card format, **Then** the highlighting is clearly visible and maintains readability on small screens
4. **Given** a birthday entry without a birth year (age cannot be calculated), **When** the user views that entry, **Then** it displays normally without any milestone highlighting

---

### User Story 2 - Multiple Milestone Types (Priority: P2)

Users should be able to distinguish between different types of milestone birthdays, with the 18th birthday (legal adulthood) receiving special recognition alongside round decade milestones (10, 20, 30, etc.).

**Why this priority**: While all milestones are important, the 18th birthday has unique cultural significance in German-speaking regions as it marks the transition to legal adulthood. Distinguishing milestone types helps users prioritize their celebration planning.

**Independent Test**: Can be tested by creating entries for someone turning 18 and someone turning 50, then verifying both receive highlighting treatment that makes them stand out from non-milestone birthdays.

**Acceptance Scenarios**:

1. **Given** a list with birthdays at ages 17, 18, 19, 20, and 30, **When** the user views the list, **Then** only the 18-, 20-, and 30-year-old birthdays are highlighted
2. **Given** someone turning exactly 18 years old, **When** their birthday card is displayed, **Then** it receives the same level of visual prominence as decade milestones
3. **Given** a user viewing the table, **When** both 18th and round decade birthdays are present, **Then** both milestone types are clearly highlighted and distinguishable from non-milestones

---

### Edge Cases

- What happens when a birthday entry lacks a birth year (only month/day stored)? → Cannot calculate age, so no milestone highlighting applied
- How does the system handle someone turning 100 or other very high ages? → Treats all multiples of 10 (100, 110, etc.) as milestones
- What if the birth year data is invalid or produces a negative age? → No highlighting applied, displays as regular birthday
- How are 0th, 1st, and single-digit birthdays handled? → Only 10 and above are considered decade milestones (but not highlighted since under 18); 18 is highlighted as special milestone
- What happens when viewing upcoming birthdays where someone will turn 18 in the next 30 days? → The card shows milestone highlighting if the calculated age at birthday date is 18 or a multiple of 10

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST visually highlight birthday entries where the person will be turning exactly 18 years old
- **FR-002**: System MUST visually highlight birthday entries where the person will be turning a multiple of 10 years old (10, 20, 30, 40, 50, 60, 70, 80, 90, 100, etc.)
- **FR-003**: Highlighting MUST be applied to both card view (Anstehende Geburtstage) and table view (Alle weiteren Geburtstage)
- **FR-004**: System MUST calculate age based on birth year and upcoming birthday date to determine milestone status
- **FR-005**: System MUST NOT apply milestone highlighting to birthdays where birth year is absent or age cannot be calculated
- **FR-006**: Visual highlighting MUST make milestone birthdays stand out prominently from regular birthdays
- **FR-007**: Highlighting MUST remain readable and accessible on all supported screen sizes (320px-1920px)
- **FR-008**: System MUST treat both 18th birthdays and decade milestones with equal visual prominence

### Key Entities

- **Birthday Entry**: Existing entity with date field (may include or exclude birth year) that determines whether milestone highlighting applies based on calculated age

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify milestone birthdays (18, 20, 30, 40, 50, etc.) within 2 seconds of viewing the birthday list
- **SC-002**: Milestone highlighting is clearly visible and distinguishable from regular birthdays on screens ranging from 320px to 1920px width
- **SC-003**: 100% of birthdays with valid birth years that fall on ages 18 or multiples of 10 receive visual highlighting
- **SC-004**: 0% of birthdays without birth years or with incalculable ages incorrectly receive milestone highlighting
- **SC-005**: Users report improved ability to identify important birthdays requiring special celebration planning
