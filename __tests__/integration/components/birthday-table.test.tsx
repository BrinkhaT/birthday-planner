/**
 * Integration tests for BirthdayTable component - Milestone Highlighting
 * Tests cover:
 * - Milestone birthday row highlighting (age 18, multiples of 10)
 * - Non-milestone birthdays (no highlighting)
 * - Birthdays without age (no highlighting)
 * - Hover state for milestone rows
 */

import { render } from '@testing-library/react';
import { BirthdayTable } from '@/components/birthday-table';
import { createBirthdayWithOccurrence } from '../../helpers/test-utils';

describe('BirthdayTable - Milestone Highlighting', () => {
  it('highlights milestone birthday row (age 18) with amber background', () => {
    const birthdays = [
      createBirthdayWithOccurrence({
        id: 'test-18',
        name: 'Eighteen Year Old',
        birthDate: '2007-12-25',
        nextOccurrence: new Date('2025-12-25'),
        age: 18,
      }),
    ];

    const { container } = render(<BirthdayTable birthdays={birthdays} />);
    const row = container.querySelector('[class*="bg-amber-50"]');
    expect(row).toBeInTheDocument();
  });

  it('highlights milestone birthday row (age 30) with amber background', () => {
    const birthdays = [
      createBirthdayWithOccurrence({
        id: 'test-30',
        name: 'Thirty Year Old',
        birthDate: '1995-06-15',
        nextOccurrence: new Date('2025-06-15'),
        age: 30,
      }),
    ];

    const { container } = render(<BirthdayTable birthdays={birthdays} />);
    const row = container.querySelector('[class*="bg-amber-50"]');
    expect(row).toBeInTheDocument();
  });

  it('highlights milestone birthday row (age 50) with amber background', () => {
    const birthdays = [
      createBirthdayWithOccurrence({
        id: 'test-50',
        name: 'Fifty Year Old',
        birthDate: '1975-03-10',
        nextOccurrence: new Date('2025-03-10'),
        age: 50,
      }),
    ];

    const { container } = render(<BirthdayTable birthdays={birthdays} />);
    const row = container.querySelector('[class*="bg-amber-50"]');
    expect(row).toBeInTheDocument();
  });

  it('highlights decade milestone row (age 10) with amber background', () => {
    const birthdays = [
      createBirthdayWithOccurrence({
        id: 'test-10',
        name: 'Ten Year Old',
        birthDate: '2015-08-20',
        nextOccurrence: new Date('2025-08-20'),
        age: 10,
      }),
    ];

    const { container } = render(<BirthdayTable birthdays={birthdays} />);
    const row = container.querySelector('[class*="bg-amber-50"]');
    expect(row).toBeInTheDocument();
  });

  it('does NOT highlight non-milestone birthday row (age 25)', () => {
    const birthdays = [
      createBirthdayWithOccurrence({
        id: 'test-25',
        name: 'Twenty-Five Year Old',
        birthDate: '2000-03-10',
        nextOccurrence: new Date('2025-03-10'),
        age: 25,
      }),
    ];

    const { container } = render(<BirthdayTable birthdays={birthdays} />);
    const row = container.querySelector('[class*="bg-amber-50"]');
    expect(row).not.toBeInTheDocument();
  });

  it('does NOT highlight non-milestone birthday row (age 42)', () => {
    const birthdays = [
      createBirthdayWithOccurrence({
        id: 'test-42',
        name: 'Forty-Two Year Old',
        birthDate: '1983-07-15',
        nextOccurrence: new Date('2025-07-15'),
        age: 42,
      }),
    ];

    const { container } = render(<BirthdayTable birthdays={birthdays} />);
    const row = container.querySelector('[class*="bg-amber-50"]');
    expect(row).not.toBeInTheDocument();
  });

  it('does NOT highlight birthday row without age (no birth year)', () => {
    const birthdays = [
      createBirthdayWithOccurrence({
        id: 'test-noage',
        name: 'No Birth Year',
        birthDate: '--08-20',
        nextOccurrence: new Date('2025-08-20'),
        age: null,
      }),
    ];

    const { container } = render(<BirthdayTable birthdays={birthdays} />);
    const row = container.querySelector('[class*="bg-amber-50"]');
    expect(row).not.toBeInTheDocument();
  });

  it('does NOT highlight single-digit age row (age 5)', () => {
    const birthdays = [
      createBirthdayWithOccurrence({
        id: 'test-5',
        name: 'Five Year Old',
        birthDate: '2020-04-10',
        nextOccurrence: new Date('2025-04-10'),
        age: 5,
      }),
    ];

    const { container } = render(<BirthdayTable birthdays={birthdays} />);
    const row = container.querySelector('[class*="bg-amber-50"]');
    expect(row).not.toBeInTheDocument();
  });

  it('highlights only milestone birthdays in mixed list', () => {
    const birthdays = [
      createBirthdayWithOccurrence({
        id: 'test-18',
        name: 'Eighteen Year Old',
        birthDate: '2007-12-25',
        nextOccurrence: new Date('2025-12-25'),
        age: 18,
      }),
      createBirthdayWithOccurrence({
        id: 'test-25',
        name: 'Twenty-Five Year Old',
        birthDate: '2000-03-10',
        nextOccurrence: new Date('2025-03-10'),
        age: 25,
      }),
      createBirthdayWithOccurrence({
        id: 'test-30',
        name: 'Thirty Year Old',
        birthDate: '1995-06-15',
        nextOccurrence: new Date('2025-06-15'),
        age: 30,
      }),
      createBirthdayWithOccurrence({
        id: 'test-42',
        name: 'Forty-Two Year Old',
        birthDate: '1983-07-15',
        nextOccurrence: new Date('2025-07-15'),
        age: 42,
      }),
    ];

    const { container } = render(<BirthdayTable birthdays={birthdays} />);
    const amberRows = container.querySelectorAll('[class*="bg-amber-50"]');

    // Only 2 milestone birthdays should be highlighted (18 and 30)
    expect(amberRows).toHaveLength(2);
  });

  it('applies hover state classes to milestone rows', () => {
    const birthdays = [
      createBirthdayWithOccurrence({
        id: 'test-30',
        name: 'Thirty Year Old',
        birthDate: '1995-06-15',
        nextOccurrence: new Date('2025-06-15'),
        age: 30,
      }),
    ];

    const { container } = render(<BirthdayTable birthdays={birthdays} />);
    const row = container.querySelector('[class*="hover:bg-amber-100"]');
    expect(row).toBeInTheDocument();
  });
});
