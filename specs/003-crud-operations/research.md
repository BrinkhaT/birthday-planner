# Research: Birthday Entry Management (CRUD Operations)

**Feature**: 003-crud-operations
**Date**: 2025-10-28
**Purpose**: Research technical decisions for implementing CRUD operations with modal dialogs

## Research Questions

1. Testing framework selection for Next.js App Router
2. Best practices for modal dialog management in React
3. Form validation patterns for ShadCN components
4. CRUD API patterns in Next.js App Router
5. State management for modals and forms in React 19

## Decisions

### Decision 1: Testing Framework

**Decision**: Defer testing framework selection to future feature

**Rationale**:
- Constitution Principle II (Simplicity First) - YAGNI principle applies
- Current feature can be validated manually through browser testing
- Testing framework introduces additional complexity and configuration
- Feature scope is small and self-contained (3 modal components, 2 API routes)
- Manual testing sufficient for home lab deployment with single user

**Alternatives Considered**:
- **Jest + React Testing Library**: Industry standard but adds build complexity
- **Vitest**: Modern, faster alternative but still adds configuration overhead
- **Playwright/Cypress**: E2E testing frameworks, overkill for this feature scope

**Action**: Keep "Testing: Manual browser testing" in Technical Context. Revisit testing strategy in future feature when test coverage becomes critical.

---

### Decision 2: Modal Dialog Management

**Decision**: Use ShadCN Dialog component with React 19 state hooks

**Rationale**:
- ShadCN Dialog is built on Radix UI primitives (accessible, keyboard navigation)
- Fits Constitution Principle III (Responsive Design) - mobile-first
- Simple state management: `useState` for open/closed state
- Supports click-outside-to-close behavior out of the box
- German localization easy with component props

**Pattern**:
```typescript
const [isOpen, setIsOpen] = useState(false)
const [mode, setMode] = useState<'add' | 'edit' | 'delete'>('add')
const [selectedBirthday, setSelectedBirthday] = useState<Birthday | null>(null)
```

**Alternatives Considered**:
- **Custom modal implementation**: More code, accessibility concerns, reinventing wheel
- **Third-party modal library**: Violates simplicity principle, unnecessary dependency

**Best Practices**:
- Single modal component handling multiple modes (add/edit)
- Separate confirmation dialog for delete operations
- Clear modal state on close to prevent data leaks
- Trap focus within modal for accessibility
- ESC key closes modal

---

### Decision 3: Form Validation

**Decision**: Client-side validation with HTML5 + TypeScript type guards

**Rationale**:
- Simplicity First - no form validation library needed
- HTML5 `required` attribute handles empty field validation
- HTML5 `type="date"` handles date format validation
- TypeScript provides compile-time type safety
- Custom validation function for edge cases (future dates, old ages)

**Pattern**:
```typescript
// HTML5 validation
<input type="text" required />
<input type="date" required max="2024-12-31" />

// Custom validation helper
function validateBirthday(name: string, birthdate: string): string | null {
  if (!name.trim()) return "Name ist erforderlich"
  if (!birthdate) return "Geburtsdatum ist erforderlich"
  // Additional checks for edge cases
  return null // valid
}
```

**Alternatives Considered**:
- **React Hook Form**: Powerful but overkill for 2-field form
- **Zod schema validation**: Adds dependency, excessive for simple form
- **Formik**: Legacy approach, not needed with React 19 hooks

**Best Practices**:
- Validate on submit, show errors immediately
- German error messages
- Clear errors when user corrects input
- Disable submit button during validation/save

---

### Decision 4: CRUD API Patterns

**Decision**: REST-style Next.js App Router API routes

**Rationale**:
- Follows Next.js App Router conventions
- Simple RESTful semantics: POST (create), PUT (update), DELETE (delete)
- Existing GET endpoint already established pattern
- No GraphQL complexity needed for simple CRUD

**Endpoints**:
```
POST   /api/birthdays/create     - Create new birthday
PUT    /api/birthdays/[id]       - Update existing birthday
DELETE /api/birthdays/[id]       - Delete birthday
GET    /api/birthdays            - List birthdays (existing)
```

