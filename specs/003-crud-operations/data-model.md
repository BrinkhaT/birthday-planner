# Data Model: Birthday Entry Management (CRUD Operations)

**Feature**: 003-crud-operations
**Date**: 2025-10-28
**Purpose**: Define data structures and validation rules for birthday CRUD operations

## Entities

### Birthday Entry

Represents a single birthday record in the system.

**Fields**:

| Field | Type | Required | Description | Validation Rules |
|-------|------|----------|-------------|------------------|
| `id` | string (UUID) | Yes | Unique identifier for the birthday entry | Auto-generated on creation, immutable |
| `name` | string | Yes | Person's name | Min 1 char, max 100 chars, trimmed |
| `birthdate` | string | Yes | Birthdate in DD.MM.YYYY format | Valid date, not future, realistic (< 150 years old) |
| `createdAt` | string (ISO-8601) | Yes | Creation timestamp | Auto-generated, immutable |
| `updatedAt` | string (ISO-8601) | Yes | Last update timestamp | Auto-updated on modification |

**Derived Fields** (computed, not stored):

| Field | Type | Description | Calculation |
|-------|------|-------------|-------------|
| `age` | number | Current age | Years from birthdate to today |
| `nextBirthday` | string | Next birthday date | Next occurrence of birthdate from today |
| `daysUntil` | number | Days until next birthday | Days from today to next birthday |

**TypeScript Interface**:

```typescript
interface Birthday {
  id: string
  name: string
  birthdate: string  // DD.MM.YYYY format
  createdAt: string  // ISO-8601
  updatedAt: string  // ISO-8601
}

interface BirthdayWithAge extends Birthday {
  age: number
  nextBirthday: string
  daysUntil: number
}
```

---

### Modal State

Represents the current state of the modal dialogs (not persisted).

**Fields**:

| Field | Type | Description | Possible Values |
|-------|------|-------------|-----------------|
| `isOpen` | boolean | Whether modal is currently open | `true`, `false` |
| `mode` | string | Current operation mode | `'add'`, `'edit'`, `'delete'` |
| `selectedBirthday` | Birthday \| null | Birthday being edited/deleted | `Birthday` object or `null` |

**TypeScript Interface**:

```typescript
type ModalMode = 'add' | 'edit' | 'delete'

interface ModalState {
  isOpen: boolean
  mode: ModalMode
  selectedBirthday: Birthday | null
}
```

---

## Validation Rules

### Name Validation

**Client-Side**:
- MUST NOT be empty (HTML5 `required` attribute)
- MUST be trimmed (remove leading/trailing whitespace)
- SHOULD have maximum 100 characters
- CAN contain any Unicode characters (support international names)

**Server-Side**:
- Same as client-side
- Additional sanitization to prevent injection attacks (if any)

**Error Messages**:
- Empty: "Name ist erforderlich"
- Too long: "Name darf maximal 100 Zeichen lang sein"

---

### Birthdate Validation

**Client-Side**:
- MUST NOT be empty (HTML5 `required` attribute)
- MUST be valid date (HTML5 `type="date"` validation)
- MUST be in DD.MM.YYYY display format (converted from ISO for storage)
- MUST NOT be in the future (HTML5 `max` attribute set to today)
- SHOULD result in age < 150 years (realistic bound)

**Server-Side**:
- Same as client-side
- Parse DD.MM.YYYY format to validate structure
- Calculate age and reject if > 150 years

**Error Messages**:
- Empty: "Geburtsdatum ist erforderlich"
- Invalid format: "Ungültiges Datum"
- Future date: "Geburtsdatum kann nicht in der Zukunft liegen"
- Too old: "Geburtsdatum ist unrealistisch"

---

## State Transitions

### Add Operation

```
Initial State: Modal closed, no selected birthday
  ↓
User clicks "Add" button
  ↓
Modal State: isOpen=true, mode='add', selectedBirthday=null
  ↓
User fills form and clicks "Save"
  ↓
Validation: Check name and birthdate
  ↓
[IF VALID]
  ↓
API Call: POST /api/birthdays/create
  ↓
[IF SUCCESS]
  ↓
Update birthday list (optimistic update)
  ↓
Close modal, reset state
  ↓
Final State: Modal closed, birthday added to list
```

---

### Edit Operation

```
Initial State: Modal closed, viewing birthday list
  ↓
User clicks "Edit" button on specific birthday
  ↓
Modal State: isOpen=true, mode='edit', selectedBirthday=<birthday object>
  ↓
Form pre-filled with existing data
  ↓
User modifies form and clicks "Save"
  ↓
Validation: Check name and birthdate
  ↓
[IF VALID]
  ↓
API Call: PUT /api/birthdays/[id]
  ↓
[IF SUCCESS]
  ↓
Update birthday in list (optimistic update)
  ↓
Close modal, reset state
  ↓
Final State: Modal closed, birthday updated in list
```

---

### Delete Operation

```
Initial State: Modal closed, viewing birthday list
  ↓
User clicks "Delete" button on specific birthday
  ↓
Modal State: isOpen=true, mode='delete', selectedBirthday=<birthday object>
  ↓
Confirmation dialog displays birthday name
  ↓
User clicks "Confirm"
  ↓
API Call: DELETE /api/birthdays/[id]
  ↓
[IF SUCCESS]
  ↓
Remove birthday from list (optimistic update)
  ↓
Close dialog, reset state
  ↓
Final State: Modal closed, birthday removed from list
```

---

## Data Storage Format

### JSON FileStore Structure

**File**: `/data/birthdays.json`

**Format**:
```json
{
  "version": 1,
  "birthdays": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Paula",
      "birthdate": "02.10.2024",
      "createdAt": "2025-10-28T10:00:00.000Z",
      "updatedAt": "2025-10-28T10:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Thomas",
      "birthdate": "29.08.1988",
      "createdAt": "2025-10-28T10:00:00.000Z",
      "updatedAt": "2025-10-28T10:00:00.000Z"
    }
  ]
}
```

**Schema Versioning**:
- `version: 1` - Current schema version
- Future schema changes MUST increment version and include migration logic

---

## Relationships

No complex relationships - Birthday entries are independent entities with no foreign keys or associations.

---

## Constraints

### Uniqueness

**No unique constraints on name or birthdate** - System allows duplicate names and birthdates (e.g., twins, people with same name).

**Unique constraint on `id`** - Each birthday has a unique UUID identifier.

### Concurrency

**FileStore Atomic Writes** - JSON file writes are atomic at the file level:
1. Read current file
2. Parse JSON
3. Modify data
4. Write to temporary file
5. Atomic rename/move to replace original

**Race Condition Handling**:
- Single-user application in home lab reduces concurrency risk
- If needed: Last-write-wins strategy
- Future: Add optimistic locking with `version` field per entry

---

## Summary

The data model is intentionally simple:
- Single entity (Birthday) with 5 stored fields + 3 computed fields
- Transient modal state (not persisted)
- Straightforward validation (required fields, date format, realistic bounds)
- No complex relationships or foreign keys
- Atomic file operations for consistency
- Versioned schema for future migrations

This aligns with Constitution Principle II (Simplicity First) and supports all functional requirements from the specification.
