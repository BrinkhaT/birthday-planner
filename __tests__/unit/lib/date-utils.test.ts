import {
  parseBirthDate,
  isLeapYear,
  getNextOccurrence,
  calculateAge,
  sortBirthdays,
  splitBirthdays,
  groupBirthdaysByYear,
} from '@/lib/date-utils';
import { Birthday, BirthdayWithOccurrence } from '@/types/birthday';
import {
  BIRTHDAY_WITHOUT_YEAR,
} from '@/__tests__/fixtures/birthdays';
import {
  REF_DATE_LEAP_YEAR,
  REF_DATE_NON_LEAP,
  REF_DATE_MID_YEAR,
  REF_DATE_YEAR_END,
} from '@/__tests__/fixtures/dates';

describe('parseBirthDate', () => {
  it('parses ISO full date format (YYYY-MM-DD)', () => {
    const result = parseBirthDate('2000-12-25');
    expect(result).toEqual({ day: 25, month: 12, year: 2000 });
  });

  it('parses ISO short date format (--MM-DD)', () => {
    const result = parseBirthDate('--06-15');
    expect(result).toEqual({ day: 15, month: 6, year: null });
  });

  it('parses German date format with year (DD.MM.YYYY)', () => {
    const result = parseBirthDate('25.12.2000');
    expect(result).toEqual({ day: 25, month: 12, year: 2000 });
  });

  it('parses German date format without year (DD.MM.)', () => {
    const result = parseBirthDate('15.06.');
    expect(result).toEqual({ day: 15, month: 6, year: null });
  });

  it('parses German date format without year and trailing dot (DD.MM)', () => {
    const result = parseBirthDate('15.06');
    expect(result).toEqual({ day: 15, month: 6, year: null });
  });
});

describe('isLeapYear', () => {
  it('returns true for leap year 2000 (divisible by 400)', () => {
    expect(isLeapYear(2000)).toBe(true);
  });

  it('returns true for leap year 2024 (divisible by 4, not 100)', () => {
    expect(isLeapYear(2024)).toBe(true);
  });

  it('returns false for non-leap year 2100 (divisible by 100, not 400)', () => {
    expect(isLeapYear(2100)).toBe(false);
  });

  it('returns false for non-leap year 2025', () => {
    expect(isLeapYear(2025)).toBe(false);
  });
});

describe('getNextOccurrence', () => {
  it('returns date in same year when birthday is in future', () => {
    const birthday: Birthday = {
      id: 'test-1',
      name: 'Test',
      birthDate: '2000-12-25',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };
    const result = getNextOccurrence(birthday, REF_DATE_MID_YEAR);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(11); // December (0-indexed)
    expect(result.getDate()).toBe(25);
  });

  it('returns date in next year when birthday already passed', () => {
    const birthday: Birthday = {
      id: 'test-1',
      name: 'Test',
      birthDate: '2000-01-10',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };
    const result = getNextOccurrence(birthday, REF_DATE_MID_YEAR);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(0); // January
    expect(result.getDate()).toBe(10);
  });

  it('handles Feb 29 in non-leap year (falls back to Feb 28)', () => {
    const birthday: Birthday = {
      id: 'test-1',
      name: 'Leap Year Baby',
      birthDate: '2000-02-29',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };
    const result = getNextOccurrence(birthday, REF_DATE_NON_LEAP);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(1); // February
    expect(result.getDate()).toBe(28); // Falls back to Feb 28
  });

  it('handles Feb 29 in leap year', () => {
    const birthday: Birthday = {
      id: 'test-1',
      name: 'Leap Year Baby',
      birthDate: '2000-02-29',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };
    const result = getNextOccurrence(birthday, REF_DATE_LEAP_YEAR);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(1); // February
    expect(result.getDate()).toBe(29);
  });

  it('handles year boundary crossing', () => {
    const birthday: Birthday = {
      id: 'test-1',
      name: 'New Year',
      birthDate: '2000-01-05',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };
    const result = getNextOccurrence(birthday, REF_DATE_YEAR_END);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(0); // January
    expect(result.getDate()).toBe(5);
  });
});