**Response Format**:
```typescript
// Success
{ success: true, data: Birthday }

// Error
{ success: false, error: string }
```

**Alternatives Considered**:
- **GraphQL**: Overkill for simple CRUD, violates simplicity
- **tRPC**: TypeScript RPC framework, unnecessary for small API surface
- **Server Actions**: Next.js 14+ feature, could be considered but less RESTful

**Best Practices**:
- Validate input on server side as well
- Return appropriate HTTP status codes (200, 400, 404, 500)
- Atomic file operations for JSON writes
- Handle concurrent modification edge cases

---

### Decision 5: State Management

**Decision**: React 19 `useState` and `useOptimistic` for local state

**Rationale**:
- No global state needed - modal state is component-local
- React 19's `useOptimistic` provides instant UI updates
- Simplicity First - no Redux/Zustand/Jotai complexity
- Birthday list refresh handled via parent component re-fetch

**Pattern**:
```typescript
// Optimistic update pattern
const [birthdays, setBirthdays] = useState<Birthday[]>([])
const [optimisticBirthdays, setOptimisticBirthdays] = useOptimistic(birthdays)

async function handleAdd(newBirthday: Birthday) {
  // Optimistically add to UI
  setOptimisticBirthdays(prev => [...prev, newBirthday])

  // Call API
  const result = await fetch('/api/birthdays/create', {...})

  // Update real state
  setBirthdays(result.data)
}
```

**Alternatives Considered**:
- **Zustand**: Global state manager, unnecessary for component-local modals
- **React Context**: Could work but adds indirection for simple state
- **SWR/React Query**: Caching libraries, overkill for simple data fetching

**Best Practices**:
- Optimistic updates for instant feedback
- Handle API errors gracefully, rollback optimistic changes
- Refresh birthday list after CRUD operations
- Show loading states during API calls

---

## German Localization Strings

All UI text must be in German. Here are the required strings:

### Modal Titles
- "Geburtstag hinzufügen" (Add birthday)
- "Geburtstag bearbeiten" (Edit birthday)
- "Geburtstag löschen?" (Delete birthday?)

### Form Labels
- "Name" (Name)
- "Geburtsdatum" (Birthdate)

### Buttons
- "Speichern" (Save)
- "Abbrechen" (Cancel)
- "Löschen" (Delete)
- "Hinzufügen" (Add)

### Validation Messages
- "Name ist erforderlich" (Name is required)
- "Geburtsdatum ist erforderlich" (Birthdate is required)
- "Ungültiges Datum" (Invalid date)

### Confirmation Messages
- "Möchten Sie diesen Geburtstag wirklich löschen?" (Do you really want to delete this birthday?)
- "Diese Aktion kann nicht rückgängig gemacht werden." (This action cannot be undone.)

### Success/Error Messages
- "Geburtstag erfolgreich hinzugefügt" (Birthday successfully added)
- "Geburtstag erfolgreich aktualisiert" (Birthday successfully updated)
- "Geburtstag erfolgreich gelöscht" (Birthday successfully deleted)
- "Fehler beim Speichern" (Error saving)
- "Fehler beim Löschen" (Error deleting)

---

## Icon Selection

Using Lucide React icons (already in dependencies):

- **Add**: `Plus` or `PlusCircle`
- **Edit**: `Edit` or `Pencil`
- **Delete**: `Trash2` or `X`
- **Save**: `Check` or `Save`
- **Cancel**: `X` or `XCircle`

Icons must be touch-friendly on mobile (minimum 44x44px tap target).

---

## Summary

Research resolves all NEEDS CLARIFICATION items and establishes clear patterns:

1. **Testing**: Manual browser testing (deferred automated testing)
2. **Modals**: ShadCN Dialog with useState
3. **Validation**: HTML5 + custom TypeScript validators
4. **API**: REST-style Next.js App Router routes
5. **State**: React 19 useState + useOptimistic

All decisions align with Constitution principles (Simplicity First, ShadCN components, German localization).
