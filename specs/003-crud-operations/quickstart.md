# Quickstart: Birthday Entry Management (CRUD Operations)

**Feature**: 003-crud-operations
**Date**: 2025-10-28
**Purpose**: Developer guide for implementing and testing CRUD operations

## Prerequisites

Before starting implementation, ensure:

1. **Development environment is running**:
   ```bash
   npm run dev
   # Application should be accessible at http://localhost:3000
   ```

2. **Existing features are functional**:
   - Birthday list display (card and table views) working
   - GET /api/birthdays endpoint returning data
   - JSON FileStore at `/data/birthdays.json` accessible

3. **Dependencies installed**:
   ```bash
   npm install
   # Verify ShadCN components are available
   ```

4. **Branch checked out**:
   ```bash
   git branch
   # Should show: * 003-crud-operations
   ```

---

## Implementation Order

Follow this sequence to build features incrementally:

### Phase 1: Add ShadCN Dialog Component

**Goal**: Install and configure ShadCN Dialog for modal functionality

```bash
# Add ShadCN Dialog component
npx shadcn@latest add dialog

# This installs:
# - components/ui/dialog.tsx
# - Radix UI dialog primitives
```

**Validation**:
- File `components/ui/dialog.tsx` exists
- Can import `Dialog, DialogContent, DialogHeader` from `@/components/ui/dialog`

---

### Phase 2: Create Birthday Form Component

**Goal**: Build reusable form for add/edit operations

**Files to create**:
- `components/birthday-form.tsx`
- `lib/validations.ts` (validation helpers)

**Key features**:
- Name input (text, required)
- Birthdate input (date picker, required, German format DD.MM.YYYY)
- Validation logic (client-side)
- German labels and error messages

**Validation**:
```bash
# Start dev server
npm run dev

# Test in browser console:
# - Form renders with empty fields
# - Required validation triggers on submit
# - German error messages display
```

---

### Phase 3: Create Modal Wrapper Component

**Goal**: Modal wrapper handling add/edit/delete modes

**Files to create**:
- `components/birthday-modal.tsx`
- `components/delete-confirmation.tsx`

**Key features**:
- State management (`useState` for isOpen, mode, selectedBirthday)
- Mode switching (add/edit/delete)
- Dialog component integration
- German modal titles

**Validation**:
```bash
# Test modal opens/closes
# Test mode switching
# Test keyboard navigation (ESC closes, Tab cycles focus)
```

---

### Phase 4: Add Icon Buttons to Existing Components

**Goal**: Add CRUD action buttons to birthday-card and birthday-table

**Files to modify**:
- `components/birthday-card.tsx`
- `components/birthday-table.tsx`

**Key features**:
- Icon buttons for Edit and Delete on each birthday entry
- Add button in prominent location (header/navigation)
- Icons from Lucide React (`Plus`, `Edit`, `Trash2`)
- Touch-friendly tap targets (44x44px minimum)

**Validation**:
```bash
# Visual inspection in browser:
# - Icons visible on cards and table rows
# - Buttons have proper hover states
# - Mobile responsive (test at 320px width)
```

---

### Phase 5: Implement CREATE API Endpoint

**Goal**: Add POST endpoint for creating birthdays

**Files to create**:
- `app/api/birthdays/create/route.ts`

**Key features**:
- Accept CreateBirthdayRequest (name, birthdate)
- Generate UUID for new birthday
- Validate input (server-side)
- Add timestamps (createdAt, updatedAt)
- Write to JSON FileStore atomically
- Return Birthday object

**Validation**:
```bash
# Test with curl:
curl -X POST http://localhost:3000/api/birthdays/create \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Person", "birthdate": "01.01.2000"}'

# Expected: {"success": true, "data": {...}}
```

---

### Phase 6: Implement UPDATE API Endpoint

**Goal**: Add PUT endpoint for updating birthdays

**Files to create**:
- `app/api/birthdays/[id]/route.ts`

**Key features**:
- Accept ID parameter and UpdateBirthdayRequest
- Find birthday by ID
- Validate input
- Update fields
- Update `updatedAt` timestamp
- Write to JSON FileStore atomically
- Return updated Birthday object

**Validation**:
```bash
# Test with curl (replace ID with actual UUID):
curl -X PUT http://localhost:3000/api/birthdays/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name", "birthdate": "02.02.2000"}'

# Expected: {"success": true, "data": {...}}
```

---

### Phase 7: Implement DELETE API Endpoint

**Goal**: Add DELETE endpoint for removing birthdays

**Files to modify**:
- `app/api/birthdays/[id]/route.ts` (add DELETE handler)

**Key features**:
- Accept ID parameter
- Find birthday by ID
- Remove from array
- Write to JSON FileStore atomically
- Return success message

**Validation**:
```bash
# Test with curl (replace ID with actual UUID):
curl -X DELETE http://localhost:3000/api/birthdays/550e8400-e29b-41d4-a716-446655440000

# Expected: {"success": true, "message": "Birthday successfully deleted"}
```

---

### Phase 8: Wire Up Frontend to API

**Goal**: Connect modal form actions to API endpoints