describe('calculateAge', () => {
  it('returns age at next birthday when year provided', () => {
    const birthday: Birthday = {
      id: 'test-1',
      name: 'Test',
      birthDate: '2000-12-25',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };
    const result = calculateAge(birthday, REF_DATE_MID_YEAR);
    expect(result).toBe(25); // Will turn 25 at next birthday (Dec 25, 2025)
  });

  it('returns null when birth year not provided', () => {
    const result = calculateAge(BIRTHDAY_WITHOUT_YEAR, REF_DATE_MID_YEAR);
    expect(result).toBeNull();
  });

  it('returns null when birth year is in future (data error)', () => {
    const birthday: Birthday = {
      id: 'test-1',
      name: 'Future',
      birthDate: '3000-12-25',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };
    const result = calculateAge(birthday, REF_DATE_MID_YEAR);
    expect(result).toBeNull();
  });

  it('calculates age correctly for birthday that passed this year', () => {
    const birthday: Birthday = {
      id: 'test-1',
      name: 'Past',
      birthDate: '2000-01-10',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };
    const result = calculateAge(birthday, REF_DATE_MID_YEAR);
    expect(result).toBe(26); // Next birthday is Jan 10, 2026, will be 26
  });
});

describe('sortBirthdays', () => {
  it('sorts birthdays by next occurrence date ascending', () => {
    const birthdays: BirthdayWithOccurrence[] = [
      {
        id: 'test-1',
        name: 'Charlie',
        birthDate: '2000-12-25',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
        nextOccurrence: new Date('2025-12-25'),
        age: 25,
      },
      {
        id: 'test-2',
        name: 'Alice',
        birthDate: '2000-01-10',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
        nextOccurrence: new Date('2026-01-10'),
        age: 26,
      },
      {
        id: 'test-3',
        name: 'Bob',
        birthDate: '2000-06-15',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
        nextOccurrence: new Date('2025-06-15'),
        age: 25,
      },
    ];

    const result = sortBirthdays(birthdays);

    expect(result[0].name).toBe('Bob');
    expect(result[1].name).toBe('Charlie');
    expect(result[2].name).toBe('Alice');
  });

  it('sorts alphabetically by name when dates are the same', () => {
    const birthdays: BirthdayWithOccurrence[] = [
      {
        id: 'test-1',
        name: 'Charlie',
        birthDate: '2000-12-25',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
        nextOccurrence: new Date('2025-12-25'),
        age: 25,
      },
      {
        id: 'test-2',
        name: 'Alice',
        birthDate: '2000-12-25',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
        nextOccurrence: new Date('2025-12-25'),
        age: 25,
      },
      {
        id: 'test-3',
        name: 'Bob',
        birthDate: '2000-12-25',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
        nextOccurrence: new Date('2025-12-25'),
        age: 25,
      },
    ];

    const result = sortBirthdays(birthdays);

    expect(result[0].name).toBe('Alice');
    expect(result[1].name).toBe('Bob');
    expect(result[2].name).toBe('Charlie');
  });
});

