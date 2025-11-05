import { Birthday, BirthdayStore } from '@/types/birthday';

// Fixture: Complete birthday with year
export const BIRTHDAY_WITH_YEAR: Birthday = {
  id: 'test-id-001',
  name: 'Paula Müller',
  birthDate: '2000-12-25', // ISO format internally
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

// Fixture: Birthday without year
export const BIRTHDAY_WITHOUT_YEAR: Birthday = {
  id: 'test-id-002',
  name: 'Thomas Schmidt',
  birthDate: '--06-15', // ISO recurring date format
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

// Fixture: Leap year birthday (Feb 29)
export const BIRTHDAY_LEAP_YEAR: Birthday = {
  id: 'test-id-003',
  name: 'Lea Wagner',
  birthDate: '2000-02-29',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

// Fixture: Birthday in the past (for upcoming tests)
export const BIRTHDAY_PAST: Birthday = {
  id: 'test-id-004',
  name: 'Anna Becker',
  birthDate: '1995-01-10',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

// Fixture: Birthday in the future (for upcoming tests)
export const BIRTHDAY_FUTURE: Birthday = {
  id: 'test-id-005',
  name: 'Max Fischer',
  birthDate: '1990-11-20',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

// Fixture: Empty store (new installation)
export const EMPTY_STORE: BirthdayStore = {
  version: '1.0.0',
  birthdays: [],
};

// Fixture: Store with multiple birthdays
export const POPULATED_STORE: BirthdayStore = {
  version: '1.0.0',
  birthdays: [
    BIRTHDAY_WITH_YEAR,
    BIRTHDAY_WITHOUT_YEAR,
    BIRTHDAY_LEAP_YEAR,
  ],
};

// Fixture: Invalid store (for error handling tests)
export const INVALID_STORE_MISSING_VERSION = {
  birthdays: [BIRTHDAY_WITH_YEAR],
  // Missing 'version' field
};

export const INVALID_STORE_WRONG_TYPE = {
  version: '1.0.0',
  birthdays: 'not-an-array', // Wrong type
};
