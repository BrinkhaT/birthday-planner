# Data Model: Tech Baseline - Birthday List Display

**Feature**: 001-tech-baseline
**Date**: 2025-10-28
**Purpose**: Define data structures and storage schema for birthday data

## Entities

### Birthday

Represents a person's birthday in the system.

**Attributes**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| id | string (UUID) | Yes | Unique identifier | UUID v4 format |
| name | string | Yes | Person's name | 1-100 characters, non-empty |
| birthDate | string | Yes | Date of birth | DD.MM (no year) or DD.MM.YYYY (4-digit year) - German/European format |
| createdAt | string (ISO-8601) | Yes | Creation timestamp | ISO 8601 datetime |
| updatedAt | string (ISO-8601) | Yes | Last update timestamp | ISO 8601 datetime |

**Example**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Paula",
  "birthDate": "02.10.2024",
  "createdAt": "2025-10-28T10:00:00.000Z",
  "updatedAt": "2025-10-28T10:00:00.000Z"
}
```

## Storage Schema

### File: `birthdays.json`

The master data file containing all birthday records.

**Location**: `/data/birthdays.json` (Docker volume mount)

**Schema Version**: 1.1.0

**Structure**:
```json
{
  "version": "1.1.0",
  "birthdays": [
    {
      "id": "string (UUID)",
      "name": "string",
      "birthDate": "string (DD.MM or DD.MM.YYYY)",
      "createdAt": "string (ISO-8601)",
      "updatedAt": "string (ISO-8601)"
    }
  ]
}
```

**Full Example**:
```json
{
  "version": "1.1.0",
  "birthdays": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Paula",
      "birthDate": "02.10.2024",
      "createdAt": "2025-10-28T10:00:00.000Z",
      "updatedAt": "2025-10-28T10:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Thomas",
      "birthDate": "29.08.1988",
      "createdAt": "2025-10-28T10:00:00.000Z",
      "updatedAt": "2025-10-28T10:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Isabel",
      "birthDate": "12.07.1990",
      "createdAt": "2025-10-28T10:00:00.000Z",
      "updatedAt": "2025-10-28T10:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "Oma",
      "birthDate": "18.11",
      "createdAt": "2025-10-28T10:00:00.000Z",
      "updatedAt": "2025-10-28T10:00:00.000Z"
    }
  ]
}
```

## Validation Rules

### Birthday Entity Validation

1. **id**: Must be a valid UUID v4
2. **name**:
   - Cannot be empty or whitespace-only
   - Length between 1 and 100 characters
   - Can contain letters, numbers, spaces, hyphens, apostrophes
3. **birthDate**:
   - Must match format DD.MM (no year) or DD.MM.YYYY (4-digit year) - German/European format
   - Day: 01-31 (basic validation, no month-specific day validation for baseline)
   - Month: 01-12
   - Year: Optional; if provided, must be 4-digit year (1900-2100)
4. **createdAt**: Must be valid ISO 8601 datetime string
5. **updatedAt**: Must be valid ISO 8601 datetime string, >= createdAt

### File Schema Validation

1. **version**: Must be present and match semantic version format (e.g., "1.0.0")
2. **birthdays**: Must be an array (can be empty)
3. File must be valid JSON

## State Transitions

For this baseline feature, birthday records are static (read-only). No state transitions are required.

Future features may add:
- Create: Add new birthday
- Update: Modify existing birthday
- Delete: Remove birthday

## Relationships

No relationships for this baseline feature. Birthday entities are independent records.

## Indexing & Sorting

For this baseline feature:
- No indexing required (small dataset)
- No sorting required (display in storage order)

Future considerations:
- Sort by upcoming birthday date
- Sort alphabetically by name
- Filter by month

## Data Migration

### Version 1.0.0 (Initial)

Initial schema - no migration needed.

### Version 1.1.0 (Optional Year Support)

**Changes**:
- birthDate format updated from DD.MM.YY to DD.MM or DD.MM.YYYY (German/European format)
- Years migrated from 2-digit to 4-digit format
- Optional year support added (dates without year allowed)

**Migration Rules**:
- 2-digit years converted to 4-digit using century inference:
  - 00-30 → 20xx (e.g., 24 → 2024)
  - 31-99 → 19xx (e.g., 88 → 1988, 90 → 1990)
- New dates can omit year (e.g., "18.11" for unknown birth year)

**Migration Strategy for Future Versions**:
1. Check `version` field in JSON file
2. Apply transformation functions based on version
3. Update `version` field after migration
4. Atomic write with backup

## Error Handling

### File Operations

1. **File Not Found**: Initialize with empty birthdays array
2. **Invalid JSON**: Log error, return empty array, alert user
3. **Schema Mismatch**: Attempt migration, fallback to empty array
4. **Write Failure**: Rollback to previous version, alert user

### Validation Failures

1. **Invalid Birthday Data**: Skip invalid record, log warning, continue with valid records
2. **Missing Required Field**: Treat record as invalid, log warning
3. **Type Mismatch**: Attempt type coercion, fallback to string representation

## Performance Considerations

- File size: ~100 bytes per birthday record
- Expected max: ~100 birthdays = ~10KB
- Read operation: <1ms for files under 100KB
- Write operation: Atomic rename ensures consistency
- No indexing needed for this scale

## Backup & Recovery

### Backup Strategy

- JSON files are human-readable and version-controllable
- Docker volume can be backed up with standard tools
- Recommend daily backup of `/data` volume

### Recovery Strategy

1. Restore `/data/birthdays.json` from backup
2. Validate JSON structure
3. Run migration if version mismatch
4. Restart application

## TypeScript Types

```typescript
// types/birthday.ts

export interface Birthday {
  id: string;
  name: string;
  birthDate: string; // Format: DD.MM (no year) or DD.MM.YYYY (4-digit year)
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
}

export interface BirthdayStore {
  version: string;
  birthdays: Birthday[];
}

export interface BirthdayValidationError {
  field: string;
  message: string;
  value: any;
}
```

## Data Initialization

### Seed Data (Test Birthdays)

On first run, if `birthdays.json` doesn't exist, initialize with:

```json
{
  "version": "1.1.0",
  "birthdays": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Paula",
      "birthDate": "02.10.2024",
      "createdAt": "2025-10-28T10:00:00.000Z",
      "updatedAt": "2025-10-28T10:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Thomas",
      "birthDate": "29.08.1988",
      "createdAt": "2025-10-28T10:00:00.000Z",
      "updatedAt": "2025-10-28T10:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Isabel",
      "birthDate": "12.07.1990",
      "createdAt": "2025-10-28T10:00:00.000Z",
      "updatedAt": "2025-10-28T10:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "Oma",
      "birthDate": "18.11",
      "createdAt": "2025-10-28T10:00:00.000Z",
      "updatedAt": "2025-10-28T10:00:00.000Z"
    }
  ]
}
```

This matches the requirement from FR-008 in the specification, now updated to version 1.1.0 with optional year support.
