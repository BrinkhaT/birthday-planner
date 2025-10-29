# Feature Specification: Birthday Entry Management (CRUD Operations)

**Feature Branch**: `003-crud-operations`
**Created**: 2025-10-28
**Status**: Draft
**Input**: User description: "Es soll die Möglichkeit geben neue Einträge hinzuzufügen aber auch die bestehenden zu bearbeiten und zu löschen. Dies sollte in einem Modal stattfinden. In den Karten und in der Tabelle sollen die Aktionen durch Icon-Buttons dargestellt werden. Das Löschen muss durch den Nutzer noch einmal bestätigt werden."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Add New Birthday Entry (Priority: P1)

Users need to add new birthday entries to the planner when they want to track birthdays of family members, friends, or colleagues.

**Why this priority**: This is the foundational capability that allows users to populate the birthday planner. Without the ability to add entries, the application cannot serve its core purpose.

**Independent Test**: Can be fully tested by clicking an "Add" button, filling out the modal form with name and birthdate, submitting it, and verifying the new entry appears in the birthday list. Delivers immediate value as users can start building their birthday collection.

**Acceptance Scenarios**:

1. **Given** the user is viewing the birthday list, **When** they click the "Add" icon button, **Then** a modal dialog opens with an empty form containing fields for name and birthdate
2. **Given** the add modal is open, **When** the user enters valid name and birthdate data and clicks "Save", **Then** the modal closes and the new birthday entry appears in the list
3. **Given** the add modal is open with incomplete data, **When** the user attempts to save, **Then** validation messages appear indicating which fields are required
4. **Given** the add modal is open, **When** the user clicks "Cancel" or outside the modal, **Then** the modal closes without saving and no new entry is created

---

### User Story 2 - Edit Existing Birthday Entry (Priority: P2)

Users need to update existing birthday entries when information changes or was entered incorrectly (e.g., correcting a birthdate or updating a name).

**Why this priority**: This enables users to maintain accurate data over time. While not as critical as adding entries, it's essential for long-term usability and data quality.

**Independent Test**: Can be tested by clicking an "Edit" icon button on an existing birthday card or table row, modifying the data in the modal form, saving, and verifying the changes appear in the list. Works independently as long as at least one birthday entry exists.

**Acceptance Scenarios**:

1. **Given** the user is viewing a birthday entry in the list or card view, **When** they click the "Edit" icon button, **Then** a modal dialog opens pre-filled with the current birthday data
2. **Given** the edit modal is open, **When** the user modifies the name or birthdate and clicks "Save", **Then** the modal closes and the updated information appears in the list
3. **Given** the edit modal is open, **When** the user clears required fields and attempts to save, **Then** validation messages appear preventing the save
4. **Given** the edit modal is open with unsaved changes, **When** the user clicks "Cancel", **Then** the modal closes and the original data remains unchanged in the list

---

### User Story 3 - Delete Birthday Entry with Confirmation (Priority: P3)

Users need to remove birthday entries when they are no longer needed (e.g., person no longer in contact, duplicate entry, or entry added by mistake).

**Why this priority**: While important for data hygiene, deletion is less frequently needed than adding or editing. The confirmation step makes this a safer, deliberate action.

**Independent Test**: Can be tested by clicking a "Delete" icon button on a birthday entry, confirming the deletion in the confirmation dialog, and verifying the entry is removed from the list. Works independently with any existing birthday entries.

**Acceptance Scenarios**:

1. **Given** the user is viewing a birthday entry, **When** they click the "Delete" icon button, **Then** a confirmation dialog appears asking the user to confirm the deletion
2. **Given** the delete confirmation dialog is open, **When** the user clicks "Confirm" or "Delete", **Then** the dialog closes and the birthday entry is permanently removed from the list
3. **Given** the delete confirmation dialog is open, **When** the user clicks "Cancel" or outside the dialog, **Then** the dialog closes and the birthday entry remains in the list unchanged
4. **Given** a birthday entry has been deleted, **When** the user views the birthday list, **Then** the deleted entry no longer appears in either card view or table view

---

### Edge Cases

- What happens when a user tries to add a birthday with a date in the future beyond realistic bounds (e.g., year 3000)?
- What happens when a user enters a birthdate that would make the person over 150 years old?
- How does the system handle special characters or very long names in the name field?
- What happens if two entries have identical names and birthdates?
- How does the system behave if a user opens multiple edit modals simultaneously (if technically possible)?
- What happens when a user tries to delete the last remaining birthday entry?
- How does the modal behave on very small mobile screens (320px width)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an icon button to add new birthday entries, visible in the main navigation or prominent location on the birthday list page
- **FR-002**: System MUST display edit and delete icon buttons on each birthday entry in both card view and table view
- **FR-003**: System MUST open a modal dialog when the add button is clicked, containing form fields for name (text) and birthdate (date)
- **FR-004**: System MUST open a modal dialog when an edit button is clicked, pre-populated with the current birthday entry data
- **FR-005**: System MUST validate that name and birthdate fields are not empty before allowing save in add/edit modals
- **FR-006**: System MUST validate that birthdate is a valid date format
- **FR-007**: System MUST close the add/edit modal when the user clicks "Save" after successful validation
- **FR-008**: System MUST close the add/edit modal when the user clicks "Cancel" or clicks outside the modal area, without saving changes
- **FR-009**: System MUST display a confirmation dialog when the user clicks the delete icon button on any birthday entry
- **FR-010**: System MUST permanently remove the birthday entry from storage when the user confirms deletion in the confirmation dialog
- **FR-011**: System MUST close the confirmation dialog and retain the birthday entry when the user clicks "Cancel" or clicks outside the dialog
- **FR-012**: System MUST immediately update the birthday list display after add, edit, or delete operations complete successfully
- **FR-013**: System MUST persist all add, edit, and delete operations to the JSON file storage
- **FR-014**: System MUST use icon-based buttons (not text labels) for add, edit, and delete actions in both card and table views
- **FR-015**: System MUST ensure modal dialogs are responsive and usable on mobile devices (minimum 320px width) and desktop screens (up to 1920px width)

### Key Entities

- **Birthday Entry**: Represents a person's birthday with attributes including unique identifier, name (text), birthdate (date), and calculated age
- **Modal State**: Represents the current state of modal dialogs including open/closed status, mode (add/edit/delete-confirm), and associated birthday entry data (for edit/delete operations)

### Assumptions and Dependencies

**Assumptions**:
- Users are familiar with basic web interactions (clicking buttons, filling forms, confirming actions)
- The existing birthday list view (card and table) is already implemented and functional
- Data persistence layer exists and supports atomic read/write operations
- Users access the application from devices with standard input methods (mouse/touch)

**Dependencies**:
- Existing birthday list display feature must be present for CRUD operations to be useful
- Persistent storage capability must be available to save changes
- The application must support modal dialog overlays
- Icon library or icon assets must be available for button representations

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a new birthday entry in under 30 seconds from clicking the add button to seeing the entry in the list
- **SC-002**: Users can successfully edit an existing birthday entry and see changes reflected immediately without page refresh
- **SC-003**: 100% of delete operations require and receive user confirmation before execution, preventing accidental deletions
- **SC-004**: All CRUD operations work seamlessly on mobile devices (320px width) and desktop screens (1920px width) without layout issues
- **SC-005**: Form validation prevents invalid data entry (empty fields, invalid dates) in 100% of cases before save
- **SC-006**: Users can complete any CRUD operation (add/edit/delete) in 3 clicks or fewer from the initial action button
- **SC-007**: All data changes persist correctly to JSON file storage and survive application restart
