/**
 * Test utility functions for creating test data
 */

import { Birthday, BirthdayWithOccurrence } from '@/types/birthday';

const DEFAULT_TIMESTAMP = '2024-01-01T00:00:00.000Z';

/**
 * Create a Birthday object with default timestamps for testing
 */
export function createBirthday(
  partial: Omit<Birthday, 'createdAt' | 'updatedAt'>
): Birthday {
  return {
    ...partial,
    createdAt: DEFAULT_TIMESTAMP,
    updatedAt: DEFAULT_TIMESTAMP,
  };
}

/**
 * Create a BirthdayWithOccurrence object with default timestamps for testing
 */
export function createBirthdayWithOccurrence(
  partial: Omit<BirthdayWithOccurrence, 'createdAt' | 'updatedAt'>
): BirthdayWithOccurrence {
  return {
    ...partial,
    createdAt: DEFAULT_TIMESTAMP,
    updatedAt: DEFAULT_TIMESTAMP,
  };
}