**Files to modify**:
- `components/birthday-modal.tsx`
- `app/page.tsx` (refresh birthday list after CRUD)

**Key features**:
- Optimistic updates using `useOptimistic`
- API calls on form submit
- Error handling and display
- Success feedback
- Birthday list refresh

**Validation**:
```bash
# End-to-end testing:
# 1. Click "Add" button → modal opens
# 2. Fill form → submit → birthday appears instantly
# 3. Click "Edit" on birthday → modal opens pre-filled
# 4. Modify data → submit → changes appear instantly
# 5. Click "Delete" → confirmation dialog opens
# 6. Confirm → birthday disappears instantly
```

---

### Phase 9: Manual Testing Checklist

**Goal**: Comprehensive validation before feature completion

**Functional Tests**:
- [ ] Add birthday with valid data succeeds
- [ ] Add birthday with empty name shows validation error
- [ ] Add birthday with empty birthdate shows validation error
- [ ] Add birthday with invalid date format shows error
- [ ] Edit birthday modifies existing entry
- [ ] Edit birthday validation works
- [ ] Delete birthday requires confirmation
- [ ] Delete confirmation can be cancelled
- [ ] Delete removes birthday from list

**UI/UX Tests**:
- [ ] All text is in German (buttons, labels, errors, messages)
- [ ] Dates display in DD.MM.YYYY format
- [ ] Modals are responsive on mobile (320px)
- [ ] Modals work on desktop (1920px)
- [ ] Icons are visible and touch-friendly
- [ ] ESC key closes modals
- [ ] Click outside closes modals
- [ ] Tab key cycles through form fields
- [ ] Focus is trapped within modal

**Data Persistence Tests**:
- [ ] Refresh page after add → birthday persists
- [ ] Refresh page after edit → changes persist
- [ ] Refresh page after delete → birthday gone
- [ ] Restart Docker container → data persists (volume mount)

**Edge Cases**:
- [ ] Add birthday with special characters in name
- [ ] Add birthday with very long name (100 chars)
- [ ] Add birthday with past date (very old person)
- [ ] Edit birthday to same values (no-op)
- [ ] Delete last remaining birthday (app still works)
- [ ] Rapid clicks don't create duplicate entries (debouncing)

---

## Common Issues & Solutions

### Issue: ShadCN Dialog not found

**Solution**:
```bash
npx shadcn@latest add dialog
```

### Issue: Date format shows ISO instead of DD.MM.YYYY

**Solution**: Use `toLocaleDateString('de-DE')` for display:
```typescript
const formattedDate = new Date(isoDate).toLocaleDateString('de-DE')
// Output: "28.10.2025"
```

### Issue: Modal doesn't close on ESC key

**Solution**: ShadCN Dialog handles this automatically. Ensure `<Dialog>` component wraps content.

### Issue: Icons too small on mobile

**Solution**: Ensure buttons have minimum 44x44px size:
```tsx
<Button size="icon" className="h-11 w-11">
  <Trash2 className="h-5 w-5" />
</Button>
```

### Issue: FileStore write errors

**Solution**: Check file permissions:
```bash
ls -la data/birthdays.json
# Should be writable by Node.js process
```

### Issue: German umlauts (ä, ö, ü) display incorrectly

**Solution**: Ensure UTF-8 encoding:
```typescript
// In layout.tsx
<html lang="de">
  <head>
    <meta charSet="UTF-8" />
  </head>
</html>
```

---

## Testing with Docker

After implementation, test in Docker environment:

```bash
# Build Docker image
docker-compose build

# Start container
docker-compose up -d

# Access application
open http://localhost:3000

# Check logs
docker-compose logs -f

# Test data persistence
# 1. Add a birthday via UI
# 2. Stop container: docker-compose down
# 3. Start container: docker-compose up -d
# 4. Verify birthday still exists
```

---

## Success Criteria Validation

Before marking feature complete, validate all success criteria from spec:

- [ ] **SC-001**: Add operation completes in under 30 seconds
- [ ] **SC-002**: Edit updates reflected immediately without page refresh
- [ ] **SC-003**: 100% of deletes require confirmation
- [ ] **SC-004**: All operations work on 320px and 1920px screens
- [ ] **SC-005**: Form validation prevents invalid submissions
- [ ] **SC-006**: CRUD operations complete in 3 clicks or fewer
- [ ] **SC-007**: Data persists after application restart

---

## Next Steps

After implementation complete:

1. Run `/speckit.tasks` to generate detailed task breakdown (NOT part of /speckit.plan)
2. Execute `/speckit.implement` to process tasks
3. Merge feature branch to develop
4. Deploy to home lab Docker environment
5. Monitor for issues in production use

---

## Reference Documentation

- [ShadCN Dialog](https://ui.shadcn.com/docs/components/dialog)
- [Next.js App Router API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [React 19 useOptimistic](https://react.dev/reference/react/useOptimistic)
- [Lucide React Icons](https://lucide.dev/icons/)
- Feature Spec: [spec.md](./spec.md)
- Data Model: [data-model.md](./data-model.md)
- API Contract: [contracts/api.yaml](./contracts/api.yaml)