describe('splitBirthdays', () => {
  it('splits birthdays into upcoming (30 days) and future', () => {
    const birthdays: Birthday[] = [
      {
        id: 'test-1',
        name: 'Soon',
        birthDate: '--06-20', // 5 days from REF_DATE_MID_YEAR (Jun 15)
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 'test-2',
        name: 'Later',
        birthDate: '--12-25', // 6+ months away
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 'test-3',
        name: 'Within30',
        birthDate: '--07-10', // 25 days from REF_DATE_MID_YEAR
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ];

    const result = splitBirthdays(birthdays, REF_DATE_MID_YEAR);

    expect(result.upcoming).toHaveLength(2);
    expect(result.upcoming.map(b => b.name)).toContain('Soon');
    expect(result.upcoming.map(b => b.name)).toContain('Within30');

    expect(result.future).toHaveLength(1);
    expect(result.future[0].name).toBe('Later');
  });

  it('handles empty array', () => {
    const result = splitBirthdays([], REF_DATE_MID_YEAR);

    expect(result.upcoming).toEqual([]);
    expect(result.future).toEqual([]);
  });

  it('sorts both arrays by date and name', () => {
    const birthdays: Birthday[] = [
      {
        id: 'test-1',
        name: 'Charlie',
        birthDate: '--06-25',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 'test-2',
        name: 'Alice',
        birthDate: '--06-20',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 'test-3',
        name: 'Bob',
        birthDate: '--06-20',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ];

    const result = splitBirthdays(birthdays, REF_DATE_MID_YEAR);

    // All should be in upcoming (within 30 days)
    expect(result.upcoming).toHaveLength(3);

    // First two should be Alice and Bob (same date, alphabetical)
    expect(result.upcoming[0].name).toBe('Alice');
    expect(result.upcoming[1].name).toBe('Bob');

    // Charlie is last (later date)
    expect(result.upcoming[2].name).toBe('Charlie');
  });

  it('handles 30-day boundary correctly', () => {
    const birthdays: Birthday[] = [
      {
        id: 'test-1',
        name: 'Boundary',
        birthDate: '--07-14', // Exactly 29 days from Jun 15
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 'test-2',
        name: 'JustPast',
        birthDate: '--07-16', // 31 days from Jun 15 - just past boundary
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ];

    const result = splitBirthdays(birthdays, REF_DATE_MID_YEAR);

    // Boundary should be upcoming (within 30 days)
    expect(result.upcoming).toHaveLength(1);
    expect(result.upcoming[0].name).toBe('Boundary');

    // JustPast should be in future (31 days away)
    expect(result.future).toHaveLength(1);
    expect(result.future[0].name).toBe('JustPast');
  });
});

describe('groupBirthdaysByYear', () => {
  it('groups birthdays by year of next occurrence', () => {
    const birthdays: BirthdayWithOccurrence[] = [
      {
        id: 'test-1',
        name: 'ThisYear1',
        birthDate: '2000-12-25',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
        nextOccurrence: new Date('2025-12-25'),
        age: 25,
      },
      {
        id: 'test-2',
        name: 'NextYear',
        birthDate: '2000-01-10',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
        nextOccurrence: new Date('2026-01-10'),
        age: 26,
      },
      {
        id: 'test-3',
        name: 'ThisYear2',
        birthDate: '2000-11-20',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
        nextOccurrence: new Date('2025-11-20'),
        age: 25,
      },
    ];

    const result = groupBirthdaysByYear(birthdays);

    expect(result).toHaveLength(2);

    // 2025 group
    expect(result[0].year).toBe(2025);
    expect(result[0].birthdays).toHaveLength(2);
    expect(result[0].birthdays.map(b => b.name)).toContain('ThisYear1');
    expect(result[0].birthdays.map(b => b.name)).toContain('ThisYear2');

    // 2026 group
    expect(result[1].year).toBe(2026);
    expect(result[1].birthdays).toHaveLength(1);
    expect(result[1].birthdays[0].name).toBe('NextYear');
  });

  it('sorts year groups by year ascending', () => {
    const birthdays: BirthdayWithOccurrence[] = [
      {
        id: 'test-1',
        name: 'Year2027',
        birthDate: '2000-01-10',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
        nextOccurrence: new Date('2027-01-10'),
        age: 27,
      },
      {
        id: 'test-2',
        name: 'Year2025',
        birthDate: '2000-12-25',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
        nextOccurrence: new Date('2025-12-25'),
        age: 25,
      },
      {
        id: 'test-3',
        name: 'Year2026',
        birthDate: '2000-06-15',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
        nextOccurrence: new Date('2026-06-15'),
        age: 26,
      },
    ];

    const result = groupBirthdaysByYear(birthdays);

    expect(result[0].year).toBe(2025);
    expect(result[1].year).toBe(2026);
    expect(result[2].year).toBe(2027);
  });

  it('sorts birthdays within each year group', () => {
    const birthdays: BirthdayWithOccurrence[] = [
      {
        id: 'test-1',
        name: 'Charlie',
        birthDate: '2000-12-25',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
        nextOccurrence: new Date('2025-12-25'),
        age: 25,
      },
      {
        id: 'test-2',
        name: 'Alice',
        birthDate: '2000-06-15',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
        nextOccurrence: new Date('2025-06-15'),
        age: 25,
      },
      {
        id: 'test-3',
        name: 'Bob',
        birthDate: '2000-09-20',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
        nextOccurrence: new Date('2025-09-20'),
        age: 25,
      },
    ];

    const result = groupBirthdaysByYear(birthdays);

    expect(result).toHaveLength(1);
    expect(result[0].year).toBe(2025);

    // Birthdays should be sorted by date
    expect(result[0].birthdays[0].name).toBe('Alice'); // Jun
    expect(result[0].birthdays[1].name).toBe('Bob'); // Sep
    expect(result[0].birthdays[2].name).toBe('Charlie'); // Dec
  });

  it('handles empty array', () => {
    const result = groupBirthdaysByYear([]);
    expect(result).toEqual([]);
  });
});
