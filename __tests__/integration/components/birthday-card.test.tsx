/**
 * Integration tests for BirthdayCard component - Milestone Highlighting
 * Tests cover:
 * - Milestone birthday highlighting (age 18, multiples of 10)
 * - Non-milestone birthdays (no highlighting)
 * - Birthdays without age (no highlighting)
 */

import { render } from '@testing-library/react';
import { BirthdayCard } from '@/components/birthday-card';
import { createBirthdayWithOccurrence } from '../../helpers/test-utils';

describe('BirthdayCard - Milestone Highlighting', () => {
  it('highlights milestone birthday (age 18) with amber border and background', () => {
    const milestone18 = createBirthdayWithOccurrence({
      id: 'test-18',
      name: 'Eighteen Year Old',
      birthDate: '2007-12-25',
      nextOccurrence: new Date('2025-12-25'),
      age: 18,
    });

    const { container } = render(<BirthdayCard birthday={milestone18} />);
    const card = container.querySelector('[class*="border-l-amber-500"]');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('bg-amber-50');
  });

  it('highlights milestone birthday (age 30) with amber styling', () => {
    const milestone30 = createBirthdayWithOccurrence({
      id: 'test-30',
      name: 'Thirty Year Old',
      birthDate: '1995-06-15',
      nextOccurrence: new Date('2025-06-15'),
      age: 30,
    });

    const { container } = render(<BirthdayCard birthday={milestone30} />);
    const card = container.querySelector('[class*="border-l-amber-500"]');
    expect(card).toBeInTheDocument();
  });

  it('highlights milestone birthday (age 50) with amber styling', () => {
    const milestone50 = createBirthdayWithOccurrence({
      id: 'test-50',
      name: 'Fifty Year Old',
      birthDate: '1975-03-10',
      nextOccurrence: new Date('2025-03-10'),
      age: 50,
    });

    const { container } = render(<BirthdayCard birthday={milestone50} />);
    const card = container.querySelector('[class*="border-l-amber-500"]');
    expect(card).toBeInTheDocument();
  });

  it('highlights decade milestone (age 10) with amber styling', () => {
    const milestone10 = createBirthdayWithOccurrence({
      id: 'test-10',
      name: 'Ten Year Old',
      birthDate: '2015-08-20',
      nextOccurrence: new Date('2025-08-20'),
      age: 10,
    });

    const { container } = render(<BirthdayCard birthday={milestone10} />);
    const card = container.querySelector('[class*="border-l-amber-500"]');
    expect(card).toBeInTheDocument();
  });

  it('does NOT highlight non-milestone birthday (age 25)', () => {
    const nonMilestone = createBirthdayWithOccurrence({
      id: 'test-25',
      name: 'Twenty-Five Year Old',
      birthDate: '2000-03-10',
      nextOccurrence: new Date('2025-03-10'),
      age: 25,
    });

    const { container } = render(<BirthdayCard birthday={nonMilestone} />);
    const card = container.querySelector('[class*="border-l-amber-500"]');
    expect(card).not.toBeInTheDocument();
  });

  it('does NOT highlight non-milestone birthday (age 42)', () => {
    const nonMilestone = createBirthdayWithOccurrence({
      id: 'test-42',
      name: 'Forty-Two Year Old',
      birthDate: '1983-07-15',
      nextOccurrence: new Date('2025-07-15'),
      age: 42,
    });

    const { container } = render(<BirthdayCard birthday={nonMilestone} />);
    const card = container.querySelector('[class*="border-l-amber-500"]');
    expect(card).not.toBeInTheDocument();
  });

  it('does NOT highlight birthday without age (no birth year)', () => {
    const noAge = createBirthdayWithOccurrence({
      id: 'test-noage',
      name: 'No Birth Year',
      birthDate: '--08-20',
      nextOccurrence: new Date('2025-08-20'),
      age: null,
    });

    const { container } = render(<BirthdayCard birthday={noAge} />);
    const card = container.querySelector('[class*="border-l-amber-500"]');
    expect(card).not.toBeInTheDocument();
  });

  it('does NOT highlight single-digit age (age 5)', () => {
    const youngAge = createBirthdayWithOccurrence({
      id: 'test-5',
      name: 'Five Year Old',
      birthDate: '2020-04-10',
      nextOccurrence: new Date('2025-04-10'),
      age: 5,
    });

    const { container } = render(<BirthdayCard birthday={youngAge} />);
    const card = container.querySelector('[class*="border-l-amber-500"]');
    expect(card).not.toBeInTheDocument();
  });
});
